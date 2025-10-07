import json
import os
import psycopg2
from typing import Dict, Any, List
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: API для управления мониторингом серверов
    Args: event с httpMethod, body, queryStringParameters
    Returns: HTTP response с данными серверов мониторинга
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
                    "SELECT id, name, address, port, version, description, max_players, is_active, created_at, updated_at "
                    "FROM monitoring_servers WHERE id = %s",
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
                    'port': row[3],
                    'version': row[4],
                    'description': row[5],
                    'maxPlayers': row[6],
                    'isActive': row[7],
                    'createdAt': row[8].isoformat() if row[8] else None,
                    'updatedAt': row[9].isoformat() if row[9] else None
                }
                
                cur.execute(
                    "SELECT online_players, max_players, ping, is_online, version, motd, last_update "
                    "FROM server_stats WHERE server_id = %s",
                    (server_id,)
                )
                stats_row = cur.fetchone()
                
                if stats_row:
                    server['stats'] = {
                        'onlinePlayers': stats_row[0],
                        'maxPlayers': stats_row[1],
                        'ping': stats_row[2],
                        'isOnline': stats_row[3],
                        'version': stats_row[4],
                        'motd': stats_row[5],
                        'lastUpdate': stats_row[6].isoformat() if stats_row[6] else None
                    }
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'server': server})
                }
            else:
                cur.execute(
                    "SELECT m.id, m.name, m.address, m.port, m.version, m.description, m.max_players, m.is_active, "
                    "s.online_players, s.max_players, s.ping, s.is_online, s.motd, s.last_update "
                    "FROM monitoring_servers m "
                    "LEFT JOIN server_stats s ON m.id = s.server_id "
                    "WHERE m.is_active = true "
                    "ORDER BY m.created_at DESC"
                )
                rows = cur.fetchall()
                
                servers = []
                for row in rows:
                    server = {
                        'id': row[0],
                        'name': row[1],
                        'address': row[2],
                        'port': row[3],
                        'version': row[4],
                        'description': row[5],
                        'maxPlayers': row[6],
                        'isActive': row[7]
                    }
                    
                    if row[8] is not None:
                        server['stats'] = {
                            'onlinePlayers': row[8],
                            'maxPlayers': row[9],
                            'ping': row[10],
                            'isOnline': row[11],
                            'motd': row[12],
                            'lastUpdate': row[13].isoformat() if row[13] else None
                        }
                    
                    servers.append(server)
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'success': True, 'servers': servers})
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            required_fields = ['id', 'name', 'address', 'port', 'maxPlayers']
            for field in required_fields:
                if field not in body_data:
                    return {
                        'statusCode': 400,
                        'headers': headers,
                        'body': json.dumps({'error': f'Поле {field} обязательно'})
                    }
            
            cur.execute(
                "INSERT INTO monitoring_servers (id, name, address, port, version, description, max_players, is_active) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s) "
                "RETURNING id",
                (
                    body_data['id'],
                    body_data['name'],
                    body_data['address'],
                    body_data['port'],
                    body_data.get('version', ''),
                    body_data.get('description', ''),
                    body_data['maxPlayers'],
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
                "UPDATE monitoring_servers SET "
                "name = %s, address = %s, port = %s, version = %s, description = %s, "
                "max_players = %s, is_active = %s, updated_at = CURRENT_TIMESTAMP "
                "WHERE id = %s",
                (
                    body_data.get('name'),
                    body_data.get('address'),
                    body_data.get('port'),
                    body_data.get('version', ''),
                    body_data.get('description', ''),
                    body_data.get('maxPlayers'),
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
            
            cur.execute("UPDATE monitoring_servers SET is_active = false WHERE id = %s", (server_id,))
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