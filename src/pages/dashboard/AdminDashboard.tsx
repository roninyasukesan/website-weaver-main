import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Clock, CheckCircle } from 'lucide-react';

interface Stats {
  totalClients: number;
  pendingApprovals: number;
  totalProcesses: number;
  activeProcesses: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    pendingApprovals: 0,
    totalProcesses: 0,
    activeProcesses: 0,
  });
  const [recentClients, setRecentClients] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentClients();
  }, []);

  const fetchStats = async () => {
    const { data: profiles } = await supabase.from('profiles').select('approval_status');
    const { data: processes } = await supabase.from('processes').select('status');

    if (profiles && processes) {
      setStats({
        totalClients: profiles.length,
        pendingApprovals: profiles.filter(p => p.approval_status === 'pending').length,
        totalProcesses: processes.length,
        activeProcesses: processes.filter(p => p.status === 'in_progress').length,
      });
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

  const approvalLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-100' },
    approved: { label: 'Aprovado', color: 'text-green-600 bg-green-100' },
    rejected: { label: 'Rejeitado', color: 'text-red-600 bg-red-100' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie clientes, processos e conteúdo do site
        </p>
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
            <Clock className="h-4 w-4 text-muted-foreground" />
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
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeProcesses}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Clientes Recentes</CardTitle>
          <CardDescription>Últimos cadastros no sistema</CardDescription>
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
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{client.full_name || 'Sem nome'}</h4>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      approvalLabels[client.approval_status]?.color || ''
                    }`}
                  >
                    {approvalLabels[client.approval_status]?.label || client.approval_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
