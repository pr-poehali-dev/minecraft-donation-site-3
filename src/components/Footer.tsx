
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const Footer = () => {
  return (
    <footer className="bg-card text-card-foreground pt-12 pb-6">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-minecraft">M</span>
              </div>
              <span className="font-minecraft text-xl">CraftWorld</span>
            </Link>
            <p className="text-muted-foreground mb-4">
              Лучший майнкрафт сервер с уникальными мирами и возможностями.
              Присоединяйтесь к нашему комьюнити прямо сейчас!
            </p>
            <div className="flex gap-4">
              <a href="https://discord.gg" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="DiscordLogo" size={20} />
              </a>
              <a href="https://t.me" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="MessageCircle" size={20} />
              </a>
              <a href="https://vk.com" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Globe" size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Главная</Link></li>
              <li><Link to="/donate" className="text-muted-foreground hover:text-primary transition-colors">Донат</Link></li>
              <li><Link to="/monitoring" className="text-muted-foreground hover:text-primary transition-colors">Мониторинг</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">О сервере</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-lg mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Icon name="Mail" size={16} />
                <a href="mailto:info@craftworld.com" className="hover:text-primary transition-colors">info@craftworld.com</a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Icon name="MessageSquare" size={16} />
                <span>Discord: CraftWorld#1234</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 CraftWorld. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
