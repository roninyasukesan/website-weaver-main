# REUSABLE_PROJECT_GUIDELINES.md

Este arquivo consolida todos os padrões técnicos do projeto para garantir consistência, escalabilidade e facilidade de manutenção em evoluções futuras.

## 1. Padrões de Tech Stack
- **Frontend:** [React 18](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json) com **TypeScript** estrito. Prefira hooks customizados para separar a lógica de negócio dos componentes de UI.
- **UI:** Use [Shadcn UI](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/components/ui) como base para novos componentes. Mantenha o design system consistente com as variáveis do [tailwind.config.ts](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/tailwind.config.ts).
- **Backend:** Todas as integrações de banco de dados e autenticação devem passar pelo cliente centralizado do [Supabase](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/integrations/supabase/client.ts).

## 2. Camada de Dados
- **Abstração:** Utilize o [TanStack Query](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json) para gerenciar o estado do servidor. Não faça chamadas diretas ao Supabase dentro de componentes de UI; prefira criar hooks específicos ou encapsular em funções de serviço.
- **Tipagem:** Sempre utilize os tipos gerados automaticamente em [types.ts](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/integrations/supabase/types.ts) ao lidar com dados do banco.
- **Segurança:** Confie no Row Level Security (RLS) do Supabase. Nunca exponha chaves de API secretas no cliente.

## 3. Padrões de UI/UX
- **Mobile-first:** Todos os componentes devem ser responsivos, utilizando as classes utilitárias do Tailwind.
- **Feedback:** Use `sonner` para notificações (toasts) de sucesso/erro e `skeleton` para estados de carregamento.
- **Interação:** Modais e Sheets ([Dialog](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/components/ui/dialog.tsx), [Sheet](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/components/ui/sheet.tsx)) devem ser usados para visualização detalhada de dados sem perda de contexto.

## 4. Regras de Documentação
- **Logs de Mudança:** Decisões técnicas e novas funcionalidades devem ser registradas em [DOCUMENTATION_MODIFICATIONS.md](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/DOCUMENTATION_MODIFICATIONS.md).
- **Correções:** Bugs significativos e suas resoluções devem constar em [FIXES_APPLIED.md](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/FIXES_APPLIED.md).
- **Código:** Comente apenas lógicas complexas; prefira nomes de variáveis e funções autodescritivos.

## 5. Qualidade e Conformidade
- **RBAC:** Sempre verifique as permissões do usuário via `isAdmin` ou `isApproved` no hook [useAuth](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/hooks/useAuth.tsx) antes de renderizar componentes sensíveis.
- **Linting:** Siga as regras definidas no [eslint.config.js](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/eslint.config.js).
- **Validação:** Todos os inputs de formulário devem ser validados via `zod` e `react-hook-form`.

## 6. Security Best Practices
- **Input Sanitization:** All data received from clients (via API calls, forms, etc.) must be rigorously validated and sanitized on the server-side (e.g., within Edge Functions or backend logic) to prevent injection attacks (XSS, SQLi). Use libraries like Zod for validation and ensure proper escaping of special characters when rendering user-generated content.
- **Secure Secrets Management:** Sensitive information (API keys, database credentials, JWT secrets) must be stored securely using environment variables (e.g., in `.env` files) and accessed only from the server-side or secure backend environments. Never commit secrets directly into the codebase or expose them in client-side JavaScript.
- **Rate Limiting:** Implement rate limiting for authentication endpoints and sensitive API calls to prevent brute-force attacks and abuse.
- **Secure Password Recovery:** Ensure password reset mechanisms use secure, time-limited tokens and are validated server-side.
- **Audit Logging:** For critical operations (e.g., user authentication, permission changes, data modifications), implement audit logging to track user activity for security monitoring and incident response.