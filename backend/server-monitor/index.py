'''
Business: Автономный скрипт мониторинга серверов Minecraft
Args: event - CloudFunction event dict, context - execution context object
Returns: HTTP response with updated server stats
'''

import json
import socket
import struct
import time
from typing import Dict, Any, List, Optional, Tuple

def ping_minecraft_server(host: str, port: int, timeout: int = 5) -> Optional[Dict[str, Any]]:
    """
    Пингует Minecraft сервер и возвращает статистику
    """
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        
        start_time = time.time()
        sock.connect((host, port))
        
        # Handshake packet
        handshake = b'\x00\x00'
        handshake += host.encode('utf-8')
        handshake += struct.pack('>H', port)
        handshake += b'\x01'
        
        # Send handshake
        sock.send(b'\x00' + handshake)
        
        # Request status
        sock.send(b'\x01\x00')
        
        # Read response
        length = _read_varint(sock)
        packet_id = _read_varint(sock)
        
        if packet_id != 0:
            sock.close()
            return None
        
        data_length = _read_varint(sock)
        data = b''
        while len(data) < data_length:
            chunk = sock.recv(data_length - len(data))
            if not chunk:
                break
            data += chunk
        
        ping_time = int((time.time() - start_time) * 1000)
        sock.close()
        
        response = json.loads(data.decode('utf-8'))
        
        return {
            'isOnline': True,
            'ping': ping_time,
            'version': response.get('version', {}).get('name', 'Unknown'),
            'maxPlayers': response.get('players', {}).get('max', 0),
            'onlinePlayers': response.get('players', {}).get('online', 0),
            'motd': _clean_motd(response.get('description', '')),
            'playerList': [p.get('name', '') for p in response.get('players', {}).get('sample', [])]
        }
        
    except (socket.timeout, socket.error, ConnectionRefusedError, json.JSONDecodeError):
        return {
            'isOnline': False,
            'ping': 0,
            'version': '',
            'maxPlayers': 0,
            'onlinePlayers': 0,
            'motd': 'Сервер недоступен',
            'playerList': []
        }
    except Exception:
        return None

def _read_varint(sock: socket.socket) -> int:
    """
    Читает VarInt из сокета
    """
    result = 0
    for i in range(5):
        byte = sock.recv(1)
        if not byte:
            raise EOFError('Unexpected end of stream')
        
        byte_val = ord(byte)
        result |= (byte_val & 0x7F) << (7 * i)
        
        if not byte_val & 0x80:
            break
    
    return result

def _clean_motd(motd: Any) -> str:
    """
    Очищает MOTD от Minecraft форматирования
    """
    if isinstance(motd, dict):
        if 'text' in motd:
            return motd['text']
        if 'extra' in motd:
            return ''.join(_clean_motd(part) for part in motd['extra'])
        return ''
    if isinstance(motd, str):
        return motd
    return str(motd)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Обновляет статистику всех серверов из мониторинга
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            servers: List[Dict[str, Any]] = body_data.get('servers', [])
            
            updated_stats: Dict[str, Dict[str, Any]] = {}
            
            for server in servers:
                if not server.get('isActive', False):
                    continue
                
                server_id = server.get('id')
                address = server.get('address')
                port = server.get('port', 25565)
                max_players = server.get('maxPlayers', 100)
                
                if not server_id or not address:
                    continue
                
                stats = ping_minecraft_server(address, port)
                
                if stats:
                    updated_stats[server_id] = {
                        'id': f'stats_{server_id}',
                        'serverId': server_id,
                        'onlinePlayers': stats['onlinePlayers'],
                        'maxPlayers': stats['maxPlayers'] if stats['maxPlayers'] > 0 else max_players,
                        'ping': stats['ping'],
                        'isOnline': stats['isOnline'],
                        'version': stats['version'] or server.get('version', ''),
                        'motd': stats['motd'],
                        'playerList': stats['playerList'],
                        'lastUpdate': time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime())
                    }
                else:
                    updated_stats[server_id] = {
                        'id': f'stats_{server_id}',
                        'serverId': server_id,
                        'onlinePlayers': 0,
                        'maxPlayers': max_players,
                        'ping': 0,
                        'isOnline': False,
                        'version': server.get('version', ''),
                        'motd': 'Ошибка при проверке сервера',
                        'playerList': [],
                        'lastUpdate': time.strftime('%Y-%m-%dT%H:%M:%S.000Z', time.gmtime())
                    }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'stats': updated_stats,
                    'checkedServers': len(updated_stats)
                })
            }
            
        except json.JSONDecodeError:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': 'Invalid JSON in request body'})
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'isBase64Encoded': False,
                'body': json.dumps({'error': f'Server error: {str(e)}'})
            }
    
    return {
        'statusCode': 405,
        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }