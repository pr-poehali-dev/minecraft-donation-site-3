import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Server } from "@/types/server";
import ServerForm from "@/components/admin/servers/ServerForm";

interface ServerManagementProps {
  servers: Server[];
  onUpdate: (servers: Server[]) => void;
}

const ServerManagement = ({ servers, onUpdate }: ServerManagementProps) => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentServer, setCurrentServer] = useState<Server | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serverToDelete, setServerToDelete] = useState<Server | null>(null);

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
      onUpdate(updatedServers);
      
      toast({
        title: "Сервер удален",
        description: `Сервер "${serverToDelete.name}" был удален из мониторинга.`
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
    
    onUpdate(updatedServers);
    setIsFormOpen(false);
    
    toast({
      title: currentServer ? "Сервер обновлен" : "Сервер добавлен",
      description: `${server.name} был успешно ${currentServer ? "обновлен" : "добавлен"} в мониторинг. Изменения также отображаются в админ-панели.`,
    });
  };

  return (
    <section className="py-8 bg-background">
      <div className="container px-4 md:px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-semibold">Управление серверами</h2>
            <p className="text-muted-foreground">
              Добавляйте, редактируйте или удаляйте серверы из мониторинга
            </p>
          </div>
          <Button onClick={handleAddServer}>
            <Icon name="Plus" className="w-4 h-4 mr-2" />
            Добавить сервер
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servers.map((server) => (
            <Card key={server.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      server.status === 'online' ? 'bg-green-500' : 
                      server.status === 'loading' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    {server.name}
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Icon name="MoreVertical" className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditServer(server)}>
                        <Icon name="Edit" className="w-4 h-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(server)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Icon name="Trash" className="w-4 h-4 mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Адрес:</span>
                    <span className="font-mono text-xs">{server.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Версия:</span>
                    <Badge variant="outline">{server.version}</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Игроки:</span>
                    <span>{server.players.online} / {server.players.max}</span>
                  </div>
                  {server.tps && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">TPS:</span>
                      <span className={server.tps > 18 ? 'text-green-600' : 'text-amber-600'}>
                        {server.tps.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {servers.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
              <Icon name="Server" className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Нет серверов</h3>
              <p className="text-muted-foreground mb-4">
                Добавьте первый сервер для начала мониторинга.
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
                  ? "Измените настройки сервера в мониторинге"
                  : "Добавьте новый сервер в мониторинг"
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
                Вы уверены, что хотите удалить сервер "{serverToDelete?.name}" из мониторинга?
                Это действие нельзя отменить.
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
      </div>
    </section>
  );
};

export default ServerManagement;