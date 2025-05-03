
import { Server } from "@/types/server";
import ServerStatCard from "./ServerStatCard";
import { formatUptime } from "@/utils/serverUtils";

interface ServerStatsGridProps {
  server: Server;
}

const ServerStatsGrid = ({ server }: ServerStatsGridProps) => {
  const getTpsStatus = (tps?: number) => {
    if (!tps) return { text: '', className: '' };
    
    if (tps > 19) return { text: 'Отлично', className: 'text-green-500' };
    if (tps > 15) return { text: 'Нормально', className: 'text-yellow-500' };
    return { text: 'Низкий', className: 'text-red-500' };
  };
  
  const tpsStatus = getTpsStatus(server.tps);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <ServerStatCard 
        icon="Users"
        title="Онлайн игроков"
        value={server.status === 'online' ? `${server.players.online}/${server.players.max}` : '-'}
        progress={server.status === 'online' ? (server.players.online / server.players.max) * 100 : undefined}
      />
      
      <ServerStatCard 
        icon="Cpu"
        title="TPS"
        value={server.tps ? server.tps : '-'}
        status={tpsStatus.text}
        statusClass={tpsStatus.className}
      />
      
      <ServerStatCard 
        icon="Clock"
        title="Аптайм"
        value={formatUptime(server.uptime)}
      />
    </div>
  );
};

export default ServerStatsGrid;
