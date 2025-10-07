import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { AdminUser, ServerMonitoring, ServerStats } from "@/types/admin";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import ServerList from "@/components/admin/monitoring/ServerList";
import ServerStatsDisplay from "@/components/admin/monitoring/ServerStatsDisplay";
import ServerFormDialog from "@/components/admin/monitoring/ServerFormDialog";
import DeleteServerDialog from "@/components/admin/monitoring/DeleteServerDialog";

const MONITORING_SERVERS_KEY = "monitoring_servers";
const SERVER_STATS_KEY = "server_stats";
const MONITOR_FUNCTION_URL = "https://functions.poehali.dev/308e25d3-9e55-4704-ae69-10e1639f8a58";

const ServerMonitoring = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [servers, setServers] = useState<ServerMonitoring[]>([]);
  const [serverStats, setServerStats] = useState<Record<string, ServerStats>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState<ServerMonitoring | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<ServerMonitoring | null>(null);
  const [selectedServerId, setSelectedServerId] = useState<string | null>(null);

  useEffect(() => {
    const userData = getCurrentUser();
    if (!userData) {
      navigate("/admin/login");
      return;
    }
    setUser(userData);
  }, [navigate]);

  useEffect(() => {
    loadServers();
    loadServerStats();
  }, []);

  useEffect(() => {
    if (servers.length > 0) {
      updateServerStats();
    }
    
    const interval = setInterval(() => {
      if (servers.length > 0) {
        updateServerStats();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [servers]);

  const loadServers = () => {
    const savedServers = localStorage.getItem(MONITORING_SERVERS_KEY);
    if (savedServers) {
      setServers(JSON.parse(savedServers));
    }
  };

  const loadServerStats = () => {
    const savedStats = localStorage.getItem(SERVER_STATS_KEY);
    if (savedStats) {
      setServerStats(JSON.parse(savedStats));
    }
  };

  const saveServers = (newServers: ServerMonitoring[]) => {
    localStorage.setItem(MONITORING_SERVERS_KEY, JSON.stringify(newServers));
    setServers(newServers);
  };

  const saveServerStats = (newStats: Record<string, ServerStats>) => {
    localStorage.setItem(SERVER_STATS_KEY, JSON.stringify(newStats));
    setServerStats(newStats);
  };

  const updateServerStats = async () => {
    const activeServers = servers.filter(s => s.isActive);
    
    if (activeServers.length === 0) {
      return;
    }

    try {
      const response = await fetch(MONITOR_FUNCTION_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          servers: activeServers
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.stats) {
          saveServerStats(data.stats);
        }
      } else {
        console.error('Ошибка при обновлении статистики серверов');
      }
    } catch (error) {
      console.error('Ошибка при запросе к серверу мониторинга:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const serverData: Omit<ServerMonitoring, "id" | "createdAt" | "updatedAt"> = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      port: parseInt(formData.get("port") as string) || 25565,
      version: formData.get("version") as string,
      maxPlayers: parseInt(formData.get("maxPlayers") as string) || 100,
      description: formData.get("description") as string || undefined,
      isActive: formData.get("isActive") === "on",
    };

    if (currentServer) {
      const updatedServers = servers.map(server =>
        server.id === currentServer.id
          ? {
              ...serverData,
              id: currentServer.id,
              createdAt: currentServer.createdAt,
              updatedAt: new Date().toISOString(),
            }
          : server
      );
      saveServers(updatedServers);
      toast({
        title: "Сервер обновлен",
        description: `Сервер "${serverData.name}" успешно обновлен в мониторинге.`,
      });
    } else {
      const newServer: ServerMonitoring = {
        ...serverData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveServers([...servers, newServer]);
      toast({
        title: "Сервер добавлен",
        description: `Сервер "${serverData.name}" успешно добавлен в мониторинг.`,
      });
    }

    setIsFormOpen(false);
    setCurrentServer(null);
  };

  const handleEdit = (server: ServerMonitoring) => {
    setCurrentServer(server);
    setIsFormOpen(true);
  };

  const handleDelete = (server: ServerMonitoring) => {
    setServerToDelete(server);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serverToDelete) {
      const updatedServers = servers.filter(s => s.id !== serverToDelete.id);
      saveServers(updatedServers);
      
      const newStats = { ...serverStats };
      delete newStats[serverToDelete.id];
      saveServerStats(newStats);
      
      toast({
        title: "Сервер удален",
        description: `Сервер "${serverToDelete.name}" удален из мониторинга.`,
      });
    }
    setDeleteDialogOpen(false);
    setServerToDelete(null);
  };

  const handleRefreshStats = () => {
    updateServerStats();
    toast({
      title: "Статистика обновлена",
      description: "Статистика всех серверов обновлена.",
    });
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  if (!user) {
    return null;
  }

  const selectedServer = servers.find(s => s.id === selectedServerId);
  const selectedStats = selectedServerId ? serverStats[selectedServerId] : null;

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader user={user} onLogout={handleLogout} />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Мониторинг серверов</h1>
              <p className="text-muted-foreground">
                Управление серверами для отображения статистики игрокам
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefreshStats} variant="outline">
                <Icon name="RefreshCw" className="w-4 h-4 mr-2" />
                Обновить
              </Button>
              <Button onClick={() => setIsFormOpen(true)}>
                <Icon name="Plus" className="w-4 h-4 mr-2" />
                Добавить сервер
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ServerList
                servers={servers}
                serverStats={serverStats}
                selectedServerId={selectedServerId}
                onServerSelect={setSelectedServerId}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>

            <div className="lg:col-span-2">
              <ServerStatsDisplay
                server={selectedServer}
                stats={selectedStats}
              />
            </div>
          </div>

          <ServerFormDialog
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            currentServer={currentServer}
            onSubmit={handleSubmit}
          />

          <DeleteServerDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            server={serverToDelete}
            onConfirm={confirmDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ServerMonitoring;