import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { ServerMonitoring, ServerStats } from "@/types/admin";

const MONITORING_SERVERS_KEY = "monitoring_servers";
const SERVER_STATS_KEY = "server_stats";
const MONITOR_FUNCTION_URL = "https://functions.poehali.dev/308e25d3-9e55-4704-ae69-10e1639f8a58";

const ServerStatus = () => {
  const [servers, setServers] = useState<ServerMonitoring[]>([]);
  const [serverStats, setServerStats] = useState<Record<string, ServerStats>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      fetchServerStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    try {
      const savedServers = localStorage.getItem(MONITORING_SERVERS_KEY);
      const savedStats = localStorage.getItem(SERVER_STATS_KEY);
      
      if (savedServers) {
        const serversData = JSON.parse(savedServers);
        const activeServers = serversData.filter((server: ServerMonitoring) => server.isActive);
        setServers(activeServers);
        
        if (activeServers.length > 0) {
          fetchServerStats(activeServers);
        }
      }
      
      if (savedStats) {
        setServerStats(JSON.parse(savedStats));
      }
    } catch (error) {
      console.error("Ошибка загрузки данных серверов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServerStats = async (serverList?: ServerMonitoring[]) => {
    const serversToCheck = serverList || servers;
    
    if (serversToCheck.length === 0) {
      return;
    }

    try {
      const response = await fetch(MONITOR_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          servers: serversToCheck
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          setServerStats(data.stats);
          localStorage.setItem(SERVER_STATS_KEY, JSON.stringify(data.stats));
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error("Ошибка обновления статистики серверов:", error);
    }
  };

  const copyToClipboard = async (address: string, port: number) => {
    const fullAddress = port === 25565 ? address : `${address}:${port}`;
    try {
      await navigator.clipboard.writeText(fullAddress);
    } catch (error) {
      const textArea = document.createElement("textarea");
      textArea.value = fullAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const getTotalPlayers = () => {
    return Object.values(serverStats).reduce((total, stats) => {
      return total + (stats.isOnline ? stats.onlinePlayers : 0);
    }, 0);
  };

  const getOnlineServers = () => {
    return Object.values(serverStats).filter(stats => stats.isOnline).length;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Server" className="w-5 h-5" />
            Статус серверов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Icon name="Loader2" className="w-6 h-6 animate-spin" />
            <span className="ml-2">Загрузка...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (servers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Server" className="w-5 h-5" />
            Статус серверов
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="ServerOff" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Информация о серверах временно недоступна</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon name="Server" className="w-5 h-5" />
            Статус серверов
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>{getOnlineServers()}/{servers.length} онлайн</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Users" className="w-4 h-4" />
              <span>{getTotalPlayers()} игроков</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {servers.map((server) => {
            const stats = serverStats[server.id];
            const isOnline = stats?.isOnline || false;
            const fullAddress = server.port === 25565 ? server.address : `${server.address}:${server.port}`;
            
            return (
              <div 
                key={server.id}
                className={`p-4 border rounded-lg transition-colors ${
                  isOnline ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20' 
                           : 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <h3 className="font-semibold text-lg">{server.name}</h3>
                      </div>
                      <Badge variant={isOnline ? "success" : "destructive"}>
                        {isOnline ? "Онлайн" : "Оффлайн"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 font-mono text-sm hover:bg-transparent hover:text-primary"
                        onClick={() => copyToClipboard(server.address, server.port)}
                      >
                        <Icon name="Copy" className="w-3 h-3 mr-1" />
                        {fullAddress}
                      </Button>
                      {server.version && (
                        <span className="flex items-center gap-1">
                          <Icon name="Package" className="w-3 h-3" />
                          {server.version}
                        </span>
                      )}
                    </div>
                    
                    {server.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {server.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 ml-4">
                    {stats ? (
                      <>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {stats.onlinePlayers}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            из {stats.maxPlayers}
                          </div>
                        </div>
                        {isOnline && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Icon name="Zap" className="w-3 h-3" />
                            <span>{stats.ping}ms</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Icon name="Loader2" className="w-4 h-4 animate-spin" />
                        Проверка...
                      </div>
                    )}
                  </div>
                </div>
                
                {stats && stats.motd && stats.motd !== server.name && (
                  <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                    <div className="text-xs text-muted-foreground mb-1">MOTD:</div>
                    <div className="font-medium">{stats.motd}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t text-xs text-muted-foreground">
          <span>
            {lastUpdate 
              ? `Обновлено: ${lastUpdate.toLocaleTimeString('ru-RU')}`
              : 'Автообновление каждые 30 секунд'
            }
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchServerStats()}
            className="h-6 px-2"
          >
            <Icon name="RefreshCw" className="w-3 h-3 mr-1" />
            Обновить
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerStatus;