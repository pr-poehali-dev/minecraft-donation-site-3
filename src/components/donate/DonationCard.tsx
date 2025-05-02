
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { DonateItem } from "@/types/donation";

interface DonationCardProps {
  item: DonateItem;
}

const DonationCard = ({ item }: DonationCardProps) => {
  return (
    <Card className="donation-item border-primary/20 overflow-hidden relative">
      {item.popular && (
        <Badge className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground">
          Популярное
        </Badge>
      )}
      {item.discount && (
        <Badge variant="destructive" className="absolute top-2 left-2 z-10">
          -{item.discount}%
        </Badge>
      )}
      <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 p-6 flex items-center justify-center">
        <div className="animate-float">
          <img 
            src={item.imageUrl}
            alt={item.name}
            className="h-36 w-36 object-contain"
          />
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <div className="flex items-center">
            {item.discount && (
              <span className="text-muted-foreground line-through mr-2 text-sm">
                {Math.round(item.price / (1 - item.discount / 100))} ₽
              </span>
            )}
            <span className="text-primary font-bold">{item.price} ₽</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
        <Button className="w-full">
          <Icon name="ShoppingCart" size={16} className="mr-2" />
          Купить
        </Button>
      </CardContent>
    </Card>
  );
};

export default DonationCard;
