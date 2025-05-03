
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

const AddServerSection = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-primary/20 to-accent/20">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-4xl font-semibold mb-4">Добавьте свой сервер</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Хотите добавить свой сервер в наш мониторинг? Мы предоставляем API и виджеты для интеграции статистики на ваш сайт.
        </p>
        <Button size="lg">
          <Icon name="PlusCircle" size={18} className="mr-2" />
          Добавить сервер
        </Button>
      </div>
    </section>
  );
};

export default AddServerSection;
