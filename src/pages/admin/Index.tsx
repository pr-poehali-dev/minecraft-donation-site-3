
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Dashboard from "@/components/admin/Dashboard";
import { AdminUser } from "@/types/admin";
import { useNavigate } from "react-router-dom";

const AdminIndex = () => {
  const navigate = useNavigate();
  const [user] = useState<AdminUser>({
    id: "1",
    username: "admin",
    email: "admin@craftworld.ru",
    role: "admin",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=admin",
  });

  const handleLogout = () => {
    // В будущем добавим логику выхода с сервера
    navigate("/admin/login");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <AdminHeader user={user} onLogout={handleLogout} />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-6">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default AdminIndex;
