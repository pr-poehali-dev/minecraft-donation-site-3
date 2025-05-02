
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { DonationItem } from "@/types/donation";

interface DonationPreviewSectionProps {
  items: DonationItem[];
}

const DonationPreviewSection = ({ items }: DonationPreviewSectionProps) => {
  return (
    <section className="py-12 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Популярные товары</h2>
          <p className="text-muted-foreground">Приобретите особые возможности и предметы</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => (
            <Card key={index} className="donation-item border-primary/20 overflow-hidden">
              <div className={`h-40 bg-gradient-to-br ${item.gradientColors} p-6 flex items-center justify-center`}>
                <div className="animate-float">
                  <img 
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-28 w-28 object-contain"
                  />
                </div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <div className="text-primary font-bold">{item.price} ₽</div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
                <Button className="w-full">Купить</Button>
              </CardContent>
            </Card>
          ))}
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
  );
};

export default DonationPreviewSection;
