
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "@/types/server";

interface ServerSelectorProps {
  servers: Server[];
  selectedServer: number;
  onServerSelect: (id: number) => void;
}

const ServerSelector = ({ 
  servers, 
  selectedServer, 
  onServerSelect 
}: ServerSelectorProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Выберите сервер</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {servers.map(server => (
            <Button 
              key={server.id}
              variant={selectedServer === server.id ? "default" : "outline"}
              className="justify-start"
              onClick={() => onServerSelect(server.id)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className={`h-3 w-3 rounded-full ${
                  server.status === 'online' 
                    ? 'bg-green-500' 
                    : server.status === 'offline' 
                      ? 'bg-red-500' 
                      : 'bg-yellow-500'
                }`}></div>
                <span className="truncate">{server.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerSelector;
