
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ServersList from "@/components/admin/servers/ServersList";
import ServerForm from "@/components/admin/servers/ServerForm";
import { Button } from "@/components/ui/button";
import { AdminUser, ServerMonitoring } from "@/types/admin";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const AdminServers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingServer, setEditingServer] = useState<ServerMonitoring | undefined>(undefined);
  
  // Заглушка для демонстрационных данных
  const [servers, setServers] = useState<ServerMonitoring[]>([
    {
      id: "1",
      name: "CraftWorld Выживание",
      address: "survival.craftworld.ru",
      version: "1.20.4",
      maxPlayers: 100,
      isActive: true,
      createdAt: "2023-02-10T08:15:00Z",
      updatedAt: "2023-02-10T08:15:00Z",
    },
    {
      id: "2",
      name: "CraftWorld Мини-игры",
      address: "minigames.craftworld.ru",
      version: "1.20.4",
      maxPlayers: 50,
      isActive: true,
      createdAt: "2023-03-05T11:30:00Z",
      updatedAt: "2023-03-05T11:30:00Z",
    },
    {
      id: "3",
      name: "CraftWorld Креатив",
      address: "creative.craftworld.ru",
      version: "1.20.4",
      maxPlayers: 50,
      isActive: true,
      createdAt: "2023-04-22T14:45:00Z",
      updatedAt: "2023-04-22T14:45:00Z",
    },
  ]);
  
  const [user] = useState<AdminUser>({
    id: "1",
    username: "admin",
    email: "admin@craftworld.ru",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
  });

  const handleLogout = () => {
    navigate("/admin/login");
  };
  
  const handleAddServer = () => {
    setEditingServer(undefined);
    setIsFormVisible(true);
  };
  
  const handleEditServer = (server: ServerMonitoring) => {
    setEditingServer(server);
    setIsFormVisible(true);
  };
  
  const handleDeleteServer = (serverId: string) => {
    setServers(prev => prev.filter(server => server.id !== serverId));
    toast({
      title: "Сервер удален",
      description: "Сервер был успешно удален из мониторинга",
    });
  };
  
  const handleFormSubmit = (values: any) => {
    if (editingServer) {
      // Обновляем существующий сервер
      setServers(prev => prev.map(server => 
        server.id === editingServer.id 
          ? { 
              ...server, 
              ...values, 
              updatedAt: new Date().toISOString() 
            } 
          : server
      ));
      toast({
        title: "Сервер обновлен",
        description: "Данные сервера были успешно обновлены",
      });
    } else {
      // Создаем новый сервер
      const newServer: ServerMonitoring = {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setServers(prev => [...prev, newServer]);
      toast({
        title: "Сервер добавлен",
        description: "Новый сервер был успешно добавлен в мониторинг",
      });
    }
    setIsFormVisible(false);
  };
  
  const handleCancel = () => {
    setIsFormVisible(false);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Управление серверами</h1>
            {!isFormVisible && (
              <Button onClick={handleAddServer}>
                <Icon name="Plus" className="mr-2" size={16} />
                Добавить сервер
              </Button>
            )}
          </div>
          
          {isFormVisible ? (
            <ServerForm 
              initialData={editingServer}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <ServersList 
              servers={servers}
              onEdit={handleEditServer}
              onDelete={handleDeleteServer}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminServers;
