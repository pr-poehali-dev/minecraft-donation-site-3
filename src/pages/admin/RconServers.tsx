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

const RCON_API_URL = "https://functions.poehali.dev/a70e9bce-a39c-4c5f-b6cf-9012154678f1";

interface RconServer {
  id: string;
  name: string;
  address: string;
  rconPort: number;
  rconPassword?: string;
  description?: string;
  isActive: boolean;
}

const RconServers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [servers, setServers] = useState<RconServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingServer, setEditingServer] = useState<RconServer | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    rconPort: 25575,
    rconPassword: "",
    description: "",
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
      const response = await fetch(RCON_API_URL);
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
      rconPort: 25575,
      rconPassword: "",
      description: "",
      isActive: true
    });
    setEditingServer(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const serverData = {
        id: editingServer?.id || `rcon_${Date.now()}`,
        ...formData
      };

      const response = await fetch(RCON_API_URL, {
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

  const handleEdit = async (server: RconServer) => {
    try {
      const response = await fetch(`${RCON_API_URL}?id=${server.id}`);
      const data = await response.json();
      
      if (data.success && data.server) {
        setEditingServer(data.server);
        setFormData({
          name: data.server.name,
          address: data.server.address,
          rconPort: data.server.rconPort,
          rconPassword: data.server.rconPassword || "",
          description: data.server.description || "",
          isActive: data.server.isActive
        });
        setShowForm(true);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные сервера",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (serverId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этот сервер?")) {
      return;
    }

    try {
      const response = await fetch(`${RCON_API_URL}?id=${serverId}`, {
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
              <h1 className="text-2xl font-bold">RCON серверы</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Серверы для автоматической выдачи донатов и товаров
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
                  {editingServer ? "Редактирование RCON сервера" : "Новый RCON сервер"}
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
                        placeholder="Выживание"
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
                      <Label htmlFor="rconPort">RCON порт</Label>
                      <Input
                        id="rconPort"
                        type="number"
                        value={formData.rconPort}
                        onChange={(e) => setFormData({ ...formData, rconPort: parseInt(e.target.value) })}
                        placeholder="25575"
                      />
                    </div>

                    <div>
                      <Label htmlFor="rconPassword">RCON пароль *</Label>
                      <Input
                        id="rconPassword"
                        type="password"
                        value={formData.rconPassword}
                        onChange={(e) => setFormData({ ...formData, rconPassword: e.target.value })}
                        placeholder="••••••••"
                        required
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
                <p className="text-muted-foreground">Нет добавленных RCON серверов</p>
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
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                            server.isActive 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                          }`}>
                            {server.isActive ? 'Активен' : 'Отключен'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-2">
                          <div>
                            <span className="text-muted-foreground">IP:</span>
                            <p className="font-mono">{server.address}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">RCON порт:</span>
                            <p className="font-mono">{server.rconPort}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">RCON пароль:</span>
                            <p className="font-mono">••••••••</p>
                          </div>
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

export default RconServers;