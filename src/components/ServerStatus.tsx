
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";

interface ServerStatusProps {
  serverName: string;
  serverAddress: string;
  compact?: boolean;
}

const ServerStatus = ({ serverName, serverAddress, compact = false }: ServerStatusProps) => {
  const [status, setStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const [players, setPlayers] = useState({ online: 0, max: 100 });
  
  useEffect(() => {
    // Имитация запроса к серверу
    const fetchStatus = () => {
      // В реальном приложении здесь будет запрос к API или прямой запрос к серверу
      setTimeout(() => {
        const isOnline = Math.random() > 0.2; // 80% вероятность того, что сервер онлайн
        setStatus(isOnline ? 'online' : 'offline');
        
        if (isOnline) {
          const randomPlayers = Math.floor(Math.random() * 50) + 10;
          setPlayers({ online: randomPlayers, max: 100 });
        }
      }, 1000);
    };
    
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Обновление каждую минуту
    
    return () => clearInterval(interval);
  }, [serverAddress]);
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className={`h-3 w-3 rounded-full ${status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
        <span className="text-sm">
          {status === 'online' ? `${players.online}/${players.max}` : status === 'offline' ? 'Оффлайн' : 'Загрузка...'}
        </span>
      </div>
    );
  }
  
  return (
    <Card className="server-card overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">{serverName}</div>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs text-muted-foreground">
              {status === 'online' ? 'Онлайн' : status === 'offline' ? 'Оффлайн' : 'Загрузка...'}
            </span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-3">{serverAddress}</div>
        
        {status === 'online' && (
          <>
            <div className="flex justify-between items-center mb-1 text-sm">
              <span>Игроки:</span>
              <span>{players.online}/{players.max}</span>
            </div>
            <Progress value={(players.online / players.max) * 100} className="h-2" />
          </>
        )}
        
        {status === 'offline' && (
          <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
            <Icon name="AlertCircle" size={16} className="mr-2" />
            Сервер временно недоступен
          </div>
        )}
        
        {status === 'loading' && (
          <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
            <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
            Проверка статуса...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServerStatus;
