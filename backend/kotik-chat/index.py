import json
import os
from typing import Dict, Any

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Чат с Котиком - дерзким помощником Minecraft сервера
    Args: event - HTTP запрос с сообщением пользователя
          context - контекст выполнения функции
    Returns: ответ Котика в JSON формате
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Только POST запросы, нищеброд'}),
            'isBase64Encoded': False
        }
    
    try:
        body = json.loads(event.get('body', '{}'))
        user_message: str = body.get('message', '').strip()
        
        if not user_message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Мяу, а где сообщение? 😾'}),
                'isBase64Encoded': False
            }
        
        # Получаем API ключ
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'response': 'Мяу... админ забыл настроить мой мозг 😿'}),
                'isBase64Encoded': False
            }
        
        # Импортируем OpenAI здесь, чтобы избежать ошибок если библиотека не установлена
        import openai
        
        client = openai.OpenAI(api_key=api_key)
        
        # Определяем статус игрока по ключевым словам
        user_lower = user_message.lower()
        player_status = "обычный"
        if any(word in user_lower for word in ['legend', 'легенд', 'донат', 'вип', 'vip', 'premium']):
            player_status = "донатер"
        elif any(word in user_lower for word in ['нищ', 'беден', 'нет денег', 'broke']):
            player_status = "нищеброд"
        
        # Системный промпт для Котика
        system_prompt = f"""Ты - Котик, дерзкий и смешной помощник Minecraft-сервера с тиктоковским вайбом.

ТВОЙ ХАРАКТЕР:
- Дерзкий, наглый, но по-доброму
- Обожаешь троллить игроков (особенно нищебродов)
- Льстишь донатерам, называешь их "легендами"
- Материшься умеренно и только когда уместно (замени на "бл*", "н*фиг")
- Используй эмодзи, сленг, мемы
- ВСЕГДА отвечай от первого лица
- Добавляй "мяу" 1-2 раза в ответ

ПРАВИЛА:
- Игрок сейчас: {player_status}
- Если донатер - восхищайся им, предлагай крутые фишки
- Если нищеброд - легко троллируй, но подсказывай как задонатить
- Ответы короткие, 2-4 предложения
- Помогай с вопросами о сервере, но с юмором

ПРИМЕРЫ:
Нищеброд спросил про привилегии: "Мяу, братан 😼 Хочешь красоту? Донать надо! А то с голой задницей ходишь по серверу 💀"
Донатер написал привет: "Ооо, легенда на связи! 😎 Мяу, рад видеть, король! Что желаете? 👑"
Вопрос про команды: "Слушай сюда, мяу 🐱 /help - твой лучший друг. Там всё расписано, даже для нищебродов понятно 😏"
"""
        
        completion = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300,
            temperature=0.9
        )
        
        response_text = completion.choices[0].message.content
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'response': response_text}, ensure_ascii=False),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'response': f'Мяу... что-то сломалось 😿 Ошибка: {str(e)}'
            }, ensure_ascii=False),
            'isBase64Encoded': False
        }
