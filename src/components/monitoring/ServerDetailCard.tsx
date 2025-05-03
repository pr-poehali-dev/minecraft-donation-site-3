
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Server, TimeRange } from "@/types/server";
import ServerStatsGrid from "./ServerStatsGrid";
import ServerChart from "./ServerChart";

interface ServerDetailCardProps {
  server: Server;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
}

const ServerDetailCard = ({ 
  server, 
  timeRange, 
  onTimeRangeChange 
}: ServerDetailCardProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{server.name}</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${
              server.status === 'online' 
                ? 'bg-green-500' 
                : server.status === 'offline' 
                  ? 'bg-red-500' 
                  : 'bg-yellow-500'
            }`}></div>
            <span className="text-sm font-medium">
              {server.status === 'online' 
                ? 'Онлайн' 
                : server.status === 'offline' 
                  ? 'Оффлайн' 
                  : 'Загрузка...'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ServerStatsGrid server={server} />
        
        <Tabs defaultValue="players" className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-xs mb-4">
            <TabsTrigger value="players">Игроки</TabsTrigger>
            <TabsTrigger value="performance">Производительность</TabsTrigger>
          </TabsList>
          
          <div className="mb-4">
            <TabsList className="inline-flex">
              <TabsTrigger 
                value="day" 
                onClick={() => onTimeRangeChange('day')}
                data-state={timeRange === 'day' ? 'active' : undefined}
              >
                24 часа
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                onClick={() => onTimeRangeChange('week')}
                data-state={timeRange === 'week' ? 'active' : undefined}
              >
                Неделя
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                onClick={() => onTimeRangeChange('month')}
                data-state={timeRange === 'month' ? 'active' : undefined}
              >
                Месяц
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="players" className="mt-0">
            <ServerChart 
              data={server.history || []} 
              dataKey="players" 
              name="Игроки"
              stroke="#4ade80"
            />
          </TabsContent>
          
          <TabsContent value="performance" className="mt-0">
            <ServerChart 
              data={server.history || []} 
              dataKey="tps" 
              name="TPS"
              stroke="#f59e0b"
              domain={[0, 20]}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ServerDetailCard;
