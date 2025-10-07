import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { AdminUser } from "@/types/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import Icon from "@/components/ui/icon";

const AdminSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      toast({
        title: "Настройки сохранены",
        description: "Webhook настроен успешно"
      });
      setIsSaving(false);
    }, 1000);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Настройки</h1>
            <p className="text-muted-foreground">
              Конфигурация уведомлений и интеграций
            </p>
          </div>

          <div className="max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon name="Webhook" className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Webhook уведомления</CardTitle>
                    <CardDescription>
                      Получайте уведомления о покупках в Discord, Telegram или другой сервис
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="webhook-enabled">Включить уведомления</Label>
                    <p className="text-sm text-muted-foreground">
                      Отправлять webhook при каждой покупке
                    </p>
                  </div>
                  <Switch
                    id="webhook-enabled"
                    checked={isEnabled}
                    onCheckedChange={setIsEnabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    disabled={!isEnabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Укажите URL webhook для Discord, Telegram или другого сервиса
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Формат данных:</h4>
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
{`{
  "event": "purchase_delivered",
  "purchaseId": "purchase_1234567890",
  "productName": "VIP Статус",
  "playerNickname": "Steve",
  "serverId": "survival",
  "pricePaid": 199.0,
  "timestamp": 1696789012.345
}`}
                  </pre>
                </div>

                <Button 
                  onClick={handleSave} 
                  disabled={isSaving || (isEnabled && !webhookUrl)}
                  className="w-full"
                >
                  {isSaving ? (
                    <>
                      <Icon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Icon name="Save" className="w-4 h-4 mr-2" />
                      Сохранить настройки
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Icon name="MessageSquare" className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle>Пример для Discord</CardTitle>
                    <CardDescription>
                      Как создать webhook в Discord
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    1
                  </div>
                  <p className="text-sm">Откройте настройки сервера → Интеграции → Вебхуки</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    2
                  </div>
                  <p className="text-sm">Создайте новый webhook и выберите канал</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    3
                  </div>
                  <p className="text-sm">Скопируйте URL webhook и вставьте выше</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
