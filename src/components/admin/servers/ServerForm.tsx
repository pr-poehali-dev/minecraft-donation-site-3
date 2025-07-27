
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Server } from "@/types/server";
import Icon from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SERVERS_STORAGE_KEY = "craft_world_servers";

interface ServerFormProps {
  server?: Server;
  onSave: (server: Server) => void;
  onCancel: () => void;
}

const ServerForm = ({ server, onSave, onCancel }: ServerFormProps) => {
  const { toast } = useToast();
  const isEditing = !!server;
  
  const [formData, setFormData] = useState<Server>({
    id: server?.id || Date.now(),
    name: server?.name || "",
    address: server?.address || "",
    version: server?.version || "1.19.2",
    status: server?.status || "offline",
    players: server?.players || { online: 0, max: 100 },
    tps: server?.tps || 20.0,
    uptime: server?.uptime || 0,
    // RCON настройки
    rconEnabled: server?.rconEnabled || false,
    rconPort: server?.rconPort || 25575,
    rconPassword: server?.rconPassword || "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка валидации",
        description: "Заполните все обязательные поля.",
      });
      return;
    }
    
    try {
      const serverToSave = {
        ...formData,
        status: "offline" as const,
        players: {
          online: 0,
          max: formData.players.max
        }
      };
      
      onSave(serverToSave);
      toast({
        title: isEditing ? "Сервер обновлен" : "Сервер добавлен",
        description: `${formData.name} был успешно ${isEditing ? "обновлен" : "добавлен"}.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка сохранения",
        description: "Не удалось сохранить сервер. Попробуйте еще раз.",
      });
    }
  };

  // Функция для тестирования RCON-соединения
  const testRconConnection = () => {
    // В реальном приложении здесь был бы запрос к API
    toast({
      title: "Тестирование RCON",
      description: "Эта функция доступна только на рабочем сервере.",
    });
  };

  // Функция для тестирования подключения к серверу
  const testServerConnection = () => {
    if (!formData.address.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите адрес сервера для тестирования.",
      });
      return;
    }

    toast({
      title: "Тестирование подключения",
      description: "Пингуем сервер... (Эта функция доступна только на рабочем сервере)",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{isEditing ? `Редактирование: ${server.name}` : "Добавить новый сервер"}</CardTitle>
        </CardHeader>
        <Tabs defaultValue="general">
          <TabsList className="mx-6 mb-4">
            <TabsTrigger value="general">Основные настройки</TabsTrigger>
            <TabsTrigger value="rcon">RCON настройки</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Название сервера</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Выживание"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">IP-адрес сервера</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="mc.example.com"
                      className="flex-1"
                      required
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={testServerConnection}
                      disabled={!formData.address.trim()}
                    >
                      <Icon name="Wifi" className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="version">Версия</Label>
                  <Input
                    id="version"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    placeholder="1.19.2"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxPlayers">Максимальное количество игроков</Label>
                  <Input
                    id="maxPlayers"
                    name="maxPlayers"
                    type="number"
                    min="1"
                    max="1000"
                    value={formData.players.max}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      players: {
                        ...prev.players,
                        max: Math.max(1, parseInt(e.target.value) || 100)
                      }
                    }))}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Максимальное количество одновременно подключенных игроков
                  </p>
                </div>
              </div>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="rcon">
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox
                  id="rconEnabled"
                  checked={formData.rconEnabled}
                  onCheckedChange={(checked) => handleCheckboxChange("rconEnabled", !!checked)}
                />
                <label
                  htmlFor="rconEnabled"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Включить RCON для автоматической выдачи товаров
                </label>
              </div>
              
              {formData.rconEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rconPort">RCON порт</Label>
                    <Input
                      id="rconPort"
                      name="rconPort"
                      type="number"
                      value={formData.rconPort}
                      onChange={handleNumberChange}
                      placeholder="25575"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      По умолчанию: 25575
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rconPassword">Пароль RCON</Label>
                    <Input
                      id="rconPassword"
                      name="rconPassword"
                      type="password"
                      value={formData.rconPassword}
                      onChange={handleChange}
                      placeholder="Защищенный пароль"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Храните этот пароль в безопасности!
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={testRconConnection}
                      disabled={!formData.rconEnabled || !formData.rconPassword}
                    >
                      <Icon name="Zap" className="w-4 h-4 mr-2" />
                      Проверить подключение
                    </Button>
                  </div>
                  
                  <div className="md:col-span-2 p-4 border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 rounded-md">
                    <div className="flex items-start">
                      <Icon name="AlertTriangle" className="w-5 h-5 text-amber-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">Важная информация</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-500 mt-1">
                          Для работы RCON необходимо:
                        </p>
                        <ul className="text-xs text-amber-700 dark:text-amber-500 list-disc list-inside ml-2 mt-1">
                          <li>Включить RCON в server.properties (enable-rcon=true)</li>
                          <li>Указать тот же пароль в server.properties (rcon.password)</li>
                          <li>Указать тот же порт в server.properties (rcon.port)</li>
                          <li>Перезапустить сервер после изменений</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">
            <Icon name="Save" className="w-4 h-4 mr-2" />
            {isEditing ? "Сохранить изменения" : "Добавить сервер"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ServerForm;