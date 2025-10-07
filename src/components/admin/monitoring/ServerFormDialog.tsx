import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ServerMonitoring } from "@/types/admin";

interface ServerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentServer: ServerMonitoring | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const ServerFormDialog = ({
  open,
  onOpenChange,
  currentServer,
  onSubmit,
}: ServerFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentServer ? "Редактировать сервер" : "Добавить сервер"}
          </DialogTitle>
          <DialogDescription>
            {currentServer 
              ? "Измените параметры сервера для мониторинга"
              : "Добавьте новый сервер для мониторинга статистики"
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentServer?.name}
                placeholder="Основной сервер"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Версия</Label>
              <Input
                id="version"
                name="version"
                defaultValue={currentServer?.version}
                placeholder="1.20.1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Адрес *</Label>
              <Input
                id="address"
                name="address"
                defaultValue={currentServer?.address}
                placeholder="play.example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port">Порт</Label>
              <Input
                id="port"
                name="port"
                type="number"
                defaultValue={currentServer?.port || 25565}
                placeholder="25565"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Максимум игроков</Label>
            <Input
              id="maxPlayers"
              name="maxPlayers"
              type="number"
              defaultValue={currentServer?.maxPlayers || 100}
              placeholder="100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={currentServer?.description}
              placeholder="Дополнительное описание сервера"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              name="isActive"
              defaultChecked={currentServer?.isActive ?? true}
            />
            <Label htmlFor="isActive">Активен</Label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">
              {currentServer ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServerFormDialog;