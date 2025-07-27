
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServerStatus from "@/components/ServerStatus";
import { useServerData } from "@/hooks/useServerData";
import { Server, TimeRange } from "@/types/server";
import MonitoringHeroSection from "@/components/monitoring/MonitoringHeroSection";
import ServerSelector from "@/components/monitoring/ServerSelector";
import ServerDetailCard from "@/components/monitoring/ServerDetailCard";
import TopPlayersTable from "@/components/monitoring/TopPlayersTable";
import ServerManagement from "@/components/monitoring/ServerManagement";
import { getCurrentUser } from "@/utils/authUtils";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const MONITORING_SERVERS_KEY = "monitoring_servers";

const Monitoring = () => {
  // Начальные данные серверов
  const initialServers: Server[] = [
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
  ];
  
  const [selectedServer, setSelectedServer] = useState<number>(1);
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [managedServers, setManagedServers] = useState<Server[]>(initialServers);
  const [isAdmin, setIsAdmin] = useState(false);

  // Проверяем права администратора
  useEffect(() => {
    const user = getCurrentUser();
    setIsAdmin(!!user);
    
    // Загружаем серверы из localStorage если есть
    const storedServers = localStorage.getItem(MONITORING_SERVERS_KEY);
    if (storedServers) {
      try {
        const parsed = JSON.parse(storedServers);
        setManagedServers(parsed);
      } catch (error) {
        console.error("Error parsing stored servers:", error);
      }
    }
  }, []);
  
  // Функция для обновления списка серверов
  const handleServersUpdate = (updatedServers: Server[]) => {
    setManagedServers(updatedServers);
    localStorage.setItem(MONITORING_SERVERS_KEY, JSON.stringify(updatedServers));
    
    // Если удаленный сервер был выбран, переключаемся на первый доступный
    if (!updatedServers.find(s => s.id === selectedServer) && updatedServers.length > 0) {
      setSelectedServer(updatedServers[0].id);
    }
  };
  
  // Использование хука для получения данных о серверах
  const servers = useServerData(managedServers, timeRange);
  
  // Получение текущего выбранного сервера
  const currentServer = servers.find(server => server.id === selectedServer) || servers[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <MonitoringHeroSection />
      
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
              <ServerSelector 
                servers={servers} 
                selectedServer={selectedServer}
                onServerSelect={setSelectedServer}
              />
            </div>
            
            <div className="lg:col-span-3">
              <ServerDetailCard 
                server={currentServer}
                timeRange={timeRange}
                onTimeRangeChange={setTimeRange}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Top Players */}
      <section className="py-8 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-semibold mb-6">Топ игроков сервера</h2>
          <TopPlayersTable />
        </div>
      </section>
      
      {/* Server Management - только для администраторов */}
      {isAdmin ? (
        <ServerManagement 
          servers={managedServers}
          onUpdate={handleServersUpdate}
        />
      ) : (
        <section className="py-12 bg-gradient-to-r from-primary/20 to-accent/20">
          <div className="container px-4 md:px-6 text-center">
            <h2 className="text-2xl md:text-4xl font-semibold mb-4">Добавьте свой сервер</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Хотите добавить свой сервер в наш мониторинг? Свяжитесь с администрацией для получения доступа.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/admin/login">
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти как админ
                </a>
              </Button>
              <Button size="lg" variant="outline">
                <Icon name="MessageCircle" size={18} className="mr-2" />
                Связаться с нами
              </Button>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default Monitoring;