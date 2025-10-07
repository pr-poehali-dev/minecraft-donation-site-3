import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

interface NavItem {
  title: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    title: "Дашборд",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  {
    title: "Товары",
    href: "/admin/products",
    icon: "Package",
  },
  {
    title: "История покупок",
    href: "/admin/purchases",
    icon: "ShoppingBag",
  },
  {
    title: "Пожертвования",
    href: "/admin/donations",
    icon: "Gift",
  },
  {
    title: "Мониторинг серверов",
    href: "/admin/monitoring-servers",
    icon: "Activity",
  },
  {
    title: "RCON серверы",
    href: "/admin/rcon-servers",
    icon: "Server",
  },
  {
    title: "Новости",
    href: "/admin/news",
    icon: "Newspaper",
  },
  {
    title: "Настройки",
    href: "/admin/settings",
    icon: "Settings",
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div
      className={`border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-full ${
        isCollapsed ? "w-16" : "w-64"
      } transition-all duration-200 ease-in-out`}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center justify-between border-b px-4">
          {!isCollapsed && <span className="font-semibold">Меню админа</span>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={isCollapsed ? "mx-auto" : ""}
          >
            <Icon
              name={isCollapsed ? "PanelRightOpen" : "PanelLeftClose"}
              className="h-4 w-4"
            />
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 px-2 py-4">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={`w-full justify-start ${isCollapsed ? "h-10 w-10 p-0 justify-center" : ""}`}
                >
                  <Icon
                    name={item.icon}
                    className={`h-4 w-4 ${!isCollapsed ? "mr-2" : ""}`}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Button>
              </Link>
            ))}
          </nav>
          <Separator className="my-2" />
          <div className="px-2 py-4">
            <Link to="/">
              <Button
                variant="ghost"
                className={`w-full justify-start ${isCollapsed ? "h-10 w-10 p-0 justify-center" : ""}`}
              >
                <Icon
                  name="ExternalLink"
                  className={`h-4 w-4 ${!isCollapsed ? "mr-2" : ""}`}
                />
                {!isCollapsed && <span>Вернуться на сайт</span>}
              </Button>
            </Link>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default AdminSidebar;