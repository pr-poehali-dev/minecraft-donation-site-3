
import { ServerData } from "@/types/server";
import { FeatureItem } from "@/types/feature";
import { DonationItem } from "@/types/donation";

export const serverList: ServerData[] = [
  { id: 1, name: "CraftWorld Выживание", address: "survival.craftworld.ru", version: "1.20.4" },
  { id: 2, name: "CraftWorld Мини-игры", address: "minigames.craftworld.ru", version: "1.20.4" },
  { id: 3, name: "CraftWorld Креатив", address: "creative.craftworld.ru", version: "1.20.4" },
];

export const features: FeatureItem[] = [
  { 
    icon: "Shield", 
    title: "Защита от гриферов", 
    description: "Мы используем продвинутые плагины для защиты ваших построек."
  },
  { 
    icon: "Star", 
    title: "Уникальная экономика", 
    description: "Собственная экономическая система с возможностью торговли между игроками."
  },
  { 
    icon: "Cpu", 
    title: "Мощное железо", 
    description: "Наши сервера работают на современном оборудовании без лагов и задержек."
  },
];

export const featuredDonationItems: DonationItem[] = [
  {
    id: 1,
    title: "VIP Статус",
    price: 300,
    description: "Получите особые возможности и доступ к уникальным функциям.",
    imageUrl: "https://images.unsplash.com/photo-1607462905151-39e5a5d14845?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    gradientColors: "from-primary/20 to-accent/20"
  },
  {
    id: 2,
    title: "Набор алмазов",
    price: 150,
    description: "Комплект из 64 алмазов для быстрого старта на сервере.",
    imageUrl: "https://images.unsplash.com/photo-1624382082412-08c63f5e37e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    gradientColors: "from-blue-500/20 to-purple-500/20"
  },
  {
    id: 3,
    title: "Легендарный меч",
    price: 500,
    description: "Уникальное оружие с особыми зачарованиями и эффектами.",
    imageUrl: "https://images.unsplash.com/photo-1641915410758-c70947f27297?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    gradientColors: "from-yellow-500/20 to-orange-500/20"
  }
];
