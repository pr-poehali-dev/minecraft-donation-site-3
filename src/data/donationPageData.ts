
import { DonateItem, DonationCategory, FaqItem } from "@/types/donation";

export const donateItems: DonateItem[] = [
  // VIP категория
  {
    id: 1,
    name: "VIP",
    price: 300,
    description: "Базовый VIP-статус. Включает доступ к /fly, /heal, цветной чат и 5 точек дома.",
    imageUrl: "https://images.unsplash.com/photo-1607462905151-39e5a5d14845?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    popular: true,
    category: "vip"
  },
  {
    id: 2,
    name: "Premium",
    price: 600,
    description: "Премиум статус. Все возможности VIP + доступ к /workbench, /enderchest и 10 точек дома.",
    imageUrl: "https://images.unsplash.com/photo-1616406432452-07bc5938759d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "vip"
  },
  {
    id: 3,
    name: "Elite",
    price: 1000,
    description: "Элитный статус. Все возможности Premium + доступ к /god, приватные магазины и 20 точек дома.",
    imageUrl: "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "vip"
  },
  // Предметы
  {
    id: 4,
    name: "Набор алмазов",
    price: 150,
    description: "Набор из 64 алмазов для быстрого старта на сервере.",
    imageUrl: "https://images.unsplash.com/photo-1624382082412-08c63f5e37e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    popular: true,
    category: "items"
  },
  {
    id: 5,
    name: "Сундук сокровищ",
    price: 400,
    description: "Сундук с редкими ресурсами: алмазы, изумруды, незерит, эндер-жемчуг.",
    imageUrl: "https://images.unsplash.com/photo-1639324998080-c0eda362718a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    discount: 20,
    category: "items"
  },
  {
    id: 6,
    name: "Набор строителя",
    price: 200,
    description: "Большой набор разнообразных блоков для строительства.",
    imageUrl: "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "items"
  },
  // Оружие
  {
    id: 7,
    name: "Легендарный меч",
    price: 500,
    description: "Меч с уникальными зачарованиями: Острота V, Добыча III, Knockback II.",
    imageUrl: "https://images.unsplash.com/photo-1641915410758-c70947f27297?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    popular: true,
    category: "weapons"
  },
  {
    id: 8,
    name: "Эпический лук",
    price: 450,
    description: "Лук с зачарованиями: Сила V, Бесконечность, Пламя.",
    imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "weapons"
  },
  {
    id: 9,
    name: "Броня Дракона",
    price: 800,
    description: "Полный комплект брони с защитой IV, Шипами III и Несокрушимость III.",
    imageUrl: "https://images.unsplash.com/photo-1569183602073-580599d8df15?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    discount: 15,
    category: "weapons"
  },
  // Косметика
  {
    id: 10,
    name: "Эксклюзивный пет",
    price: 350,
    description: "Уникальный питомец, который следует за вами и помогает в бою.",
    imageUrl: "https://images.unsplash.com/photo-1628968434441-d9c1c66dcde7?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "cosmetics"
  },
  {
    id: 11,
    name: "Набор частиц",
    price: 250,
    description: "Добавьте эффектные частицы вокруг своего персонажа.",
    imageUrl: "https://images.unsplash.com/photo-1599155253646-9e051dc67778?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    popular: true,
    category: "cosmetics"
  },
  {
    id: 12,
    name: "Костюмы",
    price: 300,
    description: "Набор из 5 уникальных скинов, доступных только через донат.",
    imageUrl: "https://images.unsplash.com/photo-1598330639597-05a68dccc0af?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    category: "cosmetics"
  }
];

export const donationCategories: DonationCategory[] = [
  { id: "vip", label: "VIP-статусы", icon: "Crown" },
  { id: "items", label: "Предметы", icon: "Package" },
  { id: "weapons", label: "Оружие и броня", icon: "Sword" },
  { id: "cosmetics", label: "Косметика", icon: "Sparkles" }
];

export const faqItems: FaqItem[] = [
  {
    question: "Как происходит оплата?",
    answer: "Мы поддерживаем различные способы оплаты: банковские карты, электронные кошельки, мобильный платеж и криптовалюты. После оплаты товар будет доступен в течение 5 минут."
  },
  {
    question: "Сколько действуют привилегии?",
    answer: "Все привилегии (VIP, Premium, Elite) выдаются навсегда и действуют на всех наших серверах. Вы не потеряете привилегию при вайпе сервера."
  },
  {
    question: "Что делать, если товар не пришел?",
    answer: "Если в течение 5 минут после оплаты вы не получили товар, обратитесь в нашу поддержку через Discord или напишите на почту support@craftworld.ru."
  }
];

export const promoCode = {
  code: "CRAFT2025",
  discount: 15
};
