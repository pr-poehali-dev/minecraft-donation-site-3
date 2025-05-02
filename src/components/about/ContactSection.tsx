
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const ContactSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/20 to-accent/20">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-4xl font-semibold mb-4">Остались вопросы?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Свяжитесь с нами через Discord или социальные сети. Мы всегда рады помочь!
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button>
            <Icon name="Mail" size={18} className="mr-2" />
            Написать нам
          </Button>
          <Button variant="outline">
            <Icon name="MessageCircle" size={18} className="mr-2" />
            Присоединиться к Discord
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
