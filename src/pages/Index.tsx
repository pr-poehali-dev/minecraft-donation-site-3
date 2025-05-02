
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServerStatus from "@/components/ServerStatus";
import Icon from "@/components/ui/icon";

const Index = () => {
  const [activeServer, setActiveServer] = useState(0);
  
  const serverList = [
    { id: 1, name: "CraftWorld Выживание", address: "survival.craftworld.ru", version: "1.20.4" },
    { id: 2, name: "CraftWorld Мини-игры", address: "minigames.craftworld.ru", version: "1.20.4" },
    { id: 3, name: "CraftWorld Креатив", address: "creative.craftworld.ru", version: "1.20.4" },
  ];
  
  const features = [
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section py-16 md:py-32">
        <div className="container px-4 md:px-6 text-center">
          <div className="animate-fade-in max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-minecraft mb-6 text-white">
              <span className="text-primary">Craft</span>World
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              Погрузись в удивительный мир майнкрафта на нашем сервере
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto">
                <Icon name="Play" size={18} />
                Начать играть
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Icon name="Store" size={18} />
                Донат-магазин
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Server Status Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Мониторинг серверов</h2>
            <p className="text-muted-foreground">Актуальная информация о состоянии наших серверов</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {serverList.map((server, index) => (
              <ServerStatus 
                key={server.id}
                serverName={server.name}
                serverAddress={server.address}
              />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/monitoring">
              <Button variant="outline">
                <Icon name="BarChart" size={16} />
                Подробная статистика
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-card">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Почему выбирают нас</h2>
            <p className="text-muted-foreground">Особенности, которые делают наш сервер уникальным</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-secondary/50 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 mx-auto bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center">
                    <Icon name={feature.icon} size={24} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Donation Preview Section */}
      <section className="py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-2">Популярные товары</h2>
            <p className="text-muted-foreground">Приобретите особые возможности и предметы</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="donation-item border-primary/20 overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 p-6 flex items-center justify-center">
                <div className="animate-float">
                  <img 
                    src="https://images.unsplash.com/photo-1607462905151-39e5a5d14845?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="VIP доступ"
                    className="h-28 w-28 object-contain"
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">VIP Статус</h3>
                  <div className="text-primary font-bold">300 ₽</div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">Получите особые возможности и доступ к уникальным функциям.</p>
                <Button className="w-full">Купить</Button>
              </CardContent>
            </Card>
            
            <Card className="donation-item border-primary/20 overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-6 flex items-center justify-center">
                <div className="animate-float">
                  <img 
                    src="https://images.unsplash.com/photo-1624382082412-08c63f5e37e9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Набор алмазов"
                    className="h-28 w-28 object-contain"
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Набор алмазов</h3>
                  <div className="text-primary font-bold">150 ₽</div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">Комплект из 64 алмазов для быстрого старта на сервере.</p>
                <Button className="w-full">Купить</Button>
              </CardContent>
            </Card>
            
            <Card className="donation-item border-primary/20 overflow-hidden">
              <div className="h-40 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-6 flex items-center justify-center">
                <div className="animate-float">
                  <img 
                    src="https://images.unsplash.com/photo-1641915410758-c70947f27297?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                    alt="Легендарный меч"
                    className="h-28 w-28 object-contain"
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">Легендарный меч</h3>
                  <div className="text-primary font-bold">500 ₽</div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">Уникальное оружие с особыми зачарованиями и эффектами.</p>
                <Button className="w-full">Купить</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-8">
            <Link to="/donate">
              <Button variant="outline">
                <Icon name="ShoppingCart" size={16} />
                Перейти в магазин
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Join CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-4xl font-semibold mb-4">Готов начать приключение?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Присоединяйся к тысячам игроков на нашем сервере и создавай удивительные миры вместе с нами!
          </p>
          <Button size="lg" className="animate-bounce">
            <Icon name="LogIn" size={18} />
            Присоединиться сейчас
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
