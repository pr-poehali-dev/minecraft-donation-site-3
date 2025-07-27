
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ServerForm from "@/components/admin/servers/ServerForm";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Server } from "@/types/server";
import { AdminUser } from "@/types/admin";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const SERVERS_STORAGE_KEY = "monitoring_servers";

const AdminServers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [servers, setServers] = useState<Server[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState<Server | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<Server | null>(null);

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }

    // Загружаем серверы из localStorage
    const storedServers = localStorage.getItem(SERVERS_STORAGE_KEY);
    if (storedServers) {
      setServers(JSON.parse(storedServers));
    } else {
      // Демо-данные если нет сохраненных
      const demoServers: Server[] = [
        {
          id: 1,
          name: "Выживание",
          address: "mc.example.com",
          version: "1.19.2",
          status: "online",
          players: { online: 24, max: 100 },
          tps: 19.8,
          uptime: 72,
          rconEnabled: true,
          rconPort: 25575,
          rconPassword: "securepassword",
        },
        {
          id: 2,
          name: "SkyBlock",
          address: "skyblock.example.com",
          version: "1.18.2",
          status: "online",
          players: { online: 15, max: 50 },
          tps: 20.0,
          uptime: 48,
          rconEnabled: false,
        }
      ];
      setServers(demoServers);
      localStorage.setItem(SERVERS_STORAGE_KEY, JSON.stringify(demoServers));
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  const handleAddServer = () => {
    setCurrentServer(undefined);
    setIsFormOpen(true);
  };

  const handleEditServer = (server: Server) => {
    setCurrentServer(server);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (server: Server) => {
    setServerToDelete(server);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (serverToDelete) {
      const updatedServers = servers.filter(server => server.id !== serverToDelete.id);
      setServers(updatedServers);
      localStorage.setItem(SERVERS_STORAGE_KEY, JSON.stringify(updatedServers));
      toast({
        title: "Сервер удален",
        description: `Сервер "${serverToDelete.name}" был успешно удален из системы.`
      });
      setDeleteDialogOpen(false);
      setServerToDelete(null);
    }
  };

  const saveServer = (server: Server) => {
    let updatedServers: Server[];
    
    if (servers.some(s => s.id === server.id)) {
      // Обновляем существующий сервер
      updatedServers = servers.map(s => 
        s.id === server.id ? server : s
      );
    } else {
      // Добавляем новый сервер
      updatedServers = [...servers, server];
    }
    
    setServers(updatedServers);
    localStorage.setItem(SERVERS_STORAGE_KEY, JSON.stringify(updatedServers));
    setIsFormOpen(false);
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Управление серверами</h1>
              <p className="text-muted-foreground">
                Добавляйте и редактируйте игровые серверы для автоматической выдачи товаров
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <a href="/monitoring" target="_blank" rel="noopener noreferrer">
                  <Icon name="Activity" className="w-4 h-4 mr-2" />
                  Открыть мониторинг
                </a>
              </Button>
              <Button variant="outline" onClick={() => {
                const dataStr = JSON.stringify(servers, null, 2);
                const dataBlob = new Blob([dataStr], {type: 'application/json'});
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'servers-backup.json';
                link.click();
                URL.revokeObjectURL(url);
                toast({
                  title: "Экспорт завершен",
                  description: "Настройки серверов сохранены в файл."
                });
              }}>
                <Icon name="Download" className="w-4 h-4 mr-2" />
                Экспорт
              </Button>
              <Button onClick={handleAddServer}>
                <Icon name="ServerCog" className="w-4 h-4 mr-2" />
                Добавить сервер
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Всего серверов</p>
                    <p className="text-2xl font-bold">{servers.length}</p>
                  </div>
                  <Icon name="Server" className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Онлайн</p>
                    <p className="text-2xl font-bold text-green-600">
                      {servers.filter(s => s.status === 'online').length}
                    </p>
                  </div>
                  <Icon name="CheckCircle" className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">С RCON</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {servers.filter(s => s.rconEnabled).length}
                    </p>
                  </div>
                  <Icon name="Settings" className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Всего игроков</p>
                    <p className="text-2xl font-bold">
                      {servers.reduce((sum, s) => sum + s.players.online, 0)}
                    </p>
                  </div>
                  <Icon name="Users" className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {servers.map((server) => (
              <Card key={server.id} className="overflow-hidden">
                <CardHeader className="p-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${server.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      {server.name}
                    </CardTitle>
                    <Badge variant="outline">{server.version}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Адрес:</span>
                      <span className="font-mono">{server.address}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Игроки:</span>
                      <span>{server.players.online} / {server.players.max}</span>
                    </div>
                    {server.tps && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">TPS:</span>
                        <span className={server.tps > 18 ? 'text-green-600' : 'text-amber-600'}>
                          {server.tps.toFixed(1)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-muted-foreground">RCON:</span>
                      <Badge variant={server.rconEnabled ? "default" : "outline"}>
                        {server.rconEnabled ? "Включен" : "Отключен"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => handleEditServer(server)}>
                    <Icon name="Settings" className="w-4 h-4 mr-2" />
                    Настройки
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteClick(server)}>
                    <Icon name="Trash" className="w-4 h-4 mr-2" />
                    Удалить
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {servers.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                <Icon name="Server" className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Нет серверов</h3>
                <p className="text-muted-foreground mb-4">
                  Добавьте хотя бы один сервер для возможности автоматической выдачи товаров.
                </p>
                <Button onClick={handleAddServer}>
                  <Icon name="Plus" className="w-4 h-4 mr-2" />
                  Добавить сервер
                </Button>
              </div>
            )}
          </div>
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {currentServer ? `Редактирование: ${currentServer.name}` : "Новый сервер"}
                </DialogTitle>
                <DialogDescription>
                  {currentServer 
                    ? "Измените информацию о сервере и настройте RCON для выдачи товаров"
                    : "Заполните информацию о новом сервере и настройте RCON для выдачи товаров"
                  }
                </DialogDescription>
              </DialogHeader>
              <ServerForm
                server={currentServer}
                onSave={saveServer}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>

          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Удалить сервер</AlertDialogTitle>
                <AlertDialogDescription>
                  Вы уверены, что хотите удалить сервер "{serverToDelete?.name}"?
                  Это действие нельзя отменить. Все связанные данные будут потеряны.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Удалить
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </main>
      </div>
    </div>
  );
};

export default AdminServers;