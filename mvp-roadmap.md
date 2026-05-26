# mvp-roadmap.md

Este arquivo gerencia o backlog do MVP e as próximas tarefas prioritárias para a evolução do projeto.

## 1. Implementação de Notificações em Tempo Real 🔔
- **Mudança Necessária:** Os clientes precisam ser notificados quando um novo documento for anexado ao seu processo ou quando o status do processo mudar.
- **Proposta de Implementação:** Utilizar o Supabase Realtime para ouvir mudanças nas tabelas `processes` e `documents`, exibindo notificações via Toast ([sonner](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/components/ui/sonner.tsx)) e persistindo-as em uma nova tabela de `notifications`.
- **Critério de Aceitação:** O usuário deve ver um alerta visual imediato ao ocorrer uma atualização, sem precisar recarregar a página.
- **Riscos e Rollback:** Risco de sobrecarga de eventos se não houver filtros adequados no cliente. Rollback: Desabilitar o listener de realtime.

## 2. Geração de PDF para Resumo de Processos 📄
- **Mudança Necessária:** Possibilidade de exportar um resumo formatado do processo jurídico em PDF.
- **Proposta de Implementação:** Integrar uma biblioteca como `jsPDF` ou `react-pdf` para gerar o arquivo a partir dos dados do processo e documentos vinculados.
- **Critério de Aceitação:** Botão "Exportar PDF" funcional em cada card de processo, gerando um documento limpo e legível.
- **Riscos e Rollback:** Problemas de compatibilidade com caracteres especiais ou CSS complexo. Rollback: Remover a feature de exportação.

## 3. Fluxo Automatizado de Aprovação de Clientes ⏳
- **Mudança Necessária:** Automatizar a transição de `pending` para `approved` no cadastro de novos clientes.
- **Proposta de Implementação:** Criar uma Supabase Edge Function que valide o CPF/dados básicos e envie um e-mail de confirmação via SMTP ou serviço como Resend.
- **Critério de Aceitação:** O status do perfil deve mudar automaticamente após a validação bem-sucedida, permitindo acesso ao dashboard.
- **Riscos e Rollback:** Falha na integração com API de e-mail ou erros de validação de CPF. Rollback: Manter a aprovação manual via dashboard administrativo.

## 4. Implementação de Validação e Sanitização de Entrada no Backend 🛡️
- **Mudança Necessária:** Garantir que todas as entradas de dados via Edge Functions e triggers de banco de dados sejam validadas e sanitizadas para prevenir vulnerabilidades como XSS e SQL Injection.
- **Proposta de Implementação:** Revisar e adicionar lógica de validação (usando Zod ou bibliotecas similares) e sanitização (escape de caracteres especiais) em todas as Supabase Edge Functions e triggers associados a operações de escrita no banco de dados.
- **Critério de Aceitação:** Todas as funções de backend que recebem dados do usuário devem possuir checks explícitos de validação e sanitização.
- **Riscos e Rollback:** Complexidade na implementação para cobrir todos os cenários. Rollback: Remover validações de backend (NÃO RECOMENDADO), dependendo exclusivamente de RLS e validação do cliente.

## 5. Implementação de Rate Limiting em Endpoints de Autenticação 🔒
- **Mudança Necessária:** Proteger os endpoints de login e cadastro contra ataques de força bruta.
- **Proposta de Implementação:** Configurar rate limiting nas rotas de autenticação (via Supabase Auth, ou implementar em Edge Functions se necessário).
- **Critério de Aceitação:** Limite de tentativas de login/cadastro por IP/usuário dentro de um período de tempo definido.
- **Riscos e Rollback:** Bloqueio indevido de usuários legítimos em redes compartilhadas. Rollback: Desativar o rate limiting.

## 6. Implementação de Fluxo Seguro de Recuperação de Senha 🔑
- **Mudança Necessária:** Oferecer um mecanismo seguro para usuários redefinirem suas senhas.
- **Proposta de Implementação:** Implementar um fluxo onde o usuário solicita a redefinição, recebe um link seguro via e-mail com token de uso único e data de expiração, e pode definir uma nova senha.
- **Critério de Aceitação:** Usuário consegue redefinir a senha com sucesso através do fluxo seguro.
- **Riscos e Rollback:** Exposição de tokens ou falha na expiração. Rollback: Desativar a funcionalidade de recuperação de senha.

## 7. Implementação de Logs de Auditoria 📈
- **Mudança Necessária:** Rastrear ações críticas realizadas pelos usuários (ex: login, alterações de permissão, acesso a dados sensíveis).
- **Proposta de Implementação:** Criar uma tabela de `audit_logs` e registrar eventos importantes via triggers de banco de dados ou em Edge Functions.
- **Critério de Aceitação:** Um registro de auditoria é criado para cada ação crítica definida.
- **Riscos e Rollback:** Aumento da carga no banco de dados e complexidade de gerenciamento dos logs. Rollback: Desativar a geração de logs de auditoria.