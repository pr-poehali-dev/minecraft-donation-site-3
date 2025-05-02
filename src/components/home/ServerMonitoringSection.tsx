
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ServerStatus from "@/components/ServerStatus";
import Icon from "@/components/ui/icon";
import { ServerData } from "@/types/server";

interface ServerMonitoringSectionProps {
  servers: ServerData[];
}

const ServerMonitoringSection = ({ servers }: ServerMonitoringSectionProps) => {
  return (
    <section className="py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Мониторинг серверов</h2>
          <p className="text-muted-foreground">Актуальная информация о состоянии наших серверов</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {servers.map((server) => (
            <ServerStatus 
              key={server.id}
              serverName={server.name}
              serverAddress={server.address}
            />
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/monitoring">
            <Button variant="outline">
              <Icon name="BarChart" size={16} />
              Подробная статистика
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServerMonitoringSection;
