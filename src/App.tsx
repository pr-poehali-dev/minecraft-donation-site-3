
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
          <Route path="/admin" element={<AdminIndex />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          <Route path="/admin/servers" element={<AdminServers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
