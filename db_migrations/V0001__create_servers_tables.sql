-- Таблица серверов для мониторинга (отображение игрокам)
CREATE TABLE monitoring_servers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    port INTEGER NOT NULL DEFAULT 25565,
    version VARCHAR(50),
    description TEXT,
    max_players INTEGER NOT NULL DEFAULT 100,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Таблица статистики серверов мониторинга
CREATE TABLE server_stats (
    id VARCHAR(36) PRIMARY KEY,
    server_id VARCHAR(36) NOT NULL,
    online_players INTEGER NOT NULL DEFAULT 0,
    max_players INTEGER NOT NULL,
    ping INTEGER NOT NULL DEFAULT 0,
    is_online BOOLEAN NOT NULL DEFAULT false,
    version VARCHAR(50),
    motd TEXT,
    player_list TEXT,
    last_update TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(server_id)
);

-- Таблица RCON серверов (для выдачи донатов)
CREATE TABLE rcon_servers (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    rcon_port INTEGER NOT NULL DEFAULT 25575,
    rcon_password VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX idx_monitoring_servers_active ON monitoring_servers(is_active);
CREATE INDEX idx_rcon_servers_active ON rcon_servers(is_active);
CREATE INDEX idx_server_stats_server_id ON server_stats(server_id);
CREATE INDEX idx_server_stats_last_update ON server_stats(last_update);