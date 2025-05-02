
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface PromoSectionProps {
  promoCode: string;
  discount: number;
}

const PromoSection = ({ promoCode, discount }: PromoSectionProps) => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary/20 to-accent/20">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-2xl md:text-4xl font-semibold mb-4">Специальное предложение</h2>
        <p className="text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
          Используйте промокод <span className="font-minecraft font-semibold text-primary">{promoCode}</span> для скидки {discount}% на любую покупку!
        </p>
        <Button size="lg">
          <Icon name="Zap" size={18} className="mr-2" />
          Активировать промокод
        </Button>
      </div>
    </section>
  );
};

export default PromoSection;
