import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Icon from "@/components/ui/icon";
import { Server } from "@/types/server";
import ServerForm from "@/components/admin/servers/ServerForm";

const SERVERS_STORAGE_KEY = "monitoring_servers";

const ServerMonitoring = () => {
  const { toast } = useToast();
  const [servers, setServers] = useState<Server[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState<Server | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<Server | null>(null);

  useEffect(() => {
    const savedServers = localStorage.getItem(SERVERS_STORAGE_KEY);
    if (savedServers) {
      setServers(JSON.parse(savedServers));
    }
  }, []);

  const saveServersToStorage = (updatedServers: Server[]) => {
    setServers(updatedServers);
    localStorage.setItem(SERVERS_STORAGE_KEY, JSON.stringify(updatedServers));
  };

  const handleEdit = (server: Server) => {
    setCurrentServer(server);
    setIsFormOpen(true);
  };

  const handleDelete = (server: Server) => {
    setServerToDelete(server);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serverToDelete) {
      const updatedServers = servers.filter(s => s.id !== serverToDelete.id);
      saveServersToStorage(updatedServers);
      
      toast({
        title: "Сервер удален",
        description: `${serverToDelete.name} был удален из мониторинга.`,
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
        s.id === server.id ? { ...server, status: s.status, players: s.players } : s
      );
    } else {
      // Добавляем новый сервер
      const newServer = {
        ...server,
        status: "offline" as const,
        players: { online: 0, max: server.players.max }
      };
      updatedServers = [...servers, newServer];
    }
    
    saveServersToStorage(updatedServers);
    setIsFormOpen(false);
    setCurrentServer(null);
    
    toast({
      title: currentServer ? "Сервер обновлен" : "Сервер добавлен",
      description: `${server.name} был успешно ${currentServer ? "обновлен" : "добавлен"} в мониторинг.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "offline": return "bg-red-500";
      case "maintenance": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": return "Онлайн";
      case "offline": return "Оффлайн";
      case "maintenance": return "Техработы";
      default: return "Неизвестно";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Мониторинг серверов</h1>
            <p className="text-muted-foreground">
              Управление серверами для мониторинга
            </p>
          </div>
        <Button 
          onClick={() => {
            setCurrentServer(null);
            setIsFormOpen(true);
          }}
        >
          <Icon name="Plus" className="mr-2 h-4 w-4" />
          Добавить сервер
        </Button>
      </div>

      {servers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Icon name="Server" className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground mb-2">
              Нет серверов
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Добавьте первый сервер для начала мониторинга
            </p>
            <Button 
              onClick={() => {
                setCurrentServer(null);
                setIsFormOpen(true);
              }}
            >
              <Icon name="Plus" className="mr-2 h-4 w-4" />
              Добавить сервер
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {servers.map((server) => (
            <Card key={server.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{server.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Icon name="MoreHorizontal" className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(server)}>
                        <Icon name="Edit" className="mr-2 h-4 w-4" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(server)}
                        className="text-red-600"
                      >
                        <Icon name="Trash2" className="mr-2 h-4 w-4" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(server.status)} text-white`}
                  >
                    {getStatusText(server.status)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {server.address}:{server.port}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Игроки:</span>
                  <span className="text-sm font-medium">
                    {server.players.online}/{server.players.max}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Версия:</span>
                  <span className="text-sm">{server.version}</span>
                </div>
                {server.description && (
                  <p className="text-sm text-muted-foreground">
                    {server.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Форма добавления/редактирования сервера */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentServer ? "Редактировать сервер" : "Добавить сервер"}
            </DialogTitle>
            <DialogDescription>
              {currentServer 
                ? "Внесите изменения в настройки сервера"
                : "Заполните информацию о новом сервере"
              }
            </DialogDescription>
          </DialogHeader>
          <ServerForm
            server={currentServer}
            onSave={saveServer}
            onCancel={() => {
              setIsFormOpen(false);
              setCurrentServer(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить сервер?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить сервер "{serverToDelete?.name}"? 
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default ServerMonitoring;