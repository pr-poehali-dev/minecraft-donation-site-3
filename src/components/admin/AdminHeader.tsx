
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Icon from "@/components/ui/icon";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminUser } from "@/types/admin";

interface AdminHeaderProps {
  user: AdminUser;
  onLogout: () => void;
}

const AdminHeader = ({ user, onLogout }: AdminHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="md:hidden">
                <Icon name="Menu" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="py-4">
                <h2 className="text-xl font-bold">CraftWorld</h2>
                <p className="text-sm text-muted-foreground">Админ-панель</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start">
                  <Icon name="LayoutDashboard" className="mr-2" />
                  Обзор
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Icon name="Gift" className="mr-2" />
                  Донат услуги
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Icon name="Server" className="mr-2" />
                  Сервера
                </Button>
                <Button variant="ghost" className="justify-start">
                  <Icon name="Settings" className="mr-2" />
                  Настройки
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2">
            <Icon name="Blocks" size={24} className="text-primary" />
            <span className="font-bold">CraftWorld</span>
            <span className="hidden text-sm text-muted-foreground md:inline-block">
              Админ-панель
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Icon name="Bell" />
          </Button>
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-muted-foreground">{user.role === 'admin' ? 'Администратор' : 'Модератор'}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onLogout}>
              <Icon name="LogOut" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
