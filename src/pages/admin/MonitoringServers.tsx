import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminUser } from "@/types/admin";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const MONITORING_API_URL = "https://functions.poehali.dev/62a45015-2204-45c2-917c-d3a14f10d6b5";

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
    motd?: string;
  };
}

const MonitoringServers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [servers, setServers] = useState<MonitoringServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingServer, setEditingServer] = useState<MonitoringServer | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    port: 25565,
    version: "",
    description: "",
    maxPlayers: 100,
    isActive: true
  });

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
      loadServers();
    }
  }, []);

  const loadServers = async () => {
    try {
      const response = await fetch(MONITORING_API_URL);
      const data = await response.json();
      
      if (data.success) {
        setServers(data.servers || []);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить список серверов",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      port: 25565,
      version: "",
      description: "",
      maxPlayers: 100,
      isActive: true
    });
    setEditingServer(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serverData = {
        id: editingServer?.id || `server_${Date.now()}`,
        ...formData
      };

      const response = await fetch(MONITORING_API_URL, {
        method: editingServer ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serverData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Успешно",
          description: editingServer ? "Сервер обновлен" : "Сервер добавлен"
        });
        resetForm();
        loadServers();
      } else {
        throw new Error(data.error || "Ошибка сохранения");
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: error instanceof Error ? error.message : "Не удалось сохранить сервер",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (server: MonitoringServer) => {
    setEditingServer(server);
    setFormData({
      name: server.name,
      address: server.address,
      port: server.port,
      version: server.version || "",
      description: server.description || "",
      maxPlayers: server.maxPlayers,
      isActive: server.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (serverId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот сервер?")) {
      return;
    }

    try {
      const response = await fetch(`${MONITORING_API_URL}?id=${serverId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Успешно",
          description: "Сервер удален"
        });
        loadServers();
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сервер",
        variant: "destructive"
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Мониторинг серверов</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Серверы для отображения игрокам на странице "Серверы"
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} disabled={showForm}>
              <Icon name="Plus" className="w-4 h-4 mr-2" />
              Добавить сервер
            </Button>
          </div>

          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {editingServer ? "Редактирование сервера" : "Новый сервер мониторинга"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Название сервера *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Мой сервер"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="address">IP адрес *</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="mc.example.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="port">Порт</Label>
                      <Input
                        id="port"
                        type="number"
                        value={formData.port}
                        onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                        placeholder="25565"
                      />
                    </div>

                    <div>
                      <Label htmlFor="maxPlayers">Макс. игроков</Label>
                      <Input
                        id="maxPlayers"
                        type="number"
                        value={formData.maxPlayers}
                        onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
                        placeholder="100"
                      />
                    </div>

                    <div>
                      <Label htmlFor="version">Версия (необязательно)</Label>
                      <Input
                        id="version"
                        value={formData.version}
                        onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                        placeholder="1.20.4"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      />
                      <Label htmlFor="isActive">Активен</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Описание (необязательно)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Краткое описание сервера"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">
                      <Icon name="Save" className="w-4 h-4 mr-2" />
                      {editingServer ? "Сохранить" : "Добавить"}
                    </Button>
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Отмена
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader2" className="w-8 h-8 animate-spin" />
            </div>
          ) : servers.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Icon name="Server" className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Нет добавленных серверов</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {servers.map((server) => (
                <Card key={server.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{server.name}</h3>
                          {server.stats && (
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              server.stats.isOnline 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            }`}>
                              <div className={`w-2 h-2 rounded-full ${
                                server.stats.isOnline ? 'bg-green-500' : 'bg-red-500'
                              }`}></div>
                              {server.stats.isOnline ? 'Онлайн' : 'Оффлайн'}
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                          <div>
                            <span className="text-muted-foreground">IP:</span>
                            <p className="font-mono">{server.address}:{server.port}</p>
                          </div>
                          {server.version && (
                            <div>
                              <span className="text-muted-foreground">Версия:</span>
                              <p>{server.version}</p>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Макс. игроков:</span>
                            <p>{server.maxPlayers}</p>
                          </div>
                          {server.stats && (
                            <div>
                              <span className="text-muted-foreground">Онлайн:</span>
                              <p className="font-semibold">{server.stats.onlinePlayers} / {server.stats.maxPlayers}</p>
                            </div>
                          )}
                        </div>

                        {server.description && (
                          <p className="text-sm text-muted-foreground">{server.description}</p>
                        )}
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(server)}
                        >
                          <Icon name="Pencil" className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(server.id)}
                        >
                          <Icon name="Trash2" className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MonitoringServers;