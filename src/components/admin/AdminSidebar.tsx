
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Link, useLocation } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
}

const SidebarLink = ({ to, icon, label }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link to={to}>
      <Button 
        variant={isActive ? "secondary" : "ghost"} 
        className={cn("w-full justify-start", 
          isActive && "bg-secondary text-secondary-foreground"
        )}
      >
        <Icon name={icon} className="mr-2" />
        {label}
      </Button>
    </Link>
  );
};

const AdminSidebar = () => {
  return (
    <aside className="hidden border-r bg-card md:block md:w-64 lg:w-72">
      <div className="flex h-full flex-col gap-2 p-4">
        <div className="py-4">
          <h2 className="text-xl font-bold">CraftWorld</h2>
          <p className="text-sm text-muted-foreground">Админ-панель</p>
        </div>
        <div className="space-y-1">
          <SidebarLink to="/admin" icon="LayoutDashboard" label="Обзор" />
          <SidebarLink to="/admin/donations" icon="Gift" label="Донат услуги" />
          <SidebarLink to="/admin/servers" icon="Server" label="Сервера" />
          <SidebarLink to="/admin/settings" icon="Settings" label="Настройки" />
        </div>
        <div className="mt-auto">
          <Button variant="outline" className="w-full">
            <Icon name="HelpCircle" className="mr-2" />
            Помощь
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
