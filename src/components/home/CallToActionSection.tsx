
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const CallToActionSection = () => {
  return (
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
  );
};

export default CallToActionSection;
