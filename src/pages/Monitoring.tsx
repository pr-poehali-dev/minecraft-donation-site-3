
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServerStatus from "@/components/ServerStatus";
import { useServerData } from "@/hooks/useServerData";
import { Server, TimeRange } from "@/types/server";
import MonitoringHeroSection from "@/components/monitoring/MonitoringHeroSection";
import ServerSelector from "@/components/monitoring/ServerSelector";
import ServerDetailCard from "@/components/monitoring/ServerDetailCard";
import TopPlayersTable from "@/components/monitoring/TopPlayersTable";
import AddServerSection from "@/components/monitoring/AddServerSection";

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
  
  // Использование хука для получения данных о серверах
  const servers = useServerData(initialServers, timeRange);
  
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
      
      {/* Add Server Section */}
      <AddServerSection />
      
      <Footer />
    </div>
  );
};

export default Monitoring;
