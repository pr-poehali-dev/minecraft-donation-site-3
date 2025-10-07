import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

const MonitoringHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-blue-500/10 to-background py-20 md:py-32">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container relative px-4 md:px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <Badge className="mb-4 px-6 py-2 text-base animate-fade-in" variant="outline">
            <Icon name="Activity" className="w-4 h-4 mr-2" />
            Мониторинг в реальном времени
          </Badge>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight animate-fade-in">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-500 to-primary bg-clip-text text-transparent">
              Мониторинг серверов
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in leading-relaxed">
            Актуальная информация о <span className="text-primary font-semibold">состоянии</span> и производительности наших серверов
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm">
            <div className="flex items-center gap-2 animate-fade-in">
              <Icon name="Zap" className="w-5 h-5 text-yellow-500" />
              <span className="text-muted-foreground">Обновление каждые 30 сек</span>
            </div>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Icon name="Server" className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground">Все сервера онлайн</span>
            </div>
            <div className="flex items-center gap-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Icon name="Users" className="w-5 h-5 text-blue-500" />
              <span className="text-muted-foreground">Статистика игроков</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MonitoringHeroSection;
