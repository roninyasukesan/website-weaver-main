import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Clock, CheckCircle, Upload, Trophy, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { AiChatWidget } from '@/components/AiChatWidget';
import { cn } from '@/lib/utils';

interface Stats {
  totalProcesses: number;
  pendingProcesses: number;
  completedProcesses: number;
  totalDocuments: number;
  completedDocuments: number;
}

interface GamificationData {
  level: number;
  xp: number;
  xpToNextLevel: number;
  progressPercent: number;
  badges: { id: string; name: string; icon: string; earned: boolean }[];
}

export function ClientDashboard() {
  const { user } = useAuth();
  const isAdmin = user?.user_metadata?.role === 'admin';
  const [stats, setStats] = useState<Stats>({
    totalProcesses: 0,
    pendingProcesses: 0,
    completedProcesses: 0,
    totalDocuments: 0,
    completedDocuments: 0,
  });
  const [gami, setGami] = useState<GamificationData>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    progressPercent: 0,
    badges: [
      { id: 'first_login', name: 'Primeiro Login', icon: '🎯', earned: false },
      { id: 'first_process', name: 'Primeiro Processo', icon: '📂', earned: false },
      { id: 'first_document', name: 'Primeiro Documento', icon: '📄', earned: false },
      { id: 'complete_profile', name: 'Perfil Completo', icon: '✅', earned: false },
      { id: 'level_5', name: 'Nível 5', icon: '⭐', earned: false },
      { id: 'all_docs', name: 'Todos Documentos', icon: '🏆', earned: false },
    ],
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

    const { data: profile } = await supabase
      .from('profiles')
      .select('phone, cpf, address')
      .eq('id', user?.id)
      .single();

    if (processes) {
      const completed = processes.filter(p => p.status === 'completed').length;
      const pending = processes.filter(p => p.status === 'pending' || p.status === 'in_progress').length;
      const totalDocs = documents?.length || 0;
      const profileComplete = profile?.phone && profile?.cpf && profile?.address;

      const xp = completed * 50 + pending * 20 + totalDocs * 10 + (profileComplete ? 30 : 0);
      const level = Math.floor(xp / 100) + 1;
      const xpInLevel = xp % 100;
      const progressPercent = Math.min((xpInLevel / 100) * 100, 100);

      const earnedBadges = gami.badges.map(badge => {
        if (badge.id === 'first_login') return { ...badge, earned: true };
        if (badge.id === 'first_process' && processes.length >= 1) return { ...badge, earned: true };
        if (badge.id === 'first_document' && totalDocs >= 1) return { ...badge, earned: true };
        if (badge.id === 'complete_profile' && profileComplete) return { ...badge, earned: true };
        if (badge.id === 'level_5' && level >= 5) return { ...badge, earned: true };
        if (badge.id === 'all_docs' && totalDocs >= 5) return { ...badge, earned: true };
        return badge;
      });

      setStats({
        totalProcesses: processes.length,
        pendingProcesses: pending,
        completedProcesses: completed,
        totalDocuments: totalDocs,
        completedDocuments: completed,
      });

      setGami({
        level,
        xp,
        xpToNextLevel: 100,
        progressPercent,
        badges: earnedBadges,
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

      <div className="grid gap-4 md:grid-cols-3">
      {!isAdmin && (
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground overflow-hidden relative md:col-span-2">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy className="h-24 w-24" />
          </div>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Seu Progresso</CardTitle>
                <CardDescription className="text-primary-foreground/70">
                  Continue interagindo para subir de nível
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  Nível {gami.level}
                </div>
                <div className="text-sm opacity-80">{gami.xp} XP</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso para Nível {gami.level + 1}</span>
                <span>{gami.progressPercent.toFixed(0)}%</span>
              </div>
              <Progress value={gami.progressPercent} className="h-2 bg-primary-foreground/20" />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2">
              {gami.badges.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
                    badge.earned
                      ? "bg-white/20 border-white/40 text-white"
                      : "bg-black/10 border-white/10 text-white/50"
                  )}
                >
                  <span>{badge.icon}</span>
                  {badge.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Andamento Geral</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Processos</span>
                <span className="font-medium">
                  {stats.completedProcesses}/{stats.totalProcesses}
                </span>
              </div>
              <Progress
                value={stats.totalProcesses > 0 ? (stats.completedProcesses / stats.totalProcesses) * 100 : 0}
                className="h-2 mt-1"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Documentos</span>
                <span className="font-medium">
                  {stats.totalDocuments}
                </span>
              </div>
              <Progress value={Math.min(stats.totalDocuments * 10, 100)} className="h-2 mt-1" />
            </div>
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

      <AiChatWidget />

    </div>
  );
}
