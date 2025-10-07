import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonitoringServer {
  id: string;
  name: string;
  address: string;
  port: number;
  stats?: {
    isOnline: boolean;
    onlinePlayers: number;
    maxPlayers: number;
  };
}

interface ServerSelectorProps {
  servers: MonitoringServer[];
  selectedServerId: string | null;
  onServerSelect: (id: string) => void;
}

const ServerSelector = ({ 
  servers, 
  selectedServerId, 
  onServerSelect 
}: ServerSelectorProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Выберите сервер</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {servers.map(server => {
            const isOnline = server.stats?.isOnline || false;
            
            return (
              <Button 
                key={server.id}
                variant={selectedServerId === server.id ? "default" : "outline"}
                className="justify-start"
                onClick={() => onServerSelect(server.id)}
              >
                <div className="flex items-center gap-2 w-full">
                  <div className={`h-3 w-3 rounded-full ${
                    isOnline ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div className="flex-1 text-left">
                    <span className="truncate block">{server.name}</span>
                    {server.stats && (
                      <span className="text-xs opacity-75">
                        {server.stats.onlinePlayers}/{server.stats.maxPlayers} игроков
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerSelector;