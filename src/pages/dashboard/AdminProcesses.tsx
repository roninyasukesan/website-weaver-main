import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Process {
  id: string;
  client_id: string;
  title: string;
  description: string | null;
  case_number: string | null;
  category: string;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface Client {
  id: string;
  full_name: string | null;
  email: string | null;
}

export function AdminProcesses() {
  const [processes, setProcesses] = useState<Process[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  useEffect(() => {
    fetchProcesses();
    fetchClients();
  }, []);

  const fetchProcesses = async () => {
    const { data } = await supabase
      .from('processes')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setProcesses(data);
    }
    setLoading(false);
  };

  const fetchClients = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .eq('approval_status', 'approved');

    if (data) {
      setClients(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este processo?')) return;

    const { error } = await supabase.from('processes').delete().eq('id', id);

    if (error) {
      toast.error('Erro ao excluir processo');
      return;
    }

    toast.success('Processo excluído com sucesso!');
    fetchProcesses();
  };

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.full_name || client?.email || 'Cliente não encontrado';
  };

  const filteredProcesses = processes.filter((process) => {
    const clientName = getClientName(process.client_id);
    const matchesSearch =
      process.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      process.case_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || process.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendente', variant: 'secondary' },
    in_progress: { label: 'Em Andamento', variant: 'default' },
    completed: { label: 'Concluído', variant: 'outline' },
    cancelled: { label: 'Cancelado', variant: 'destructive' },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Processos</h1>
          <p className="text-muted-foreground mt-1">
            Crie e gerencie processos dos clientes
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProcess(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Processo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingProcess ? 'Editar Processo' : 'Novo Processo'}
              </DialogTitle>
            </DialogHeader>
            <ProcessForm
              process={editingProcess}
              clients={clients}
              onSave={() => {
                setDialogOpen(false);
                fetchProcesses();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por título, número ou cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluídos</SelectItem>
                <SelectItem value="cancelled">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Atualização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProcesses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum processo encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProcesses.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell className="font-medium">{process.title}</TableCell>
                      <TableCell>{getClientName(process.client_id)}</TableCell>
                      <TableCell>{process.case_number || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={statusLabels[process.status]?.variant || 'secondary'}>
                          {statusLabels[process.status]?.label || process.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(process.updated_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingProcess(process);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDelete(process.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProcessForm({
  process,
  clients,
  onSave,
}: {
  process: Process | null;
  clients: Client[];
  onSave: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [clientId, setClientId] = useState(process?.client_id || '');
  const [title, setTitle] = useState(process?.title || '');
  const [description, setDescription] = useState(process?.description || '');
  const [caseNumber, setCaseNumber] = useState(process?.case_number || '');
  const [category, setCategory] = useState(process?.category || 'previdenciario');
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed' | 'cancelled'>(process?.status as any || 'pending');
  const [notes, setNotes] = useState(process?.notes || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      client_id: clientId,
      title,
      description: description || null,
      case_number: caseNumber || null,
      category,
      status,
      notes: notes || null,
    };

    let error;
    if (process) {
      ({ error } = await supabase
        .from('processes')
        .update(data)
        .eq('id', process.id));
    } else {
      ({ error } = await supabase.from('processes').insert(data));
    }

    if (error) {
      toast.error('Erro ao salvar processo');
    } else {
      toast.success(`Processo ${process ? 'atualizado' : 'criado'} com sucesso!`);
      onSave();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <Label>Cliente *</Label>
        <Select value={clientId} onValueChange={setClientId} required>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecione um cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.full_name || client.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Título *</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label>Número do Processo</Label>
          <Input
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Categoria</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="previdenciario">Previdenciário</SelectItem>
              <SelectItem value="aereo">Direito Aéreo</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Andamento</SelectItem>
              <SelectItem value="completed">Concluído</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Descrição</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      <div>
        <Label>Observações (visível para o cliente)</Label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1"
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading || !clientId || !title}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        {process ? 'Salvar Alterações' : 'Criar Processo'}
      </Button>
    </form>
  );
}
