
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DonateItem, DonationCategory, GameServer } from "@/types/donation";
import Icon from "@/components/ui/icon";

const PRODUCTS_STORAGE_KEY = "craft_world_products";
const SERVERS_STORAGE_KEY = "craft_world_servers";
const CATEGORIES_STORAGE_KEY = "craft_world_categories";

interface ProductFormProps {
  product?: DonateItem;
  onSave: (product: DonateItem) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const { toast } = useToast();
  const isEditing = !!product;
  
  const [formData, setFormData] = useState<DonateItem>({
    id: product?.id || Date.now(),
    name: product?.name || "",
    price: product?.price || 0,
    description: product?.description || "",
    imageUrl: product?.imageUrl || "https://images.unsplash.com/photo-1607513746994-51f730a44832?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    popular: product?.popular || false,
    discount: product?.discount || 0,
    category: product?.category || "",
    commandTemplate: product?.commandTemplate || "",
    servers: product?.servers || [],
    inStock: product?.inStock ?? true,
  });
  
  const [categories, setCategories] = useState<DonationCategory[]>([]);
  const [servers, setServers] = useState<GameServer[]>([]);
  const [selectedServers, setSelectedServers] = useState<string[]>(formData.servers);
  
  // Загрузка категорий и серверов
  useEffect(() => {
    const loadedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (loadedCategories) {
      setCategories(JSON.parse(loadedCategories));
    } else {
      // Демо-данные если нет сохраненных
      const demoCategories: DonationCategory[] = [
        { id: "vip", label: "VIP привилегии", icon: "Crown" },
        { id: "items", label: "Игровые предметы", icon: "Sword" },
        { id: "money", label: "Игровая валюта", icon: "Coins" }
      ];
      setCategories(demoCategories);
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(demoCategories));
    }
    
    const loadedServers = localStorage.getItem(SERVERS_STORAGE_KEY);
    if (loadedServers) {
      setServers(JSON.parse(loadedServers));
    } else {
      // Демо-данные если нет сохраненных
      const demoServers: GameServer[] = [
        { id: "survival", name: "Выживание", address: "mc.example.com", version: "1.19.2", isActive: true },
        { id: "skyblock", name: "SkyBlock", address: "sb.example.com", version: "1.18.2", isActive: true }
      ];
      setServers(demoServers);
      localStorage.setItem(SERVERS_STORAGE_KEY, JSON.stringify(demoServers));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleServerToggle = (serverId: string) => {
    setSelectedServers(prev => 
      prev.includes(serverId) 
        ? prev.filter(id => id !== serverId) 
        : [...prev, serverId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Обновляем список серверов перед сохранением
    const updatedProduct = { 
      ...formData,
      servers: selectedServers
    };
    
    try {
      onSave(updatedProduct);
      toast({
        title: isEditing ? "Товар обновлен" : "Товар добавлен",
        description: `${updatedProduct.name} был успешно ${isEditing ? "обновлен" : "добавлен"}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Не удалось сохранить товар. Попробуйте еще раз.",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isEditing ? `Редактирование: ${product.name}` : "Добавить новый товар"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название товара</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="VIP привилегия"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Цена (руб.)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleNumberChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Скидка (%)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleNumberChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Категория</Label>
              <Select 
                value={formData.category} 
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Описание привилегии или предмета"
                rows={3}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imageUrl">URL изображения</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="commandTemplate">Шаблон команды выдачи</Label>
              <Input
                id="commandTemplate"
                name="commandTemplate"
                value={formData.commandTemplate}
                onChange={handleChange}
                placeholder="pex user {player} group set vip"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Используйте {player} для подстановки никнейма
              </p>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label>Доступно на серверах</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {servers.map((server) => (
                  <div key={server.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`server-${server.id}`}
                      checked={selectedServers.includes(server.id)}
                      onCheckedChange={() => handleServerToggle(server.id)}
                    />
                    <label
                      htmlFor={`server-${server.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {server.name} ({server.version})
                    </label>
                  </div>
                ))}
              </div>
              {servers.length === 0 && (
                <p className="text-xs text-muted-foreground">Нет доступных серверов</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="popular"
                checked={formData.popular}
                onCheckedChange={(checked) => handleCheckboxChange("popular", !!checked)}
              />
              <label
                htmlFor="popular"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Популярный товар
              </label>
            </div>
            
            <div className="flex items-center space-x-2 md:col-span-2">
              <Checkbox
                id="inStock"
                checked={formData.inStock}
                onCheckedChange={(checked) => handleCheckboxChange("inStock", !!checked)}
              />
              <label
                htmlFor="inStock"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Доступен для покупки
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">
            <Icon name="Save" className="w-4 h-4 mr-2" />
            {isEditing ? "Сохранить изменения" : "Добавить товар"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProductForm;
