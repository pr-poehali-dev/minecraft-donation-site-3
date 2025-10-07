
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  {servers.map((server) => (
                    <div key={server.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`server-${server.id}`}
                        checked={selectedServers.includes(server.id)}
                        onCheckedChange={() => handleServerToggle(server.id)}
                      />
                      <label
                        htmlFor={`server-${server.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {server.name} {server.address && `(${server.address})`}
                      </label>
                    </div>
                  ))}
                </div>
                {servers.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Нет доступных RCON серверов. Добавьте их в разделе "RCON Серверы".
                  </p>
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