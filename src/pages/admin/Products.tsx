
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
  CardDescription,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { DonateItem } from "@/types/donation";
import { AdminUser } from "@/types/admin";
import Icon from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";

const PRODUCTS_STORAGE_KEY = "craft_world_products";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<DonateItem[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<DonateItem | undefined>(undefined);

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }

    // Загружаем товары из localStorage
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Демо-данные если нет сохраненных
      const demoProducts: DonateItem[] = [
        {
          id: 1,
          name: "VIP Статус",
          price: 199,
          description: "Доступ к VIP командам и слотам на сервере",
          imageUrl: "https://images.unsplash.com/photo-1614680376739-414d95ff43df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          popular: true,
          category: "vip",
          commandTemplate: "pex user {player} group set vip",
          servers: ["survival", "skyblock"],
          inStock: true
        },
        {
          id: 2,
          name: "Алмазный меч",
          price: 99,
          description: "Алмазный меч с зачарованием Острота V",
          imageUrl: "https://images.unsplash.com/photo-1607513746994-51f730a44832?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          category: "items",
          commandTemplate: "give {player} diamond_sword{Enchantments:[{id:sharpness,lvl:5}]} 1",
          servers: ["survival"],
          inStock: true
        }
      ];
      setProducts(demoProducts);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(demoProducts));
    }
  }, []);

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

  const handleDeleteProduct = (id: number) => {
    if (confirm("Вы уверены, что хотите удалить этот товар?")) {
      const updatedProducts = products.filter(product => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
      toast({
        title: "Товар удален",
        description: "Товар был успешно удален из каталога."
      });
    }
  };

  const saveProduct = (product: DonateItem) => {
    let updatedProducts: DonateItem[];
    
    if (products.some(p => p.id === product.id)) {
      // Обновляем существующий товар
      updatedProducts = products.map(p => 
        p.id === product.id ? product : p
      );
    } else {
      // Добавляем новый товар
      updatedProducts = [...products, product];
    }
    
    setProducts(updatedProducts);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedProducts));
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
                  <CardDescription className="line-clamp-2">
                    {product.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-wrap gap-1">
                    {product.servers.map(server => (
                      <Badge key={server} variant="secondary" className="text-xs">
                        {server}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground truncate">
                    Команда: <code>{product.commandTemplate}</code>
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
            
            {products.length === 0 && (
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
