
export interface DonateItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  popular?: boolean;
  discount?: number;
  category: string;
  // Добавляем новые поля
  commandTemplate: string; // Шаблон команды для выдачи (например: "give {player} diamond 64")
  servers: string[]; // Массив идентификаторов серверов, на которых доступен товар
  inStock: boolean; // Доступен ли товар для покупки
}

export interface DonationCategory {
  id: string;
  label: string;
  icon: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// Добавляем новые интерфейсы для серверов
export interface GameServer {
  id: string;
  name: string;
  address: string; // IP или домен сервера
  port?: number;
  version: string;
  isActive: boolean;
}

// Интерфейс для заказа
export interface Order {
  id: string;
  userId?: string;
  playerName: string; // Никнейм игрока
  serverId: string; // ID сервера
  itemId: number; // ID товара
  status: 'pending' | 'paid' | 'completed' | 'failed';
  command?: string; // Сгенерированная команда для выполнения
  paymentMethod: string;
  paymentId?: string;
  amount: number;
  createdAt: string;
  completedAt?: string;
}

// Способы оплаты
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
}
