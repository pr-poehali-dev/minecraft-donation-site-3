
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/utils/authUtils";

interface AuthGuardProps {
  children: ReactNode;
}

const AuthGuard = ({ children }: AuthGuardProps) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [navigate]);
  
  // Если пользователь не аутентифицирован, ничего не рендерим
  // useEffect позаботится о перенаправлении
  if (!isAuthenticated()) {
    return null;
  }
  
  return <>{children}</>;
};

export default AuthGuard;
