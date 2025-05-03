
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ServerMonitoring } from "@/types/admin";

const serverSchema = z.object({
  name: z.string().min(3, "Название должно содержать минимум 3 символа"),
  address: z.string().min(3, "Адрес должен содержать минимум 3 символа"),
  version: z.string().min(1, "Версия не может быть пустой"),
  maxPlayers: z.coerce.number().int().min(1, "Количество должно быть больше 0"),
  isActive: z.boolean().default(true),
});

type ServerFormValues = z.infer<typeof serverSchema>;

interface ServerFormProps {
  initialData?: ServerMonitoring;
  onSubmit: (values: ServerFormValues) => void;
  onCancel: () => void;
}

const ServerForm = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}: ServerFormProps) => {
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      address: initialData.address,
      version: initialData.version,
      maxPlayers: initialData.maxPlayers,
      isActive: initialData.isActive,
    } : {
      name: "",
      address: "",
      version: "1.20.4",
      maxPlayers: 100,
      isActive: true,
    },
  });

  const handleSubmit = (values: ServerFormValues) => {
    onSubmit(values);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{initialData ? "Редактирование сервера" : "Новый сервер"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название сервера</FormLabel>
                  <FormControl>
                    <Input placeholder="CraftWorld Выживание" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес сервера</FormLabel>
                  <FormControl>
                    <Input placeholder="survival.craftworld.ru" {...field} />
                  </FormControl>
                  <FormDescription>
                    IP-адрес или домен сервера
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Версия Minecraft</FormLabel>
                    <FormControl>
                      <Input placeholder="1.20.4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Максимум игроков</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} step={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Активность</FormLabel>
                    <FormDescription>
                      Отображать сервер в мониторинге
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit">
              {initialData ? "Сохранить" : "Создать"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ServerForm;
