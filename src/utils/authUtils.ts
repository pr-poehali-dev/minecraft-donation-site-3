
// Утилиты для работы с авторизацией администратора
import { AdminUser } from "@/types/admin";

// Захардкоженные учетные данные администратора 
// В реальном проекте нужно использовать безопасные методы аутентификации
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// Ключ для хранения статуса аутентификации в localStorage
const AUTH_KEY = "craft_world_admin_auth";

export const authenticateUser = (username: string, password: string): boolean => {
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const user: AdminUser = {
      id: "1",
      username: ADMIN_USERNAME,
      email: "admin@craftworld.ru",
      role: "admin",
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
    };
    
    // Сохраняем информацию о пользователе в localStorage
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      authenticated: true,
      user,
      timestamp: Date.now()
    }));
    
    return true;
  }
  
  return false;
};

export const isAuthenticated = (): boolean => {
  const authData = localStorage.getItem(AUTH_KEY);
  
  if (!authData) {
    return false;
  }
  
  try {
    const parsedData = JSON.parse(authData);
    // Проверяем срок действия аутентификации (например, 4 часа)
    const expirationTime = 4 * 60 * 60 * 1000; // 4 часа в миллисекундах
    const isExpired = Date.now() - parsedData.timestamp > expirationTime;
    
    return parsedData.authenticated && !isExpired;
  } catch (error) {
    return false;
  }
};

export const getCurrentUser = (): AdminUser | null => {
  const authData = localStorage.getItem(AUTH_KEY);
  
  if (!authData) {
    return null;
  }
  
  try {
    const parsedData = JSON.parse(authData);
    return parsedData.user;
  } catch (error) {
    return null;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem(AUTH_KEY);
};
