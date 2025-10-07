import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/products/ProductForm";
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
} from "@/components/ui/dialog";
import { DonateItem } from "@/types/donation";
import { AdminUser } from "@/types/admin";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const PRODUCTS_API_URL = "https://functions.poehali.dev/6574f144-b26c-46e4-a4eb-76db7d5dca00";
const RCON_API_URL = "https://functions.poehali.dev/a70e9bce-a39c-4c5f-b6cf-9012154678f1";

interface RconServer {
  id: string;
  name: string;
  address: string;
}

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<DonateItem[]>([]);
  const [rconServers, setRconServers] = useState<RconServer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<DonateItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
    
    loadProducts();
    loadRconServers();
  }, []);

  const loadRconServers = async () => {
    try {
      const response = await fetch(RCON_API_URL);
      const data = await response.json();
      
      if (data.success && data.servers) {
        setRconServers(data.servers);
      }
    } catch (error) {
      console.error("Ошибка загрузки RCON серверов:", error);
    }
  };

  const getServerName = (serverId: string): string => {
    const server = rconServers.find(s => s.id === serverId);
    return server ? server.name : serverId;
  };

  const loadProducts = async () => {
    try {
      const response = await fetch(PRODUCTS_API_URL);
      const data = await response.json();
      
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
      toast({
        variant: "destructive",
        title: "Ошибка загрузки",
        description: "Не удалось загрузить товары"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  const handleAddProduct = () => {
    setCurrentProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product: DonateItem) => {
    setCurrentProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      try {
        const response = await fetch(`${PRODUCTS_API_URL}?id=${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          await loadProducts();
          toast({
            title: "Товар удален",
            description: "Товар был успешно удален из каталога."
          });
        } else {
          throw new Error(data.error || "Ошибка удаления");
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось удалить товар"
        });
      }
    }
  };

  const saveProduct = async (product: DonateItem) => {
    try {
      const response = await fetch(PRODUCTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          imageUrl: product.imageUrl,
          popular: product.popular,
          discount: product.discount,
          category: product.category,
          commandTemplate: product.commandTemplate,
          servers: product.servers,
          inStock: product.inStock,
          timestamp: Date.now()
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        await loadProducts();
        setIsFormOpen(false);
        toast({
          title: currentProduct ? "Товар обновлен" : "Товар добавлен",
          description: `${product.name} был успешно ${currentProduct ? "обновлен" : "добавлен"}.`
        });
      } else {
        throw new Error(data.error || "Ошибка сохранения");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось сохранить товар"
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Управление товарами</h1>
              <p className="text-muted-foreground">
                Добавляйте и редактируйте товары для магазина
              </p>
            </div>
            <Button onClick={handleAddProduct}>
              <Icon name="Plus" className="w-4 h-4 mr-2" />
              Добавить товар
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Icon name="Loader2" className="w-8 h-8 animate-spin" />
              <span className="ml-3 text-muted-foreground">Загрузка товаров...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <Card key={product.id} className={`overflow-hidden ${!product.inStock ? 'opacity-70' : ''}`}>
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={product.imageUrl || "https://images.unsplash.com/photo-1607513746994-51f730a44832?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all hover:scale-105"
                    />
                    {product.popular && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        Популярный
                      </Badge>
                    )}
                    {product.discount > 0 && (
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <CardTitle>{product.name}</CardTitle>
                      <Badge variant="outline">{product.price} ₽</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                          <Icon name="Server" className="w-3 h-3" />
                          Доступен на серверах:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {product.servers && product.servers.length > 0 ? (
                            product.servers.map((server: string) => (
                              <Badge key={server} variant="secondary" className="text-xs">
                                {getServerName(server)}
                              </Badge>
                            ))
                          ) : (
                            <Badge variant="destructive" className="text-xs">
                              <Icon name="AlertCircle" className="w-3 h-3 mr-1" />
                              Не настроен
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <div className="flex items-center gap-1 mb-0.5">
                          <Icon name="Terminal" className="w-3 h-3" />
                          Команда:
                        </div>
                        <code className="bg-muted px-1.5 py-0.5 rounded text-xs">{product.commandTemplate || 'Не указана'}</code>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                      <Icon name="Edit" className="w-4 h-4 mr-2" />
                      Изменить
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                      <Icon name="Trash" className="w-4 h-4 mr-2" />
                      Удалить
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {products.length === 0 && !isLoading && (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                  <Icon name="Package" className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Нет товаров</h3>
                  <p className="text-muted-foreground mb-4">
                    В вашем магазине пока нет товаров. Добавьте первый товар.
                  </p>
                  <Button onClick={handleAddProduct}>
                    <Icon name="Plus" className="w-4 h-4 mr-2" />
                    Добавить товар
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {currentProduct ? `Редактирование: ${currentProduct.name}` : "Новый товар"}
                </DialogTitle>
                <DialogDescription>
                  {currentProduct 
                    ? "Измените информацию о товаре и нажмите 'Сохранить изменения'"
                    : "Заполните информацию о новом товаре и нажмите 'Добавить товар'"
                  }
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={currentProduct}
                onSave={saveProduct}
                onCancel={() => setIsFormOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default AdminProducts;