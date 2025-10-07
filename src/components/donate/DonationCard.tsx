import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/ui/icon";
import { DonateItem } from "@/types/donation";
import { useToast } from "@/hooks/use-toast";

interface DonationCardProps {
  item: DonateItem;
}

const PRODUCTS_API_URL = "https://functions.poehali.dev/6574f144-b26c-46e4-a4eb-76db7d5dca00";
const RCON_API_URL = "https://functions.poehali.dev/dc854b6c-4dfa-483e-99d1-e59bb8c5c574";

interface RconServer {
  id: string;
  name: string;
  address: string;
  is_active: boolean;
}

const DonationCard = ({ item }: DonationCardProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [playerNickname, setPlayerNickname] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [servers, setServers] = useState<RconServer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handleOpenDialog = async () => {
    setIsOpen(true);
    setIsLoading(true);
    
    try {
      const response = await fetch(RCON_API_URL);
      const data = await response.json();
      
      if (data.success && data.servers) {
        const activeServers = data.servers.filter((s: RconServer) => s.is_active);
        setServers(activeServers);
        
        const availableServers = activeServers.filter((s: RconServer) => 
          item.servers && item.servers.includes(s.id)
        );
        
        if (availableServers.length > 0) {
          setSelectedServer(availableServers[0].id);
        }
      }
    } catch (error) {
      console.error("Ошибка загрузки серверов:", error);
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить список серверов"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!playerNickname.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите ваш никнейм в игре"
      });
      return;
    }
    
    if (!selectedServer) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Выберите сервер для доставки"
      });
      return;
    }
    
    setIsPurchasing(true);
    
    try {
      const response = await fetch(PRODUCTS_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'purchase',
          productId: item.id,
          playerNickname: playerNickname.trim(),
          serverId: selectedServer
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Успешная покупка!",
          description: data.message || `Товар "${item.name}" успешно доставлен!`
        });
        setIsOpen(false);
        setPlayerNickname("");
      } else {
        throw new Error(data.error || "Ошибка покупки");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка покупки",
        description: error instanceof Error ? error.message : "Не удалось оформить покупку"
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const availableServers = servers.filter(s => 
    item.servers && item.servers.includes(s.id)
  );

  return (
    <>
      <Card className="donation-item border-primary/20 overflow-hidden relative">
        {item.popular && (
          <Badge className="absolute top-2 right-2 z-10 bg-primary text-primary-foreground">
            Популярное
          </Badge>
        )}
        {item.discount && item.discount > 0 && (
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
              {item.discount && item.discount > 0 && (
                <span className="text-muted-foreground line-through mr-2 text-sm">
                  {Math.round(item.price / (1 - item.discount / 100))} ₽
                </span>
              )}
              <span className="text-primary font-bold">{item.price} ₽</span>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mb-4">{item.description}</p>
          <Button className="w-full" onClick={handleOpenDialog}>
            <Icon name="ShoppingCart" size={16} className="mr-2" />
            Купить
          </Button>
        </CardContent>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Покупка: {item.name}</DialogTitle>
            <DialogDescription>
              Введите ваш никнейм и выберите сервер для доставки
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Ваш никнейм в игре</Label>
              <Input
                id="nickname"
                placeholder="Steve"
                value={playerNickname}
                onChange={(e) => setPlayerNickname(e.target.value)}
                disabled={isPurchasing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="server">Сервер для доставки</Label>
              {isLoading ? (
                <div className="flex items-center justify-center py-2">
                  <Icon name="Loader2" className="w-4 h-4 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Загрузка серверов...</span>
                </div>
              ) : availableServers.length > 0 ? (
                <Select value={selectedServer} onValueChange={setSelectedServer} disabled={isPurchasing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите сервер" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServers.map(server => (
                      <SelectItem key={server.id} value={server.id}>
                        {server.name} ({server.address})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-muted-foreground py-2">
                  Нет доступных серверов для этого товара
                </p>
              )}
            </div>
            
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center text-sm mb-2">
                <span>Цена:</span>
                <span className="font-semibold">{item.price} ₽</span>
              </div>
              {item.discount && item.discount > 0 && (
                <div className="flex justify-between items-center text-sm text-green-600">
                  <span>Скидка:</span>
                  <span>-{item.discount}%</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isPurchasing}>
              Отмена
            </Button>
            <Button 
              onClick={handlePurchase} 
              disabled={isPurchasing || !playerNickname.trim() || !selectedServer}
            >
              {isPurchasing ? (
                <>
                  <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                  Обработка...
                </>
              ) : (
                <>
                  <Icon name="ShoppingCart" size={16} className="mr-2" />
                  Купить за {item.price} ₽
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationCard;
