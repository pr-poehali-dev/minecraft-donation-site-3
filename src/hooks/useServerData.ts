
import { useState, useEffect } from 'react';
import { Server, TimeRange } from '@/types/server';
import { generateServerHistory } from '@/utils/serverUtils';

/**
 * Хук для получения и обновления данных о серверах
 * @param initialServers Начальные данные серверов
 * @param timeRange Диапазон времени для исторических данных
 * @returns Обновленные данные серверов
 */
export const useServerData = (
  initialServers: Server[], 
  timeRange: TimeRange
): Server[] => {
  const [servers, setServers] = useState<Server[]>(initialServers);
  
  useEffect(() => {
    // Симуляция получения данных серверов
    const fetchServerData = () => {
      const updatedServers = servers.map(server => {
        const isOnline = Math.random() > 0.2;
        const randomPlayers = Math.floor(Math.random() * server.players.max * 0.7) + 5;
        const randomTPS = isOnline ? (Math.random() * 2 + 18).toFixed(1) : undefined;
        const randomUptime = isOnline ? Math.floor(Math.random() * 72) + 1 : undefined;
        
        // Генерация исторических данных
        const history = isOnline ? 
          generateServerHistory(server.players.max, timeRange) : [];
        
        return {
          ...server,
          status: isOnline ? 'online' : 'offline',
          players: { ...server.players, online: isOnline ? randomPlayers : 0 },
          tps: randomTPS ? parseFloat(randomTPS) : undefined,
          uptime: randomUptime,
          history,
        };
      });
      
      setServers(updatedServers);
    };
    
    fetchServerData();
    const interval = setInterval(fetchServerData, 60000); // обновление каждую минуту
    
    return () => clearInterval(interval);
  }, [timeRange]);
  
  return servers;
};
