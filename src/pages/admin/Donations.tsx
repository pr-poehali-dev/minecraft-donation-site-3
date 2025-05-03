
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import DonationServicesList from "@/components/admin/donations/DonationServicesList";
import DonationServiceForm from "@/components/admin/donations/DonationServiceForm";
import { Button } from "@/components/ui/button";
import { AdminUser, DonationService } from "@/types/admin";
import Icon from "@/components/ui/icon";
import { useToast } from "@/hooks/use-toast";

const AdminDonations = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingService, setEditingService] = useState<DonationService | undefined>(undefined);
  
  // Заглушка для демонстрационных данных
  const [services, setServices] = useState<DonationService[]>([
    {
      id: "1",
      name: "VIP Ранг",
      description: "Доступ к VIP-командам и возможностям на сервере.",
      price: 299,
      category: "ranks",
      imageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&w=50&h=50&fit=crop",
      isActive: true,
      createdAt: "2023-04-15T10:30:00Z",
      updatedAt: "2023-04-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Premium Ранг",
      description: "Расширенные возможности для игроков, включая телепортацию и защиту региона.",
      price: 599,
      category: "ranks",
      imageUrl: "https://images.unsplash.com/photo-1636955816868-fcb881e57954?auto=format&w=50&h=50&fit=crop",
      isActive: true,
      createdAt: "2023-04-20T14:45:00Z",
      updatedAt: "2023-04-20T14:45:00Z",
    },
    {
      id: "3",
      name: "Кейс с предметами",
      description: "Случайные редкие предметы из премиального набора.",
      price: 199,
      category: "items",
      imageUrl: "https://images.unsplash.com/photo-1605792657660-596af9009e82?auto=format&w=50&h=50&fit=crop",
      isActive: true,
      createdAt: "2023-05-05T09:15:00Z",
      updatedAt: "2023-05-05T09:15:00Z",
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
  
  const handleAddService = () => {
    setEditingService(undefined);
    setIsFormVisible(true);
  };
  
  const handleEditService = (service: DonationService) => {
    setEditingService(service);
    setIsFormVisible(true);
  };
  
  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(service => service.id !== serviceId));
    toast({
      title: "Услуга удалена",
      description: "Донат-услуга была успешно удалена",
    });
  };
  
  const handleFormSubmit = (values: any) => {
    if (editingService) {
      // Обновляем существующую услугу
      setServices(prev => prev.map(service => 
        service.id === editingService.id 
          ? { 
              ...service, 
              ...values, 
              updatedAt: new Date().toISOString() 
            } 
          : service
      ));
      toast({
        title: "Услуга обновлена",
        description: "Донат-услуга была успешно обновлена",
      });
    } else {
      // Создаем новую услугу
      const newService: DonationService = {
        id: Date.now().toString(),
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setServices(prev => [...prev, newService]);
      toast({
        title: "Услуга создана",
        description: "Новая донат-услуга была успешно создана",
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
            <h1 className="text-3xl font-bold">Донат услуги</h1>
            {!isFormVisible && (
              <Button onClick={handleAddService}>
                <Icon name="Plus" className="mr-2" size={16} />
                Добавить услугу
              </Button>
            )}
          </div>
          
          {isFormVisible ? (
            <DonationServiceForm 
              initialData={editingService}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          ) : (
            <DonationServicesList 
              services={services}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDonations;
