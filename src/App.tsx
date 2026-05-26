import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import React from "react";
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
import DashboardTemplates from "./pages/dashboard/DashboardTemplates";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: unknown }
> {
  state: { error: unknown } = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error };
  }

  render() {
    if (this.state.error) {
      const message =
        this.state.error instanceof Error ? this.state.error.message : String(this.state.error);

      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
          <div className="max-w-2xl w-full space-y-3">
            <div className="text-lg font-semibold">Erro ao carregar a aplicação</div>
            <div className="text-sm text-muted-foreground">
              Se isso aconteceu após uma alteração recente, recarregue a página com Ctrl+F5.
            </div>
            <pre className="text-xs whitespace-pre-wrap rounded-md border bg-muted p-3 overflow-auto">
              {message}
            </pre>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <AppErrorBoundary>
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
              <Route path="/dashboard/templates" element={<DashboardTemplates />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AppErrorBoundary>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
