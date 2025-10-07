import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { ServerMonitoring, ServerStats } from "@/types/admin";

interface ServerListProps {
  servers: ServerMonitoring[];
  serverStats: Record<string, ServerStats>;
  selectedServerId: string | null;
  onServerSelect: (serverId: string) => void;
  onEdit: (server: ServerMonitoring) => void;
  onDelete: (server: ServerMonitoring) => void;
}

const ServerList = ({
  servers,
  serverStats,
  selectedServerId,
  onServerSelect,
  onEdit,
  onDelete,
}: ServerListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Серверы ({servers.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {servers.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            Нет серверов для мониторинга
          </p>
        ) : (
          servers.map((server) => {
            const stats = serverStats[server.id];
            const isSelected = selectedServerId === server.id;
            
            return (
              <div
                key={server.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => onServerSelect(server.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{server.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {server.address}:{server.port}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge variant={stats?.isOnline ? "success" : "destructive"}>
                      {stats?.isOnline ? "Онлайн" : "Оффлайн"}
                    </Badge>
                    {stats && (
                      <span className="text-sm text-muted-foreground">
                        {stats.onlinePlayers}/{stats.maxPlayers}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(server);
                      }}
                    >
                      <Icon name="Edit" className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(server);
                      }}
                    >
                      <Icon name="Trash2" className="w-4 h-4" />
                    </Button>
                  </div>
                  <Badge variant={server.isActive ? "default" : "secondary"}>
                    {server.isActive ? "Активен" : "Неактивен"}
                  </Badge>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ServerList;