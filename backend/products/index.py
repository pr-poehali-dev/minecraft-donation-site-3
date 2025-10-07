'''
Business: Управление товарами и покупками донат-магазина
Args: event - dict с httpMethod, body, queryStringParameters, params  
      context - object с атрибутами request_id
Returns: HTTP response dict с данными товаров и покупок
'''

import json
import os
import psycopg2
import time
from typing import Dict, Any

try:
    from mcrcon import MCRcon
    HAS_RCON = True
except ImportError:
    HAS_RCON = False

DSN = os.environ.get('DATABASE_URL')

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action', '')
        
        if action == 'purchase':
            return handle_purchase(event)
    
    query_params = event.get('queryStringParameters', {})
    if query_params.get('action') == 'purchases':
        return handle_get_purchases(event)
    
    try:
        conn = psycopg2.connect(DSN)
        cur = conn.cursor()
        
        if method == 'GET':
            cur.execute("""
                SELECT id, name, price, description, image_url, popular, discount, 
                       category, command_template, delivery_servers, in_stock, 
                       created_at, updated_at
                FROM t_p79689265_minecraft_donation_s.products
                WHERE in_stock = true
                ORDER BY popular DESC, created_at DESC
            """)
            
            rows = cur.fetchall()
            products = []
            
            for row in rows:
                products.append({
                    'id': row[0],
                    'name': row[1],
                    'price': float(row[2]),
                    'description': row[3],
                    'imageUrl': row[4],
                    'popular': row[5],
                    'discount': row[6],
                    'category': row[7],
                    'commandTemplate': row[8],
                    'servers': row[9] if row[9] else [],
                    'inStock': row[10],
                    'createdAt': row[11].isoformat() if row[11] else None,
                    'updatedAt': row[12].isoformat() if row[12] else None
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'products': products})
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            
            product_id = body_data.get('id', f'product_{int(time.time() * 1000)}')
            name = body_data.get('name')
            price = body_data.get('price')
            description = body_data.get('description', '')
            image_url = body_data.get('imageUrl', '')
            popular = body_data.get('popular', False)
            discount = body_data.get('discount', 0)
            category = body_data.get('category')
            command_template = body_data.get('commandTemplate', '')
            servers = body_data.get('servers', [])
            in_stock = body_data.get('inStock', True)
            
            cur.execute("""
                INSERT INTO t_p79689265_minecraft_donation_s.products 
                (id, name, price, description, image_url, popular, discount, 
                 category, command_template, delivery_servers, in_stock)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    name = EXCLUDED.name,
                    price = EXCLUDED.price,
                    description = EXCLUDED.description,
                    image_url = EXCLUDED.image_url,
                    popular = EXCLUDED.popular,
                    discount = EXCLUDED.discount,
                    category = EXCLUDED.category,
                    command_template = EXCLUDED.command_template,
                    delivery_servers = EXCLUDED.delivery_servers,
                    in_stock = EXCLUDED.in_stock,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING id
            """, (product_id, name, price, description, image_url, popular, 
                  discount, category, command_template, servers, in_stock))
            
            result_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True, 'productId': result_id})
            }
        
        if method == 'DELETE':
            query_params = event.get('queryStringParameters', {})
            product_id = query_params.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': False, 'error': 'Product ID required'})
                }
            
            cur.execute(
                "DELETE FROM t_p79689265_minecraft_donation_s.products WHERE id = %s",
                (product_id,)
            )
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': True})
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'success': False, 'error': 'Method not allowed'})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }

def handle_purchase(event: Dict[str, Any]) -> Dict[str, Any]:
    try:
        body_data = json.loads(event.get('body', '{}'))
        
        product_id = body_data.get('productId')
        player_nickname = body_data.get('playerNickname')
        server_id = body_data.get('serverId')
        
        if not all([product_id, player_nickname, server_id]):
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'productId, playerNickname и serverId обязательны'
                })
            }
        
        conn = psycopg2.connect(DSN)
        cur = conn.cursor()
        
        cur.execute("""
            SELECT name, price, discount, command_template 
            FROM t_p79689265_minecraft_donation_s.products 
            WHERE id = %s AND in_stock = true
        """, (product_id,))
        
        product = cur.fetchone()
        
        if not product:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': False, 'error': 'Товар не найден'})
            }
        
        product_name, price, discount, command_template = product
        final_price = price * (1 - discount / 100) if discount > 0 else price
        
        cur.execute("""
            SELECT address, rcon_port, rcon_password 
            FROM t_p79689265_minecraft_donation_s.rcon_servers 
            WHERE id = %s AND is_active = true
        """, (server_id,))
        
        rcon_server = cur.fetchone()
        
        if not rcon_server:
            cur.close()
            conn.close()
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': False, 'error': 'Сервер не найден'})
            }
        
        rcon_address, rcon_port, rcon_password = rcon_server
        
        delivery_command = command_template.replace('{player}', player_nickname)
        purchase_id = f'purchase_{int(time.time() * 1000)}'
        
        cur.execute("""
            INSERT INTO t_p79689265_minecraft_donation_s.purchases 
            (id, product_id, player_nickname, server_id, price_paid, 
             status, delivery_command)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id
        """, (purchase_id, product_id, player_nickname, server_id, 
              final_price, 'pending', delivery_command))
        
        conn.commit()
        
        if HAS_RCON:
            try:
                with MCRcon(rcon_address, rcon_password, port=rcon_port) as mcr:
                    response = mcr.command(delivery_command)
                
                cur.execute("""
                    UPDATE t_p79689265_minecraft_donation_s.purchases 
                    SET status = %s, delivered_at = CURRENT_TIMESTAMP 
                    WHERE id = %s
                """, ('delivered', purchase_id))
                conn.commit()
                
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': True,
                        'purchaseId': purchase_id,
                        'status': 'delivered',
                        'message': f'Товар "{product_name}" успешно доставлен игроку {player_nickname}!'
                    })
                }
                
            except Exception as rcon_error:
                cur.execute("""
                    UPDATE t_p79689265_minecraft_donation_s.purchases 
                    SET status = %s, error_message = %s 
                    WHERE id = %s
                """, ('failed', str(rcon_error), purchase_id))
                conn.commit()
                cur.close()
                conn.close()
                
                return {
                    'statusCode': 500,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'Ошибка доставки товара',
                        'details': str(rcon_error)
                    })
                }
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 501,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': 'RCON модуль не установлен'
                })
            }
            
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': False, 'error': str(e)})
        }

def handle_get_purchases(event: Dict[str, Any]) -> Dict[str, Any]:
    query_params = event.get('queryStringParameters', {})
    player_nickname = query_params.get('player')
    
    try:
        conn = psycopg2.connect(DSN)
        cur = conn.cursor()
        
        if player_nickname:
            cur.execute("""
                SELECT p.id, p.product_id, p.player_nickname, p.server_id, 
                       p.price_paid, p.status, p.created_at, p.delivered_at,
                       pr.name as product_name
                FROM t_p79689265_minecraft_donation_s.purchases p
                LEFT JOIN t_p79689265_minecraft_donation_s.products pr ON p.product_id = pr.id
                WHERE p.player_nickname = %s
                ORDER BY p.created_at DESC
                LIMIT 50
            """, (player_nickname,))
        else:
            cur.execute("""
                SELECT p.id, p.product_id, p.player_nickname, p.server_id, 
                       p.price_paid, p.status, p.created_at, p.delivered_at,
                       pr.name as product_name
                FROM t_p79689265_minecraft_donation_s.purchases p
                LEFT JOIN t_p79689265_minecraft_donation_s.products pr ON p.product_id = pr.id
                ORDER BY p.created_at DESC
                LIMIT 100
            """)
        
        rows = cur.fetchall()
        purchases = []
        
        for row in rows:
            purchases.append({
                'id': row[0],
                'productId': row[1],
                'playerNickname': row[2],
                'serverId': row[3],
                'pricePaid': float(row[4]),
                'status': row[5],
                'createdAt': row[6].isoformat() if row[6] else None,
                'deliveredAt': row[7].isoformat() if row[7] else None,
                'productName': row[8]
            })
        
        cur.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'purchases': purchases})
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': False, 'error': str(e)})
        }