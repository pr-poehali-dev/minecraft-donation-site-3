
import { useState, useEffect } from "react";
import { DonateItem, DonationCategory, GameServer } from "@/types/donation";
import { useLocalStorage } from "./useLocalStorage";
import { useToast } from "@/hooks/use-toast";

const PRODUCTS_STORAGE_KEY = "craft_world_products";
const SERVERS_STORAGE_KEY = "craft_world_servers";
const CATEGORIES_STORAGE_KEY = "craft_world_categories";

// Демо данные для категорий
const DEFAULT_CATEGORIES: DonationCategory[] = [
  { id: "vip", label: "VIP привилегии", icon: "Crown" },
  { id: "items", label: "Игровые предметы", icon: "Sword" },
  { id: "money", label: "Игровая валюта", icon: "Coins" }
];

// Демо данные для серверов
const DEFAULT_SERVERS: GameServer[] = [
  { id: "survival", name: "Выживание", address: "mc.example.com", version: "1.19.2", isActive: true },
  { id: "skyblock", name: "SkyBlock", address: "sb.example.com", version: "1.18.2", isActive: true }
];

export interface ProductFormState {
  formData: DonateItem;
  categories: DonationCategory[];
  servers: GameServer[];
  selectedServers: string[];
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleCategoryChange: (value: string) => void;
  handleServerToggle: (serverId: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

export const useProductForm = (
  product: DonateItem | undefined,
  onSave: (product: DonateItem) => void,
  onCancel: () => void
): ProductFormState => {
  const { toast } = useToast();
  const isEditing = !!product;
  
  // Используем кастомный хук для работы с localStorage
  const [categories, setCategories] = useLocalStorage<DonationCategory[]>(
    CATEGORIES_STORAGE_KEY, 
    DEFAULT_CATEGORIES
  );
  
  const [servers, setServers] = useLocalStorage<GameServer[]>(
    SERVERS_STORAGE_KEY,
    DEFAULT_SERVERS
  );
  
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
  
  const [selectedServers, setSelectedServers] = useState<string[]>(formData.servers);
  
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
  
  return {
    formData,
    categories,
    servers,
    selectedServers,
    isEditing,
    handleChange,
    handleNumberChange,
    handleCheckboxChange,
    handleCategoryChange,
    handleServerToggle,
    handleSubmit
  };
};
