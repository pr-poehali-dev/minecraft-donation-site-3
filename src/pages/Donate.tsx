
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Icon from "@/components/ui/icon";

interface DonateItem {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  popular?: boolean;
  discount?: number;
  category: string;
}

const Donate = () => {
  const [selectedCategory, setSelectedCategory] = useState("vip");
  
  const donateItems: DonateItem[] = [
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
  
  const categories = [
    { id: "vip", label: "VIP-статусы", icon: "Crown" },
    { id: "items", label: "Предметы", icon: "Package" },
    { id: "weapons", label: "Оружие и броня", icon: "Sword" },
    { id: "cosmetics", label: "Косметика", icon: "Sparkles" }
  ];
  
  const filteredItems = donateItems.filter(item => item.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section py-12 md:py-20">
        <div className="container px-4 md:px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Донат-магазин</h1>
            <p className="text-lg md:text-xl mb-6 text-gray-300">
              Поддержите наш проект и получите уникальные возможности и предметы
            </p>
          </div>
        </div>
      </section>
      
      {/* Donate Items Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold mb-2">Выберите категорию</h2>
                <p className="text-muted-foreground">Просмотрите все доступные товары и услуги</p>
              </div>
              <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2"
                  >
                    <Icon name={category.icon} size={16} />
                    <span className="hidden md:inline">{category.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <Separator className="mb-8" />
            
            {categories.map(category => (
              <TabsContent key={category.id} value={category.id} className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map(item => (
                    <Card key={item.id} className="donation-item border-primary/20 overflow-hidden relative">
                      {item.popular && (
                        <Badge className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground">
                          Популярное
                        </Badge>
                      )}
                      {item.discount && (
                        <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                          -{item.discount}%
                        </Badge>
                      )}
                      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 p-6 flex items-center justify-center">
                        <div className="animate-float">
                          <img 
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-36 w-36 object-contain"
                          />
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-semibold">{item.name}</h3>
                          <div className="flex items-center">
                            {item.discount && (
                              <span className="text-muted-foreground line-through mr-2 text-sm">
                                {Math.round(item.price / (1 - item.discount / 100))} ₽
                              </span>
                            )}
                            <span className="text-primary font-bold">{item.price} ₽</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                        <Button className="w-full">
                          <Icon name="ShoppingCart" size={16} className="mr-2" />
                          Купить
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-12 bg-card">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Часто задаваемые вопросы</h2>
            <p className="text-muted-foreground">Ответы на популярные вопросы о донате</p>
          </div>
          
          <div className="grid gap-4 md:gap-8 max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Как происходит оплата?</h3>
                <p className="text-muted-foreground">
                  Мы поддерживаем различные способы оплаты: банковские карты, электронные кошельки, мобильный платеж и криптовалюты. После оплаты товар будет доступен в течение 5 минут.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Сколько действуют привилегии?</h3>
                <p className="text-muted-foreground">
                  Все привилегии (VIP, Premium, Elite) выдаются навсегда и действуют на всех наших серверах. Вы не потеряете привилегию при вайпе сервера.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">Что делать, если товар не пришел?</h3>
                <p className="text-muted-foreground">
                  Если в течение 5 минут после оплаты вы не получили товар, обратитесь в нашу поддержку через Discord или напишите на почту support@craftworld.ru.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Promo Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">Специальное предложение</h2>
          <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
            Используйте промокод <span className="font-minecraft font-semibold text-primary">CRAFT2025</span> для скидки 15% на любую покупку!
          </p>
          <Button size="lg">
            <Icon name="Zap" size={18} className="mr-2" />
            Активировать промокод
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Donate;
