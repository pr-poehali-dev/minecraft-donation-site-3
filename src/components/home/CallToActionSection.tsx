import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";

const CallToActionSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/20" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="container relative px-4 md:px-6">
        <Card className="max-w-4xl mx-auto bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-xl border-primary/30 shadow-2xl overflow-hidden">
          <div className="p-12 md:p-16 text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-block p-4 bg-gradient-to-br from-primary to-purple-600 rounded-2xl mb-4">
                <Icon name="Rocket" size={48} className="text-white" />
              </div>
              
              <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Готов начать приключение?
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Присоединяйся к тысячам игроков на нашем сервере и создавай удивительные миры вместе с друзьями!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-primary to-purple-600 hover:scale-105 transition-transform group"
              >
                <Icon name="Play" className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                Начать играть прямо сейчас
                <Icon name="ArrowRight" className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Link to="/monitoring" className="w-full sm:w-auto">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full text-lg px-8 py-6 border-2 hover:scale-105 transition-transform"
                >
                  <Icon name="Activity" className="w-5 h-5 mr-2" />
                  Мониторинг серверов
                </Button>
              </Link>
            </div>
            
            <div className="pt-8 border-t border-primary/20">
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icon name="Check" className="w-4 h-4 text-green-500" />
                  <span>Без вайпов</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Check" className="w-4 h-4 text-green-500" />
                  <span>Честная админка</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Check" className="w-4 h-4 text-green-500" />
                  <span>Постоянные ивенты</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Check" className="w-4 h-4 text-green-500" />
                  <span>Дружное комьюнити</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default CallToActionSection;
