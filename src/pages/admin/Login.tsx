
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/admin/LoginForm";
import Icon from "@/components/ui/icon";
import { authenticateUser, isAuthenticated } from "@/utils/authUtils";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState("");
  
  useEffect(() => {
    // Если пользователь уже аутентифицирован, перенаправляем на страницу админки
    if (isAuthenticated()) {
      navigate("/admin");
    }
  }, [navigate]);
  
  const handleLogin = (values: { username: string; password: string }) => {
    const isValid = authenticateUser(values.username, values.password);
    
    if (isValid) {
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в панель администратора",
      });
      navigate("/admin");
    } else {
      setError("Неверное имя пользователя или пароль");
      toast({
        variant: "destructive",
        title: "Ошибка входа",
        description: "Неверное имя пользователя или пароль",
      });
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/10 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Blocks" className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 text-3xl font-bold">CraftWorld</h1>
          <p className="mt-1 text-muted-foreground">Административная панель</p>
        </div>
        
        <LoginForm onLogin={handleLogin} />
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}
        
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Для тестирования используйте:</p>
          <p>Логин: <strong>admin</strong> / Пароль: <strong>admin123</strong></p>
          <div className="pt-2">
            <a href="/" className="hover:text-primary">
              Вернуться на сайт
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
