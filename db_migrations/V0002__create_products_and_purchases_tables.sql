-- Таблица товаров
CREATE TABLE IF NOT EXISTS t_p79689265_minecraft_donation_s.products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url TEXT,
    popular BOOLEAN DEFAULT FALSE,
    discount INTEGER DEFAULT 0,
    category VARCHAR(100) NOT NULL,
    command_template TEXT NOT NULL,
    delivery_servers TEXT[] DEFAULT '{}',
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица покупок
CREATE TABLE IF NOT EXISTS t_p79689265_minecraft_donation_s.purchases (
    id VARCHAR(255) PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL REFERENCES t_p79689265_minecraft_donation_s.products(id),
    player_nickname VARCHAR(100) NOT NULL,
    server_id VARCHAR(255) NOT NULL,
    price_paid DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    delivery_command TEXT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivered_at TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_purchases_player ON t_p79689265_minecraft_donation_s.purchases(player_nickname);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON t_p79689265_minecraft_donation_s.purchases(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON t_p79689265_minecraft_donation_s.products(category);