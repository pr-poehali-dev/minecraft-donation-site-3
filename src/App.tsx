import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import About from "./pages/About";
import Donate from "./pages/Donate";
import Monitoring from "./pages/Monitoring";
import AdminIndex from "./pages/admin/Index";
import AdminLogin from "./pages/admin/Login";
import AdminDonations from "./pages/admin/Donations";
import AdminServers from "./pages/admin/Servers";
import AdminProducts from "./pages/admin/Products";
import AdminPurchases from "./pages/admin/Purchases";
import AdminSettings from "./pages/admin/Settings";
import AdminNews from "./pages/admin/News";
import AdminMonitoringServers from "./pages/admin/MonitoringServers";
import AdminRconServers from "./pages/admin/RconServers";
import News from "./pages/News";
import AuthGuard from "./components/admin/AuthGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AuthGuard>
                <AdminIndex />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/donations"
            element={
              <AuthGuard>
                <AdminDonations />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/servers"
            element={
              <AuthGuard>
                <AdminServers />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/monitoring-servers"
            element={
              <AuthGuard>
                <AdminMonitoringServers />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/rcon-servers"
            element={
              <AuthGuard>
                <AdminRconServers />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AuthGuard>
                <AdminProducts />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/purchases"
            element={
              <AuthGuard>
                <AdminPurchases />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AuthGuard>
                <AdminSettings />
              </AuthGuard>
            }
          />
          <Route
            path="/admin/news"
            element={
              <AuthGuard>
                <AdminNews />
              </AuthGuard>
            }
          />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<News />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;