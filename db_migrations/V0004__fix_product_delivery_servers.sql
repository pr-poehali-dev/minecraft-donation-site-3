-- Очистка старых ID серверов у товаров
UPDATE t_p79689265_minecraft_donation_s.products p
SET delivery_servers = ARRAY(
    SELECT s.id 
    FROM t_p79689265_minecraft_donation_s.rcon_servers s
    WHERE s.id = ANY(p.delivery_servers)
)
WHERE delivery_servers IS NOT NULL AND array_length(delivery_servers, 1) > 0;
