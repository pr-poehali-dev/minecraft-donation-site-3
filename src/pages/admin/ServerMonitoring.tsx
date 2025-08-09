import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { AdminUser, ServerMonitoring, ServerStats, ServerHistoryStats } from "@/types/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";

const MONITORING_SERVERS_KEY = "monitoring_servers";
const SERVER_STATS_KEY = "server_stats";

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

  // Проверяем аутентификацию
  useEffect(() => {
    const userData = getCurrentUser();
    if (!userData) {
      navigate("/admin/login");
      return;
    }
    setUser(userData);
  }, [navigate]);

  // Загружаем данные
  useEffect(() => {
    loadServers();
    loadServerStats();
  }, []);

  // Имитация обновления статистики серверов каждые 30 секунд
  useEffect(() => {
    const interval = setInterval(() => {
      updateServerStats();
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

  // Имитация получения статистики сервера
  const generateMockStats = (server: ServerMonitoring): ServerStats => {
    const isOnline = Math.random() > 0.1; // 90% шанс что сервер онлайн
    const onlinePlayers = isOnline ? Math.floor(Math.random() * server.maxPlayers) : 0;
    
    return {
      id: `stats_${server.id}`,
      serverId: server.id,
      onlinePlayers,
      maxPlayers: server.maxPlayers,
      ping: isOnline ? Math.floor(Math.random() * 100) + 20 : 0,
      isOnline,
      version: server.version,
      motd: isOnline ? `${server.name} - Добро пожаловать!` : "Сервер недоступен",
      playerList: isOnline ? Array.from({ length: onlinePlayers }, (_, i) => `Player${i + 1}`) : [],
      lastUpdate: new Date().toISOString(),
    };
  };

  const updateServerStats = () => {
    const newStats: Record<string, ServerStats> = {};
    servers.forEach(server => {
      if (server.isActive) {
        newStats[server.id] = generateMockStats(server);
      }
    });
    saveServerStats(newStats);
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
      
      // Удаляем статистику сервера
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
            {/* Список серверов */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Серверы ({servers.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {servers.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Нет серверов для мониторинга
                    </p>
                  ) : (
                    servers.map((server) => {
                      const stats = serverStats[server.id];
                      const isSelected = selectedServerId === server.id;
                      
                      return (
                        <div
                          key={server.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedServerId(server.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium truncate">{server.name}</h3>
                              <p className="text-sm text-muted-foreground truncate">
                                {server.address}:{server.port}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <Badge variant={stats?.isOnline ? "success" : "destructive"}>
                                {stats?.isOnline ? "Онлайн" : "Оффлайн"}
                              </Badge>
                              {stats && (
                                <span className="text-sm text-muted-foreground">
                                  {stats.onlinePlayers}/{stats.maxPlayers}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(server);
                                }}
                              >
                                <Icon name="Edit" className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(server);
                                }}
                              >
                                <Icon name="Trash2" className="w-4 h-4" />
                              </Button>
                            </div>
                            <Badge variant={server.isActive ? "default" : "secondary"}>
                              {server.isActive ? "Активен" : "Неактивен"}
                            </Badge>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Статистика выбранного сервера */}
            <div className="lg:col-span-2">
              {selectedServer && selectedStats ? (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{selectedServer.name}</CardTitle>
                          <p className="text-muted-foreground">
                            {selectedServer.address}:{selectedServer.port}
                          </p>
                        </div>
                        <Badge variant={selectedStats.isOnline ? "success" : "destructive"} className="text-sm">
                          {selectedStats.isOnline ? "Сервер онлайн" : "Сервер оффлайн"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-primary">
                            {selectedStats.onlinePlayers}
                          </div>
                          <div className="text-sm text-muted-foreground">Игроков онлайн</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {selectedStats.maxPlayers}
                          </div>
                          <div className="text-sm text-muted-foreground">Максимум слотов</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {selectedStats.ping}ms
                          </div>
                          <div className="text-sm text-muted-foreground">Пинг</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {selectedStats.version}
                          </div>
                          <div className="text-sm text-muted-foreground">Версия</div>
                        </div>
                      </div>
                      
                      {selectedStats.motd && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">MOTD:</div>
                          <div className="font-medium">{selectedStats.motd}</div>
                        </div>
                      )}
                      
                      <div className="text-xs text-muted-foreground mt-4">
                        Последнее обновление: {new Date(selectedStats.lastUpdate).toLocaleString('ru-RU')}
                      </div>
                    </CardContent>
                  </Card>

                  {selectedStats.isOnline && selectedStats.playerList.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Игроки онлайн ({selectedStats.playerList.length})</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {selectedStats.playerList.slice(0, 12).map((player, index) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                              <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center text-xs text-white">
                                {player.charAt(0)}
                              </div>
                              <span className="text-sm truncate">{player}</span>
                            </div>
                          ))}
                          {selectedStats.playerList.length > 12 && (
                            <div className="text-sm text-muted-foreground p-2">
                              и еще {selectedStats.playerList.length - 12} игроков...
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="h-full">
                  <CardContent className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <Icon name="Server" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Выберите сервер для просмотра статистики</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Форма добавления/редактирования сервера */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {currentServer ? "Редактировать сервер" : "Добавить сервер"}
                </DialogTitle>
                <DialogDescription>
                  {currentServer 
                    ? "Измените параметры сервера для мониторинга"
                    : "Добавьте новый сервер для мониторинга статистики"
                  }
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Название *</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={currentServer?.name}
                      placeholder="Основной сервер"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="version">Версия</Label>
                    <Input
                      id="version"
                      name="version"
                      defaultValue={currentServer?.version}
                      placeholder="1.20.1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Адрес *</Label>
                    <Input
                      id="address"
                      name="address"
                      defaultValue={currentServer?.address}
                      placeholder="play.example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="port">Порт</Label>
                    <Input
                      id="port"
                      name="port"
                      type="number"
                      defaultValue={currentServer?.port || 25565}
                      placeholder="25565"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Максимум игроков</Label>
                  <Input
                    id="maxPlayers"
                    name="maxPlayers"
                    type="number"
                    defaultValue={currentServer?.maxPlayers || 100}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    name="description"
                    defaultValue={currentServer?.description}
                    placeholder="Дополнительное описание сервера"
                    rows={3}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    name="isActive"
                    defaultChecked={currentServer?.isActive ?? true}
                  />
                  <Label htmlFor="isActive">Активен</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Отмена
                  </Button>
                  <Button type="submit">
                    {currentServer ? "Сохранить" : "Добавить"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Диалог подтверждения удаления */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить сервер</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите удалить сервер "{serverToDelete?.name}" из мониторинга?
                  Это действие нельзя отменить, и сервер перестанет отображаться для игроков.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default ServerMonitoring;