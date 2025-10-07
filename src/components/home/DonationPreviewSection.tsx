import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { DonateItem } from "@/types/donation";

const PRODUCTS_API_URL = "https://functions.poehali.dev/6574f144-b26c-46e4-a4eb-76db7d5dca00";

const DonationPreviewSection = () => {
  const [items, setItems] = useState<DonateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    try {
      const response = await fetch(PRODUCTS_API_URL);
      const data = await response.json();
      
      if (data.success && data.products) {
        const featured = data.products
          .filter((p: DonateItem) => p.popular || p.inStock)
          .slice(0, 3);
        setItems(featured);
      }
    } catch (error) {
      console.error("Ошибка загрузки товаров:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-primary/5">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader2" className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="container relative px-4 md:px-6">
        <div className="text-center mb-16 space-y-4">
          <Badge className="mb-4 px-6 py-2 text-base" variant="outline">
            <Icon name="Sparkles" className="w-4 h-4 mr-2" />
            Популярные товары
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Улучши свой игровой опыт
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Приобретите эксклюзивные возможности и предметы для комфортной игры
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <Card 
              key={item.id} 
              className="group hover:scale-105 transition-all duration-300 border-primary/20 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 bg-card/80 backdrop-blur overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {item.popular && (
                <Badge className="absolute top-4 right-4 z-10 bg-gradient-to-r from-yellow-500 to-orange-500 border-0">
                  <Icon name="Star" className="w-3 h-3 mr-1" />
                  Популярное
                </Badge>
              )}
              
              {item.discount && item.discount > 0 && (
                <Badge variant="destructive" className="absolute top-4 left-4 z-10 text-base px-3 py-1">
                  -{item.discount}%
                </Badge>
              )}
              
              <div className="h-56 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20 p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
                <div className="relative animate-float">
                  <img 
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-40 w-40 object-contain drop-shadow-2xl"
                  />
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <div className="text-right">
                    {item.discount && item.discount > 0 && (
                      <div className="text-sm text-muted-foreground line-through">
                        {Math.round(item.price / (1 - item.discount / 100))} ₽
                      </div>
                    )}
                    <div className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                      {item.price} ₽
                    </div>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed line-clamp-2">
                  {item.description}
                </p>
                
                <Link to="/donate" className="block">
                  <Button className="w-full group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-purple-600 transition-all">
                    <Icon name="ShoppingCart" size={16} className="mr-2" />
                    Купить сейчас
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/donate">
            <Button size="lg" variant="outline" className="border-2 hover:scale-105 transition-transform">
              <Icon name="Store" size={20} className="mr-2" />
              Посмотреть все товары
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DonationPreviewSection;
