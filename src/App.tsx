import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import DashboardProcesses from "./pages/dashboard/DashboardProcesses";
import DashboardDocuments from "./pages/dashboard/DashboardDocuments";
import DashboardClients from "./pages/dashboard/DashboardClients";
import DashboardAllProcesses from "./pages/dashboard/DashboardAllProcesses";
import DashboardAllDocuments from "./pages/dashboard/DashboardAllDocuments";
import DashboardContent from "./pages/dashboard/DashboardContent";
import DashboardSEO from "./pages/dashboard/DashboardSEO";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/processes" element={<DashboardProcesses />} />
            <Route path="/dashboard/documents" element={<DashboardDocuments />} />
            <Route path="/dashboard/clients" element={<DashboardClients />} />
            <Route path="/dashboard/all-processes" element={<DashboardAllProcesses />} />
            <Route path="/dashboard/all-documents" element={<DashboardAllDocuments />} />
            <Route path="/dashboard/content" element={<DashboardContent />} />
            <Route path="/dashboard/seo" element={<DashboardSEO />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
