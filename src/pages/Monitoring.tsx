import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MonitoringHeroSection from "@/components/monitoring/MonitoringHeroSection";
import ServerSelector from "@/components/monitoring/ServerSelector";
import ServerDetailCard from "@/components/monitoring/ServerDetailCard";
import TopPlayersTable from "@/components/monitoring/TopPlayersTable";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const MONITORING_API_URL = "https://functions.poehali.dev/62a45015-2204-45c2-917c-d3a14f10d6b5";
const MONITOR_FUNCTION_URL = "https://functions.poehali.dev/308e25d3-9e55-4704-ae69-10e1639f8a58";

interface MonitoringServer {
  id: string;
  name: string;
  address: string;
  port: number;
  version?: string;
  description?: string;
  maxPlayers: number;
  isActive: boolean;
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

const Monitoring = () => {
  const [servers, setServers] = useState<MonitoringServer[]>([]);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadServers();
    
    const interval = setInterval(() => {
      updateServerStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadServers = async () => {
    try {
      const response = await fetch(MONITORING_API_URL);
      const data = await response.json();
      
      if (data.success && data.servers) {
        const activeServers = data.servers.filter((s: any) => s.isActive);
        setServers(activeServers);
        
        if (activeServers.length > 0 && !selectedServerId) {
          setSelectedServerId(activeServers[0].id);
        }
        
        if (activeServers.length > 0) {
          updateServerStats(activeServers);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки серверов:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateServerStats = async (serverList?: MonitoringServer[]) => {
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
          servers: serversToCheck.map(s => ({
            id: s.id,
            name: s.name,
            address: s.address,
            port: s.port,
            maxPlayers: s.maxPlayers
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          setServers(prevServers => 
            prevServers.map(server => ({
              ...server,
              stats: data.stats[server.id] ? {
                onlinePlayers: data.stats[server.id].onlinePlayers,
                maxPlayers: data.stats[server.id].maxPlayers,
                ping: data.stats[server.id].ping,
                isOnline: data.stats[server.id].isOnline,
                version: data.stats[server.id].version,
                motd: data.stats[server.id].motd,
                lastUpdate: data.stats[server.id].lastUpdate
              } : server.stats
            }))
          );
        }
      }
    } catch (error) {
      console.error("Ошибка обновления статистики:", error);
    }
  };

  const selectedServer = servers.find(s => s.id === selectedServerId);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader2" className="w-12 h-12 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Загрузка серверов...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (servers.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <MonitoringHeroSection />
        <section className="py-12 bg-background">
          <div className="container px-4 md:px-6">
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="ServerOff" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">Нет серверов для мониторинга</h3>
                <p className="text-muted-foreground">
                  Информация о серверах появится после их добавления администратором
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <MonitoringHeroSection />
      
      <section className="py-8 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-semibold mb-6">Статус серверов</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server) => {
              const stats = server.stats;
              const isOnline = stats?.isOnline || false;
              const fullAddress = server.port === 25565 ? server.address : `${server.address}:${server.port}`;
              
              return (
                <Card 
                  key={server.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedServerId === server.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedServerId(server.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <h3 className="font-semibold text-lg truncate">{server.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono truncate">
                          {fullAddress}
                        </p>
                      </div>
                    </div>
                    
                    {stats ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Игроки:</span>
                          <span className="font-semibold">
                            {stats.onlinePlayers} / {stats.maxPlayers}
                          </span>
                        </div>
                        {isOnline && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Пинг:</span>
                              <span className="font-semibold">{stats.ping}ms</span>
                            </div>
                            {server.version && (
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Версия:</span>
                                <span className="font-semibold">{server.version}</span>
                              </div>
                            )}
                          </>
                        )}
                        <div className={`mt-3 px-3 py-1 rounded text-center text-sm font-medium ${
                          isOnline 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                        }`}>
                          {isOnline ? 'Онлайн' : 'Оффлайн'}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-4">
                        <Icon name="Loader2" className="w-5 h-5 animate-spin" />
                        <span className="ml-2 text-sm text-muted-foreground">Проверка...</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-card">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-semibold mb-6">Детальная статистика</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ServerSelector 
                servers={servers} 
                selectedServerId={selectedServerId}
                onServerSelect={setSelectedServerId}
              />
            </div>
            
            <div className="lg:col-span-3">
              <ServerDetailCard 
                server={selectedServer}
              />
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-semibold mb-6">Топ игроков сервера</h2>
          <TopPlayersTable selectedServer={selectedServer} />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Monitoring;