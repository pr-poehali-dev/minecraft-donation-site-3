import { NewsItem, NewsCategory } from "@/types/news";

export const newsCategories: NewsCategory[] = [
  { id: "update", name: "Обновления", color: "bg-blue-500", icon: "Download" },
  { id: "event", name: "События", color: "bg-purple-500", icon: "Calendar" },
  {
    id: "announcement",
    name: "Объявления",
    color: "bg-green-500",
    icon: "Megaphone",
  },
  { id: "bugfix", name: "Исправления", color: "bg-orange-500", icon: "Bug" },
];

export const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Крупное обновление 2.0 - Новые биомы и существа",
    excerpt:
      "Добавлены 5 новых биомов, 12 видов мобов и улучшена система крафта. Исследуйте загадочные пещеры и стройте в облаках!",
    content: `# Обновление 2.0 уже здесь!

## 🌍 Новые биомы
- **Кристальные пещеры** - светящиеся кристаллы и уникальные руды
- **Небесные острова** - стройте в облаках с новыми блоками
- **Тёмный лес** - опасный биом с редкими ресурсами

## 🐺 Новые мобы
- Кристальные големы
- Небесные драконы
- Теневые волки
- И многие другие!

## ⚡ Улучшения
- Переработана система крафта
- Новые зачарования
- Оптимизация производительности`,
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    category: "update",
    isPublished: true,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    author: "Администратор",
    tags: ["обновление", "биомы", "мобы"],
  },
  {
    id: "2",
    title: "Зимний фестиваль - Эксклюзивные награды",
    excerpt:
      "С 20 декабря по 10 января проходит зимний фестиваль с уникальными заданиями и наградами.",
    content: `# ❄️ Зимний фестиваль 2024

Встречайте самое волшебное событие года!

## 🎁 Награды
- Эксклюзивные скины
- Зимние блоки
- Особые питомцы

## 📅 Даты
**20 декабря - 10 января**

Не упустите шанс получить уникальные предметы!`,
    imageUrl:
      "https://images.unsplash.com/photo-1544273677-6433bc264f2c?w=800&h=400&fit=crop",
    category: "event",
    isPublished: true,
    createdAt: "2024-01-10T15:30:00Z",
    updatedAt: "2024-01-10T15:30:00Z",
    author: "Event Manager",
    tags: ["событие", "фестиваль", "награды"],
  },
  {
    id: "3",
    title: "Исправлены критические ошибки",
    excerpt:
      "Устранены проблемы с лагами сервера и дюпами предметов. Стабильность улучшена на 40%.",
    content: `# 🔧 Исправления версии 1.9.3

## Устранённые проблемы
- Лаги при большом количестве игроков
- Дюп предметов через эндер-сундуки  
- Краши при загрузке чанков
- Проблемы с плагинами

## Улучшения производительности
- Оптимизация работы сервера
- Уменьшение потребления RAM на 25%
- Ускорение загрузки миров

Спасибо за терпение!`,
    imageUrl:
      "https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=800&h=400&fit=crop",
    category: "bugfix",
    isPublished: true,
    createdAt: "2024-01-08T12:00:00Z",
    updatedAt: "2024-01-08T12:00:00Z",
    author: "Tech Team",
    tags: ["исправления", "оптимизация", "багфиксы"],
  },
];
