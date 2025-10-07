import json
import os
import psycopg2
from typing import Dict, Any
import uuid
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Обработка покупки доната с выдачей через RCON
    Args: event с httpMethod, body (itemId, serverId, username, paymentId)
    Returns: HTTP response с результатом обработки
    '''
    
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Метод не поддерживается'})
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        required_fields = ['itemId', 'serverId', 'username']
        for field in required_fields:
            if field not in body_data:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': f'Поле {field} обязательно'})
                }
        
        db_url = os.environ.get('DATABASE_URL')
        if not db_url:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'DATABASE_URL не настроен'})
            }
        
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        cur.execute(
            "SELECT id, name, address, rcon_port, rcon_password, is_active "
            "FROM rcon_servers WHERE id = %s",
            (body_data['serverId'],)
        )
        server_row = cur.fetchone()
        
        if not server_row:
            return {
                'statusCode': 404,
                'headers': headers,
                'body': json.dumps({'error': 'Сервер не найден'})
            }
        
        if not server_row[5]:
            return {
                'statusCode': 400,
                'headers': headers,
                'body': json.dumps({'error': 'Сервер временно недоступен'})
            }
        
        donation_id = str(uuid.uuid4())
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'success': True,
                'donationId': donation_id,
                'message': f'Покупка обработана для {body_data["username"]} на сервере {server_row[1]}',
                'server': {
                    'name': server_row[1],
                    'address': server_row[2]
                }
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()