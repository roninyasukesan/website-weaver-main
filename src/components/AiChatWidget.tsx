import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT_ADMIN = `Você é o assistente jurídico virtual do escritório Keliane Machado Advocacia, com acesso completo ao sistema.

ESPECIALIDADES:
- Gestão completa de clientes: ver dados, processos, documentos, histórico
- Análise de processos jurídicos e status
- Consulta e gestão de documentos de todos os clientes
- Visão geral do escritório: métricas, estatísticas
- Informações sobre todos os processos e clientes cadastrados
- Geração e revisão de documentos jurídicos

ACESSO:
- Todos os dados de todos os clientes
- Painel administrativo completo
- Métricas e indicadores do escritório

REGRAS:
- Responda de forma profissional e completa
- Quandoasked about client data, provide information from the database context
- Lembre-se: você tem acesso administrativo total
- Sempre cite informações específicas quando disponíveis
- Responda em português brasileiro`;

const SYSTEM_PROMPT_CLIENT = `Você é um assistente jurídico virtual da advocacia Keliane Machado.
Seu papel é:
- Orientar clientes sobre questões jurídicas básicas
- Auxiliar no preenchimento de documentos e formulários
- Esclarecer dúvidas sobre processos legais
- Fornecer informações sobre direitos e deveres legais
- IMPORTANTE: Sempre deixar claro que não substitui orientação de um advogado real
- Adaptar respostas para linguagem acessível, evitando jargões técnicos excessivos

Responda sempre em português brasileiro de forma clara, empática e profissional.`;

export function AiChatWidget() {
  const { user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const systemPrompt = isAdmin ? SYSTEM_PROMPT_ADMIN : SYSTEM_PROMPT_CLIENT;

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMsg = isAdmin
        ? `Olá! Sou o assistente administrativo do escritório Keliane Machado.\n\nTenho acesso completo ao sistema e posso ajudar com:\n• Gestão e consulta de todos os clientes\n• Acompanhamento de processos\n• Análise de documentos e métricas\n• Informações gerais do escritório\n\nComo posso ajudar?`
        : `Olá! Sou o assistente virtual da Advocacia Keliane Machado. Como posso ajudá-lo hoje?\n\nPosso auxiliar com:\n• Informações sobre documentos jurídicos\n• Dúvidas sobre processos\n• Orientações gerais sobre seus direitos`;

      setMessages([{
        role: 'assistant',
        content: welcomeMsg,
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, isAdmin]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

      const conversation = [
        { role: 'system', content: systemPrompt },
        ...messages.slice(0, -1).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage.content },
      ];

      const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({ messages: conversation }),
      });

      if (!response.ok) throw new Error('API Error');

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content || 'Desculpe, não consegui gerar uma resposta.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Erro ao processar mensagem');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Desculpe, houve um erro ao processar sua mensagem. Tente novamente.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 shadow-xl flex flex-col max-h-[600px]">
      <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          {isAdmin ? 'Assistente Admin' : 'Assistente Virtual'}
          {isAdmin && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">Admin</span>}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 p-0 px-4 pb-4 gap-3 min-h-0">
        <div className="flex-1 overflow-y-auto space-y-3 min-h-[300px] max-h-[400px]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                msg.role === 'user' ? 'bg-primary' : 'bg-muted'
              }`}>
                {msg.role === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-muted'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2">
              <div className="flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center bg-muted">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-muted rounded-lg px-3 py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
