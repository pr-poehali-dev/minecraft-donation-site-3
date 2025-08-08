import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Icon from "@/components/ui/icon";
import { Server } from "@/types/server";

interface ServerDisplayProps {
  servers: Server[];
}

const ServerDisplay = ({ servers }: ServerDisplayProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "offline": return "bg-red-500";
      case "maintenance": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": return "Онлайн";
      case "offline": return "Оффлайн";
      case "maintenance": return "Техработы";
      default: return "Неизвестно";
    }
  };

  const getPlayerPercentage = (online: number, max: number) => {
    return max > 0 ? (online / max) * 100 : 0;
  };

  if (servers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Icon name="ServerOff" className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium text-muted-foreground mb-2">
            Серверы не настроены
          </h3>
          <p className="text-sm text-muted-foreground text-center">
            Администратор еще не добавил серверы для мониторинга
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {servers.map((server) => (
        <Card key={server.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">{server.name}</CardTitle>
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(server.status)} text-white font-medium`}
              >
                {getStatusText(server.status)}
              </Badge>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Icon name="Globe" className="mr-1 h-4 w-4" />
              {server.address}:{server.port}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Статистика игроков */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center">
                  <Icon name="Users" className="mr-1 h-4 w-4" />
                  Игроки онлайн
                </span>
                <span className="text-sm font-bold">
                  {server.players.online}/{server.players.max}
                </span>
              </div>
              <Progress 
                value={getPlayerPercentage(server.players.online, server.players.max)} 
                className="h-2"
              />
              <div className="text-xs text-muted-foreground">
                Заполненность: {Math.round(getPlayerPercentage(server.players.online, server.players.max))}%
              </div>
            </div>

            {/* Информация о сервере */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-muted-foreground">Версия</div>
                <div className="font-medium">{server.version}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Статус</div>
                <div className="font-medium">{getStatusText(server.status)}</div>
              </div>
            </div>

            {/* Описание сервера */}
            {server.description && (
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {server.description}
                </p>
              </div>
            )}

            {/* Дополнительная информация для онлайн серверов */}
            {server.status === "online" && (
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center">
                    <Icon name="Activity" className="mr-1 h-3 w-3" />
                    Последнее обновление
                  </span>
                  <span>только что</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ServerDisplay;