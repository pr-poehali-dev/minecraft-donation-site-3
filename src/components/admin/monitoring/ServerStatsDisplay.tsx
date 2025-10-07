import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { ServerMonitoring, ServerStats } from "@/types/admin";

interface ServerStatsDisplayProps {
  server: ServerMonitoring | undefined;
  stats: ServerStats | null;
}

const ServerStatsDisplay = ({ server, stats }: ServerStatsDisplayProps) => {
  if (!server || !stats) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <Icon name="Server" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Выберите сервер для просмотра статистики</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{server.name}</CardTitle>
              <p className="text-muted-foreground">
                {server.address}:{server.port}
              </p>
            </div>
            <Badge variant={stats.isOnline ? "success" : "destructive"} className="text-sm">
              {stats.isOnline ? "Сервер онлайн" : "Сервер оффлайн"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stats.onlinePlayers}
              </div>
              <div className="text-sm text-muted-foreground">Игроков онлайн</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats.maxPlayers}
              </div>
              <div className="text-sm text-muted-foreground">Максимум слотов</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats.ping}ms
              </div>
              <div className="text-sm text-muted-foreground">Пинг</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {stats.version}
              </div>
              <div className="text-sm text-muted-foreground">Версия</div>
            </div>
          </div>
          
          {stats.motd && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground mb-1">MOTD:</div>
              <div className="font-medium">{stats.motd}</div>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-4">
            Последнее обновление: {new Date(stats.lastUpdate).toLocaleString('ru-RU')}
          </div>
        </CardContent>
      </Card>

      {stats.isOnline && stats.playerList.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Игроки онлайн ({stats.playerList.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {stats.playerList.slice(0, 12).map((player, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-xs text-white">
                    {player.charAt(0)}
                  </div>
                  <span className="text-sm truncate">{player}</span>
                </div>
              ))}
              {stats.playerList.length > 12 && (
                <div className="text-sm text-muted-foreground p-2">
                  и еще {stats.playerList.length - 12} игроков...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServerStatsDisplay;