import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Icon from "@/components/ui/icon";
import useMobile from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useMobile();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b"
          : "bg-transparent",
      )}
    >
      <div className="container py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Icon name="Blocks" size={24} className="text-primary" />
          <span className="font-bold text-xl">CraftWorld</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/") ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Главная
          </Link>
          <Link
            to="/news"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/news") ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Новости
          </Link>
          <Link
            to="/donate"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/donate") ? "text-foreground" : "text-muted-foreground",
            )}
          >
            Донат
          </Link>
          <Link
            to="/about"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/about") ? "text-foreground" : "text-muted-foreground",
            )}
          >
            О нас
          </Link>
          <Link
            to="/admin/login"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive("/admin/login")
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            Админ-панель
          </Link>
        </div>

        {/* Connect Button */}
        <div className="flex items-center gap-4">
          <Button variant="default" className="hidden md:flex">
            Играть сейчас
          </Button>

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Icon name="Menu" className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 pt-6">
                  <Link
                    to="/"
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary",
                      isActive("/")
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon name="Home" size={20} />
                    Главная
                  </Link>
                  <Link
                    to="/monitoring"
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary",
                      isActive("/monitoring")
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon name="Activity" size={20} />
                    Мониторинг
                  </Link>
                  <Link
                    to="/donate"
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary",
                      isActive("/donate")
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon name="Gift" size={20} />
                    Донат
                  </Link>
                  <Link
                    to="/about"
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary",
                      isActive("/about")
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon name="Info" size={20} />О нас
                  </Link>
                  <Link
                    to="/admin/login"
                    className={cn(
                      "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary",
                      isActive("/admin/login")
                        ? "text-foreground"
                        : "text-muted-foreground",
                    )}
                  >
                    <Icon name="ShieldCheck" size={20} />
                    Админ-панель
                  </Link>
                  <Button className="mt-4">Играть сейчас</Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
