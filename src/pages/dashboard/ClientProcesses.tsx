import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Process {
  id: string;
  title: string;
  description: string | null;
  case_number: string | null;
  category: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function ClientProcesses() {
  const { user } = useAuth();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProcesses();
    }
  }, [user]);

  const fetchProcesses = async () => {
    const { data, error } = await supabase
      .from('processes')
      .select('*')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false });

    if (data) {
      setProcesses(data);
    }
    setLoading(false);
  };

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendente', variant: 'secondary' },
    in_progress: { label: 'Em Andamento', variant: 'default' },
    completed: { label: 'Concluído', variant: 'outline' },
    cancelled: { label: 'Cancelado', variant: 'destructive' },
  };

  const categoryLabels: Record<string, string> = {
    previdenciario: 'Previdenciário',
    aereo: 'Direito Aéreo',
    outros: 'Outros',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meus Processos</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe o andamento dos seus processos jurídicos
        </p>
      </div>

      {processes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Nenhum processo encontrado</h3>
            <p className="text-muted-foreground text-center mt-2">
              Você ainda não possui processos cadastrados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {processes.map((process) => (
            <Card key={process.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{process.title}</CardTitle>
                    <CardDescription>
                      {process.case_number && `Nº ${process.case_number} • `}
                      {categoryLabels[process.category] || process.category}
                    </CardDescription>
                  </div>
                  <Badge variant={statusLabels[process.status]?.variant || 'secondary'}>
                    {statusLabels[process.status]?.label || process.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {process.description && (
                  <p className="text-muted-foreground mb-4">{process.description}</p>
                )}
                {process.notes && (
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <h4 className="font-medium mb-2">Observações do Advogado</h4>
                    <p className="text-sm text-muted-foreground">{process.notes}</p>
                  </div>
                )}
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <span>
                    Criado em {format(new Date(process.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                  <span>•</span>
                  <span>
                    Atualizado em {format(new Date(process.updated_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
