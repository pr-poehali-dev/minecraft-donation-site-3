import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface MonitoringServer {
  id: string;
  name: string;
  stats?: {
    isOnline: boolean;
    onlinePlayers: number;
  };
}

interface TopPlayersTableProps {
  selectedServer?: MonitoringServer;
}

const TopPlayersTable = ({ selectedServer }: TopPlayersTableProps) => {
  if (!selectedServer) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Icon name="Users" className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">
            Выберите сервер для просмотра топа игроков
          </p>
        </CardContent>
      </Card>
    );
  }

  const isOnline = selectedServer.stats?.isOnline || false;
  const onlinePlayers = selectedServer.stats?.onlinePlayers || 0;

  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon name="Users" className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <h3 className="text-lg font-semibold mb-2">Статистика игроков</h3>
        {isOnline ? (
          <div className="text-muted-foreground space-y-2">
            <p>На сервере {selectedServer.name} сейчас играет {onlinePlayers} {
              onlinePlayers === 1 ? 'игрок' : 
              onlinePlayers < 5 ? 'игрока' : 'игроков'
            }</p>
            <p className="text-sm">
              Детальная статистика игроков появится в следующих обновлениях
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Сервер {selectedServer.name} сейчас оффлайн
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default TopPlayersTable;