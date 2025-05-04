
import { useState } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Dashboard from "@/components/admin/Dashboard";
import { AdminUser } from "@/types/admin";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "@/utils/authUtils";
import { useEffect } from "react";

const AdminIndex = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const userData = getCurrentUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate("/admin/login");
  };

  if (!user) {
    return null;
  }

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
