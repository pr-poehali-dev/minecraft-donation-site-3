import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/20 via-background to-background">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="container relative px-4 md:px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <Badge className="mb-4 px-6 py-2 text-base animate-fade-in" variant="outline">
            <Icon name="Zap" className="w-4 h-4 mr-2" />
            Онлайн 24/7 • Без лагов • Дружное комьюнити
          </Badge>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight animate-fade-in">
            <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
              CraftWorld
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto animate-fade-in leading-relaxed">
            Погрузись в <span className="text-primary font-semibold">удивительный мир</span> приключений 
            на лучшем Minecraft сервере
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 group hover:scale-105 transition-transform">
              <Icon name="Gamepad2" className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Начать играть
              <Icon name="ArrowRight" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Link to="/donate" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full text-lg px-8 py-6 group hover:scale-105 transition-transform border-2">
                <Icon name="ShoppingBag" className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Донат-магазин
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-3 gap-8 pt-12 max-w-2xl mx-auto">
            <div className="space-y-2 animate-fade-in">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                150+
              </div>
              <div className="text-sm text-muted-foreground">Игроков онлайн</div>
            </div>
            
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent">
                5+
              </div>
              <div className="text-sm text-muted-foreground">Режимов игры</div>
            </div>
            
            <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground">Аптайм сервера</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
