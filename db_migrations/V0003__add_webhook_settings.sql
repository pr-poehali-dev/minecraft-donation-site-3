-- Таблица настроек для webhook
CREATE TABLE IF NOT EXISTS t_p79689265_minecraft_donation_s.webhook_settings (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'default',
    webhook_url TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставляем дефолтную запись
INSERT INTO t_p79689265_minecraft_donation_s.webhook_settings (id, is_enabled) 
VALUES ('default', FALSE)
ON CONFLICT (id) DO NOTHING;