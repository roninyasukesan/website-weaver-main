import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import {
  LayoutDashboard,
  FileText,
  Upload,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  Search,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAdmin, isApproved, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const clientNavItems = [
    { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
    { href: '/dashboard/processes', label: 'Meus Processos', icon: FileText },
    { href: '/dashboard/documents', label: 'Documentos', icon: Upload },
    { href: '/dashboard/templates', label: 'Gerar Documentos', icon: FileText },
  ];

  const adminNavItems = [
    { href: '/dashboard', label: 'Painel', icon: LayoutDashboard },
    { href: '/dashboard/clients', label: 'Clientes', icon: Users },
    { href: '/dashboard/all-processes', label: 'Processos', icon: FileText },
    { href: '/dashboard/all-documents', label: 'Documentos', icon: Upload },
    { href: '/dashboard/content', label: 'Conteúdo', icon: Globe },
    { href: '/dashboard/seo', label: 'SEO', icon: Search },
  ];

  const navItems = isAdmin ? adminNavItems : clientNavItems;

  return (
    <div className="min-h-screen bg-secondary">
      {/* Mobile header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b">
        <Link to="/">
          <Logo />
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex flex-col h-full">
            <div className="hidden lg:flex items-center justify-center p-6 border-b">
              <Link to="/">
                <Logo />
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto mt-16 lg:mt-0">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t space-y-2">
              <div className="px-4 py-2 text-sm text-muted-foreground truncate">
                {user?.email}
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-destructive hover:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="h-5 w-5" />
                Sair
              </Button>
            </div>
          </div>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 lg:p-8 min-h-screen">
          {!isAdmin && !isApproved && (
            <Alert className="mb-6 border-yellow-500 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Sua conta está aguardando aprovação do administrador. Algumas funcionalidades podem estar limitadas.
              </AlertDescription>
            </Alert>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
