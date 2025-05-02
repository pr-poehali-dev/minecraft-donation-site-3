
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const HeroSection = () => {
  return (
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
  );
};

export default HeroSection;
