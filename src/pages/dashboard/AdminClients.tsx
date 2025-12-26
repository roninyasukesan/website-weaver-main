import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { Loader2, Search, Eye, Check, X, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  cpf: string | null;
  address: string | null;
  approval_status: string;
  created_at: string;
}

export function AdminClients() {
  const [clients, setClients] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<Profile | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setClients(data);
    }
    setLoading(false);
  };

  const updateApprovalStatus = async (clientId: string, status: 'pending' | 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({ approval_status: status })
      .eq('id', clientId);

    if (error) {
      toast.error('Erro ao atualizar status');
      return;
    }

    toast.success(`Cliente ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`);
    fetchClients();
  };

  const updateClientProfile = async (clientId: string, updates: Partial<Profile>) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', clientId);

    if (error) {
      toast.error('Erro ao atualizar cliente');
      return;
    }

    toast.success('Cliente atualizado com sucesso!');
    fetchClients();
    setDetailsOpen(false);
  };

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cpf?.includes(searchTerm);

    const matchesStatus =
      statusFilter === 'all' || client.approval_status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const approvalLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    pending: { label: 'Pendente', variant: 'secondary' },
    approved: { label: 'Aprovado', variant: 'default' },
    rejected: { label: 'Rejeitado', variant: 'destructive' },
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
        <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e gerencie todos os clientes cadastrados
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome, email ou CPF..."
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
                <SelectItem value="approved">Aprovados</SelectItem>
                <SelectItem value="rejected">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum cliente encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        {client.full_name || 'Sem nome'}
                      </TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.phone || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={approvalLabels[client.approval_status]?.variant || 'secondary'}>
                          {approvalLabels[client.approval_status]?.label || client.approval_status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(client.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {client.approval_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-green-600 hover:text-green-700"
                                onClick={() => updateApprovalStatus(client.id, 'approved')}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => updateApprovalStatus(client.id, 'rejected')}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedClient(client);
                              setDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
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

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <ClientDetailsForm
              client={selectedClient}
              onSave={(updates) => updateClientProfile(selectedClient.id, updates)}
              onStatusChange={(status) => {
                updateApprovalStatus(selectedClient.id, status);
                setDetailsOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ClientDetailsForm({
  client,
  onSave,
  onStatusChange,
}: {
  client: Profile;
  onSave: (updates: Partial<Profile>) => void;
  onStatusChange: (status: string) => void;
}) {
  const [fullName, setFullName] = useState(client.full_name || '');
  const [phone, setPhone] = useState(client.phone || '');
  const [cpf, setCpf] = useState(client.cpf || '');
  const [address, setAddress] = useState(client.address || '');

  return (
    <div className="space-y-4 mt-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Nome Completo</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input value={client.email || ''} disabled className="mt-1" />
        </div>
        <div>
          <Label>Telefone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <Label>CPF</Label>
          <Input
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label>Endereço</Label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          onClick={() =>
            onSave({
              full_name: fullName,
              phone,
              cpf,
              address,
            })
          }
          className="flex-1"
        >
          Salvar Alterações
        </Button>
        {client.approval_status !== 'approved' && (
          <Button
            variant="outline"
            className="text-green-600"
            onClick={() => onStatusChange('approved')}
          >
            Aprovar
          </Button>
        )}
        {client.approval_status !== 'rejected' && (
          <Button
            variant="outline"
            className="text-red-600"
            onClick={() => onStatusChange('rejected')}
          >
            Rejeitar
          </Button>
        )}
      </div>
    </div>
  );
}
