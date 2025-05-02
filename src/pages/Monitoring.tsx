
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServerStatus from "@/components/ServerStatus";
import Icon from "@/components/ui/icon";

interface Server {
  id: number;
  name: string;
  address: string;
  version: string;
  status: 'online' | 'offline' | 'loading';
  players: { online: number; max: number };
  tps?: number;
  uptime?: number;
  history?: Array<{ time: string; players: number; tps: number }>;
}

const Monitoring = () => {
  const [servers, setServers] = useState<Server[]>([
    { 
      id: 1, 
      name: "CraftWorld Выживание", 
      address: "survival.craftworld.ru", 
      version: "1.20.4",
      status: 'loading',
      players: { online: 0, max: 100 },
    },
    { 
      id: 2, 
      name: "CraftWorld Мини-игры", 
      address: "minigames.craftworld.ru", 
      version: "1.20.4",
      status: 'loading',
      players: { online: 0, max: 50 },
    },
    { 
      id: 3, 
      name: "CraftWorld Креатив", 
      address: "creative.craftworld.ru", 
      version: "1.20.4",
      status: 'loading',
      players: { online: 0, max: 50 },
    },
  ]);
  
  const [selectedServer, setSelectedServer] = useState<number>(1);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');
  
  useEffect(() => {
    // Симуляция получения данных серверов
    const fetchServerData = () => {
      const updatedServers = servers.map(server => {
        const isOnline = Math.random() > 0.2;
        const randomPlayers = Math.floor(Math.random() * server.players.max * 0.7) + 5;
        const randomTPS = isOnline ? (Math.random() * 2 + 18).toFixed(1) : undefined;
        const randomUptime = isOnline ? Math.floor(Math.random() * 72) + 1 : undefined;
        
        // Генерация исторических данных
        const history = [];
        const hoursInPeriod = timeRange === 'day' ? 24 : timeRange === 'week' ? 24 * 7 : 24 * 30;
        const stepSize = timeRange === 'day' ? 1 : timeRange === 'week' ? 6 : 24;
        
        for (let i = 0; i < hoursInPeriod; i += stepSize) {
          const time = new Date();
          time.setHours(time.getHours() - hoursInPeriod + i);
          const timeStr = time.getHours() + ':00';
          
          history.push({
            time: timeStr,
            players: Math.floor(Math.random() * server.players.max * 0.9),
            tps: Math.min(20, (Math.random() * 3 + 17)).toFixed(1),
          });
        }
        
        return {
          ...server,
          status: isOnline ? 'online' : 'offline',
          players: { ...server.players, online: isOnline ? randomPlayers : 0 },
          tps: randomTPS ? parseFloat(randomTPS) : undefined,
          uptime: randomUptime,
          history,
        };
      });
      
      setServers(updatedServers);
    };
    
    fetchServerData();
    const interval = setInterval(fetchServerData, 60000); // обновление каждую минуту
    
    return () => clearInterval(interval);
  }, [timeRange]);
  
  const currentServer = servers.find(server => server.id === selectedServer) || servers[0];
  
  // Форматирование времени аптайма
  const formatUptime = (hours?: number) => {
    if (!hours) return 'Н/Д';
    
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    
    if (days > 0) {
      return `${days} д ${remainingHours} ч`;
    }
    return `${hours} ч`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Мониторинг серверов</h1>
            <p className="text-lg md:text-xl mb-6 text-gray-300">
              Актуальная информация о состоянии и производительности наших серверов
            </p>
          </div>
        </div>
      </section>
      
      {/* Server Status Overview */}
      <section className="py-8 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {servers.map(server => (
              <ServerStatus 
                key={server.id}
                serverName={server.name}
                serverAddress={server.address}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Detailed Server Stats */}
      <section className="py-8 bg-card">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-semibold mb-6">Детальная статистика</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
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
                        onClick={() => setSelectedServer(server.id)}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <div className={`h-3 w-3 rounded-full ${server.status === 'online' ? 'bg-green-500' : server.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                          <span className="truncate">{server.name}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{currentServer.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${currentServer.status === 'online' ? 'bg-green-500' : currentServer.status === 'offline' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <span className="text-sm font-medium">
                        {currentServer.status === 'online' ? 'Онлайн' : currentServer.status === 'offline' ? 'Оффлайн' : 'Загрузка...'}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <Icon name="Users" size={24} className="text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Онлайн игроков</p>
                        <p className="text-2xl font-bold">
                          {currentServer.status === 'online' ? `${currentServer.players.online}/${currentServer.players.max}` : '-'}
                        </p>
                        {currentServer.status === 'online' && (
                          <Progress 
                            value={(currentServer.players.online / currentServer.players.max) * 100} 
                            className="h-2 mt-2 w-full"
                          />
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <Icon name="Cpu" size={24} className="text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">TPS</p>
                        <p className="text-2xl font-bold">
                          {currentServer.tps ? currentServer.tps : '-'}
                        </p>
                        {currentServer.tps && (
                          <div className="flex items-center mt-2">
                            <span className={`text-xs ${currentServer.tps > 19 ? 'text-green-500' : currentServer.tps > 15 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {currentServer.tps > 19 ? 'Отлично' : currentServer.tps > 15 ? 'Нормально' : 'Низкий'}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <Icon name="Clock" size={24} className="text-primary mb-2" />
                        <p className="text-sm text-muted-foreground">Аптайм</p>
                        <p className="text-2xl font-bold">
                          {formatUptime(currentServer.uptime)}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Tabs defaultValue="players" className="w-full">
                    <TabsList className="grid grid-cols-2 w-full max-w-xs mb-4">
                      <TabsTrigger value="players">Игроки</TabsTrigger>
                      <TabsTrigger value="performance">Производительность</TabsTrigger>
                    </TabsList>
                    
                    <div className="mb-4">
                      <TabsList className="inline-flex">
                        <TabsTrigger value="day" onClick={() => setTimeRange('day')}>24 часа</TabsTrigger>
                        <TabsTrigger value="week" onClick={() => setTimeRange('week')}>Неделя</TabsTrigger>
                        <TabsTrigger value="month" onClick={() => setTimeRange('month')}>Месяц</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="players" className="mt-0">
                      {currentServer.history && (
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={currentServer.history}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey="players" 
                                stroke="#4ade80" 
                                name="Игроки" 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="performance" className="mt-0">
                      {currentServer.history && (
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                              data={currentServer.history}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="time" />
                              <YAxis domain={[0, 20]} />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey="tps" 
                                stroke="#f59e0b" 
                                name="TPS" 
                                strokeWidth={2}
                                dot={false}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      
      {/* Top Players */}
      <section className="py-8 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-semibold mb-6">Топ игроков сервера</h2>
          
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Никнейм</TableHead>
                    <TableHead>Время игры</TableHead>
                    <TableHead>Последний вход</TableHead>
                    <TableHead className="text-right">Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{i+1}</TableCell>
                      <TableCell className="font-minecraft">Player{Math.floor(Math.random() * 1000)}</TableCell>
                      <TableCell>{Math.floor(Math.random() * 1000)} ч</TableCell>
                      <TableCell>{new Date().toLocaleDateString('ru-RU')}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant={Math.random() > 0.3 ? "default" : "outline"}>
                          {Math.random() > 0.3 ? "Онлайн" : "Оффлайн"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </section>
      
      {/* Add Server Section */}
      <section className="py-12 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">Добавьте свой сервер</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Хотите добавить свой сервер в наш мониторинг? Мы предоставляем API и виджеты для интеграции статистики на ваш сайт.
          </p>
          <Button size="lg">
            <Icon name="PlusCircle" size={18} className="mr-2" />
            Добавить сервер
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Monitoring;
