
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/admin/LoginForm";
import Icon from "@/components/ui/icon";

const AdminLogin = () => {
  const navigate = useNavigate();
  
  const handleLogin = (values: { username: string; password: string }) => {
    // В будущем здесь будет реальная авторизация с бэкендом
    console.log("Логин с данными:", values);
    navigate("/admin");
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
        
        <div className="text-center text-sm text-muted-foreground">
          <a href="/" className="hover:text-primary">
            Вернуться на сайт
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
