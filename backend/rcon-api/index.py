import json
import os
import psycopg2
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления RCON серверами (выдача донатов)
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными RCON серверов
    '''
    
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    try:
        db_url = os.environ.get('DATABASE_URL')
        if not db_url:
            return {
                'statusCode': 500,
                'headers': headers,
                'body': json.dumps({'error': 'DATABASE_URL не настроен'})
            }
        
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            server_id = query_params.get('id')
            
            if server_id:
                cur.execute(
                    "SELECT id, name, address, rcon_port, rcon_password, description, is_active, created_at, updated_at "
                    "FROM rcon_servers WHERE id = %s",
                    (server_id,)
                )
                row = cur.fetchone()
                
                if not row:
                    return {
                        'statusCode': 404,
                        'headers': headers,
                        'body': json.dumps({'error': 'Сервер не найден'})
                    }
                
                server = {
                    'id': row[0],
                    'name': row[1],
                    'address': row[2],
                    'rconPort': row[3],
                    'rconPassword': row[4],
                    'description': row[5],
                    'isActive': row[6],
                    'createdAt': row[7].isoformat() if row[7] else None,
                    'updatedAt': row[8].isoformat() if row[8] else None
                }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'server': server})
                }
            else:
                cur.execute(
                    "SELECT id, name, address, rcon_port, description, is_active "
                    "FROM rcon_servers "
                    "WHERE is_active = true "
                    "ORDER BY created_at DESC"
                )
                rows = cur.fetchall()
                
                servers = []
                for row in rows:
                    servers.append({
                        'id': row[0],
                        'name': row[1],
                        'address': row[2],
                        'rconPort': row[3],
                        'description': row[4],
                        'isActive': row[5]
                    })
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'servers': servers})
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            required_fields = ['id', 'name', 'address', 'rconPort', 'rconPassword']
            for field in required_fields:
                if field not in body_data:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': f'Поле {field} обязательно'})
                    }
            
            cur.execute(
                "INSERT INTO rcon_servers (id, name, address, rcon_port, rcon_password, description, is_active) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s) "
                "RETURNING id",
                (
                    body_data['id'],
                    body_data['name'],
                    body_data['address'],
                    body_data['rconPort'],
                    body_data['rconPassword'],
                    body_data.get('description', ''),
                    body_data.get('isActive', True)
                )
            )
            
            server_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps({'success': True, 'serverId': server_id})
            }
        
        elif method == 'PUT':
            body_data = json.loads(event.get('body', '{}'))
            server_id = body_data.get('id')
            
            if not server_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'ID сервера обязателен'})
                }
            
            cur.execute(
                "UPDATE rcon_servers SET "
                "name = %s, address = %s, rcon_port = %s, rcon_password = %s, "
                "description = %s, is_active = %s, updated_at = CURRENT_TIMESTAMP "
                "WHERE id = %s",
                (
                    body_data.get('name'),
                    body_data.get('address'),
                    body_data.get('rconPort'),
                    body_data.get('rconPassword'),
                    body_data.get('description', ''),
                    body_data.get('isActive', True),
                    server_id
                )
            )
            
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True, 'serverId': server_id})
            }
        
        elif method == 'DELETE':
            query_params = event.get('queryStringParameters', {}) or {}
            server_id = query_params.get('id')
            
            if not server_id:
                return {
                    'statusCode': 400,
                    'headers': headers,
                    'body': json.dumps({'error': 'ID сервера обязателен'})
                }
            
            cur.execute("UPDATE rcon_servers SET is_active = false WHERE id = %s", (server_id,))
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': headers,
            'body': json.dumps({'error': 'Метод не поддерживается'})
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