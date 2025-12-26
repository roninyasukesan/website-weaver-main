import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, Upload } from 'lucide-react';

interface Stats {
  totalProcesses: number;
  pendingProcesses: number;
  completedProcesses: number;
  totalDocuments: number;
}

export function ClientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalProcesses: 0,
    pendingProcesses: 0,
    completedProcesses: 0,
    totalDocuments: 0,
  });
  const [recentProcesses, setRecentProcesses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchRecentProcesses();
    }
  }, [user]);

  const fetchStats = async () => {
    const { data: processes } = await supabase
      .from('processes')
      .select('status')
      .eq('client_id', user?.id);

    const { data: documents } = await supabase
      .from('documents')
      .select('id')
      .eq('client_id', user?.id);

    if (processes) {
      setStats({
        totalProcesses: processes.length,
        pendingProcesses: processes.filter(p => p.status === 'pending' || p.status === 'in_progress').length,
        completedProcesses: processes.filter(p => p.status === 'completed').length,
        totalDocuments: documents?.length || 0,
      });
    }
  };

  const fetchRecentProcesses = async () => {
    const { data } = await supabase
      .from('processes')
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (data) {
      setRecentProcesses(data);
    }
  };

  const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-100' },
    in_progress: { label: 'Em Andamento', color: 'text-blue-600 bg-blue-100' },
    completed: { label: 'Concluído', color: 'text-green-600 bg-green-100' },
    cancelled: { label: 'Cancelado', color: 'text-red-600 bg-red-100' },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Olá, {user?.user_metadata?.full_name || 'Cliente'}!</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe seus processos e documentos
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingProcesses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProcesses}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Documentos</CardTitle>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocuments}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processos Recentes</CardTitle>
          <CardDescription>Últimos processos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          {recentProcesses.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum processo encontrado
            </p>
          ) : (
            <div className="space-y-4">
              {recentProcesses.map((process) => (
                <div
                  key={process.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{process.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {process.case_number || 'Sem número'}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusLabels[process.status]?.color || ''
                    }`}
                  >
                    {statusLabels[process.status]?.label || process.status}
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
