import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Upload, Globe, Search, Settings, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface Stats {
  totalClients: number;
  pendingApprovals: number;
  totalProcesses: number;
  activeProcesses: number;
  totalDocuments: number;
  pendingDocuments: number;
}

interface RecentClient {
  id: string;
  full_name: string;
  email: string;
  approval_status: string;
  created_at: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    pendingApprovals: 0,
    totalProcesses: 0,
    activeProcesses: 0,
    totalDocuments: 0,
    pendingDocuments: 0,
  });
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentClients();
  }, []);

  const fetchStats = async () => {
    const [{ data: profiles }, { data: processes }, { data: documents }] = await Promise.all([
      supabase.from('profiles').select('approval_status'),
      supabase.from('processes').select('status'),
      supabase.from('documents').select('status'),
    ]);

    if (profiles) {
      setStats(prev => ({
        ...prev,
        totalClients: profiles.length,
        pendingApprovals: profiles.filter(p => p.approval_status === 'pending').length,
      }));
    }
    if (processes) {
      setStats(prev => ({
        ...prev,
        totalProcesses: processes.length,
        activeProcesses: processes.filter(p => p.status === 'in_progress').length,
      }));
    }
    if (documents) {
      setStats(prev => ({
        ...prev,
        totalDocuments: documents.length,
        pendingDocuments: documents.filter(d => d.status === 'pending').length,
      }));
    }
  };

  const fetchRecentClients = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentClients(data);
    }
  };

  const adminActions = [
    { label: 'Clientes', desc: 'Gerenciar clientes e aprovações', icon: Users, href: '/dashboard/clients', color: 'bg-blue-500' },
    { label: 'Processos', desc: 'Ver todos os processos', icon: FileText, href: '/dashboard/all-processes', color: 'bg-green-500' },
    { label: 'Documentos', desc: 'Gerenciar documentos', icon: Upload, href: '/dashboard/all-documents', color: 'bg-purple-500' },
    { label: 'Conteúdo', desc: 'Editar páginas e blog', icon: Globe, href: '/dashboard/content', color: 'bg-orange-500' },
    { label: 'SEO', desc: 'Configurar SEO do site', icon: Search, href: '/dashboard/seo', color: 'bg-pink-500' },
    { label: 'Templates', desc: 'Gerar documentos com IA', icon: FileText, href: '/dashboard/templates', color: 'bg-indigo-500' },
  ];

  const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
    pending: { label: 'Pendente', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    approved: { label: 'Aprovado', color: 'text-green-600', bgColor: 'bg-green-100' },
    rejected: { label: 'Rejeitado', color: 'text-red-600', bgColor: 'bg-red-100' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie clientes, processos e conteúdo do escritório
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Aprovações Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingApprovals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Processos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProcesses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeProcesses}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {adminActions.map((action) => (
          <Card
            key={action.href}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(action.href)}
          >
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <div className={`${action.color} p-2 rounded-lg`}>
                <action.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base">{action.label}</CardTitle>
                <CardDescription className="text-xs">{action.desc}</CardDescription>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto" />
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Clientes Recentes</CardTitle>
              <CardDescription>Últimos cadastros no sistema</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/clients')}>
              Ver Todos
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentClients.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum cliente encontrado
            </p>
          ) : (
            <div className="space-y-4">
              {recentClients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary font-medium rounded-full h-10 w-10 flex items-center justify-center text-sm">
                      {client.full_name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <h4 className="font-medium">{client.full_name || 'Sem nome'}</h4>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[client.approval_status]?.bgColor} ${statusConfig[client.approval_status]?.color}`}
                  >
                    {statusConfig[client.approval_status]?.label || client.approval_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {stats.pendingApprovals > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-yellow-800">
              <XCircle className="h-5 w-5" />
              Ações Necessárias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-3">
              Existem <strong>{stats.pendingApprovals} aprovação(ões)</strong> pendente(s) de clientes aguardando análise.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              onClick={() => navigate('/dashboard/clients')}
            >
              Revisar Clientes Pendentes
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
