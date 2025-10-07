
import { Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DonateItem } from "@/types/donation";
import Icon from "@/components/ui/icon";
import { FormField, FormSection } from "./components/FormSection";
import { useProductForm } from "./hooks/useProductForm";

interface ProductFormProps {
  product?: DonateItem;
  onSave: (product: DonateItem) => void;
  onCancel: () => void;
}

/**
 * Форма редактирования/создания товара
 */
const ProductForm = ({ product, onSave, onCancel }: ProductFormProps) => {
  const {
    formData,
    categories,
    servers,
    selectedServers,
    isEditing,
    handleChange,
    handleNumberChange,
    handleCheckboxChange,
    handleCategoryChange,
    handleServerToggle,
    handleSubmit
  } = useProductForm(product, onSave, onCancel);
  
  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            {isEditing 
              ? `Редактирование: ${product.name}` 
              : "Добавить новый товар"
            }
          </CardTitle>
        </CardHeader>
        
        <Tabs defaultValue="general">
          <TabsList className="mx-6 mb-4">
            <TabsTrigger value="general">Основное</TabsTrigger>
            <TabsTrigger value="delivery">Доставка</TabsTrigger>
            <TabsTrigger value="settings">Настройки</TabsTrigger>
          </TabsList>
          
          {/* Вкладка с основной информацией */}
          <TabsContent value="general">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Название товара" htmlFor="name">
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="VIP привилегия"
                    required
                  />
                </FormField>
                
                <FormField label="Цена (руб.)" htmlFor="price">
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleNumberChange}
                    required
                  />
                </FormField>
                
                <FormField label="Скидка (%)" htmlFor="discount">
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleNumberChange}
                  />
                </FormField>
                
                <FormField label="Категория" htmlFor="category">
                  <Select 
                    value={formData.category} 
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                
                <FormField 
                  label="Описание" 
                  htmlFor="description" 
                  className="md:col-span-2"
                >
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Описание привилегии или предмета"
                    rows={3}
                  />
                </FormField>
                
                <FormField 
                  label="URL изображения" 
                  htmlFor="imageUrl" 
                  className="md:col-span-2"
                >
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </FormField>
              </div>
            </CardContent>
          </TabsContent>
          
          {/* Вкладка с настройками доставки */}
          <TabsContent value="delivery">
            <CardContent className="space-y-6">
              <FormField 
                label="Шаблон команды выдачи" 
                htmlFor="commandTemplate"
                description="Используйте {player} для подстановки никнейма"
              >
                <Input
                  id="commandTemplate"
                  name="commandTemplate"
                  value={formData.commandTemplate}
                  onChange={handleChange}
                  placeholder="pex user {player} group set vip"
                />
              </FormField>
              
              <FormSection title="Доступно на серверах (RCON)">
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                  <div className="flex gap-2">
                    <Icon name="Info" className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-900 dark:text-blue-100">
                      <p className="font-medium mb-1">Как работает доставка:</p>
                      <p>Игрок выбирает сервер при покупке → Команда автоматически выполняется на выбранном RCON сервере → Товар моментально доставляется</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                  {servers.map((server) => (
                    <div 
                      key={server.id} 
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-all ${
                        selectedServers.includes(server.id) 
                          ? 'bg-primary/5 border-primary' 
                          : 'bg-muted/30 border-border hover:border-primary/50'
                      }`}
                    >
                      <Checkbox
                        id={`server-${server.id}`}
                        checked={selectedServers.includes(server.id)}
                        onCheckedChange={() => handleServerToggle(server.id)}
                      />
                      <label
                        htmlFor={`server-${server.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-medium text-sm">{server.name}</div>
                        <div className="text-xs text-muted-foreground">{server.address || 'RCON сервер'}</div>
                      </label>
                      {selectedServers.includes(server.id) && (
                        <Icon name="CheckCircle2" className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
                {servers.length === 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
                    <Icon name="AlertTriangle" className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                      Нет активных RCON серверов
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300">
                      Добавьте RCON серверы в разделе "RCON Серверы" для автоматической доставки товаров
                    </p>
                  </div>
                )}
                {servers.length > 0 && selectedServers.length === 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mt-3">
                    <div className="flex gap-2">
                      <Icon name="AlertCircle" className="w-4 h-4 text-amber-600 mt-0.5" />
                      <p className="text-xs text-amber-900 dark:text-amber-100">
                        Выберите хотя бы один сервер, иначе игроки не смогут купить этот товар
                      </p>
                    </div>
                  </div>
                )}
              </FormSection>
            </CardContent>
          </TabsContent>
          
          {/* Вкладка с дополнительными настройками */}
          <TabsContent value="settings">
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="popular"
                  checked={formData.popular}
                  onCheckedChange={(checked) => handleCheckboxChange("popular", !!checked)}
                />
                <label
                  htmlFor="popular"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Отметить как популярный товар
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => handleCheckboxChange("inStock", !!checked)}
                />
                <label
                  htmlFor="inStock"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Доступен для покупки
                </label>
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
        
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">
            <Icon name="Save" className="w-4 h-4 mr-2" />
            {isEditing ? "Сохранить изменения" : "Добавить товар"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProductForm;