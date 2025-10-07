import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface MonitoringServer {
  id: string;
  name: string;
  address: string;
  port: number;
  version?: string;
  description?: string;
  maxPlayers: number;
  stats?: {
    onlinePlayers: number;
    maxPlayers: number;
    ping: number;
    isOnline: boolean;
    version?: string;
    motd?: string;
    lastUpdate?: string;
  };
}

interface ServerDetailCardProps {
  server: MonitoringServer | undefined;
}

const ServerDetailCard = ({ server }: ServerDetailCardProps) => {
  if (!server) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center text-muted-foreground">
            <Icon name="Server" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Выберите сервер для просмотра детальной статистики</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = server.stats;
  const isOnline = stats?.isOnline || false;
  const fullAddress = server.port === 25565 ? server.address : `${server.address}:${server.port}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{server.name}</CardTitle>
              <p className="text-muted-foreground font-mono mt-1">{fullAddress}</p>
              {server.description && (
                <p className="text-sm text-muted-foreground mt-2">{server.description}</p>
              )}
            </div>
            <Badge variant={isOnline ? "success" : "destructive"} className="text-sm px-4 py-2">
              {isOnline ? "Онлайн" : "Оффлайн"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {stats ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {stats.onlinePlayers}
                  </div>
                  <div className="text-sm text-muted-foreground">Игроков онлайн</div>
                </div>
                
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-3xl font-bold mb-1">
                    {stats.maxPlayers}
                  </div>
                  <div className="text-sm text-muted-foreground">Максимум слотов</div>
                </div>
                
                {isOnline && (
                  <>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold mb-1">
                        {stats.ping}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Пинг</div>
                    </div>
                    
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <div className="text-3xl font-bold mb-1">
                        {stats.version || server.version || 'N/A'}
                      </div>
                      <div className="text-sm text-muted-foreground">Версия</div>
                    </div>
                  </>
                )}
              </div>
              
              {stats.motd && stats.motd !== server.name && (
                <div className="p-4 bg-muted rounded-lg mb-4">
                  <div className="flex items-start gap-3">
                    <Icon name="MessageSquare" className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Message of the Day:</div>
                      <div className="font-medium">{stats.motd}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Icon name="Clock" className="w-4 h-4" />
                  <span>
                    Последнее обновление: {stats.lastUpdate 
                      ? new Date(stats.lastUpdate).toLocaleString('ru-RU')
                      : 'Загрузка...'
                    }
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="RefreshCw" className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Обновляется каждые 30 секунд</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-8">
              <Icon name="Loader2" className="w-8 h-8 animate-spin" />
              <span className="ml-3 text-muted-foreground">Загрузка статистики сервера...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServerDetailCard;