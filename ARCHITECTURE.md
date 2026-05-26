# ARCHITECTURE.md

## 1. Tech Stack
- **Framework:** [React 18](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json)
- **Linguagem:** [TypeScript](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json)
- **Estilização:** [Tailwind CSS](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/tailwind.config.ts)
- **UI Components:** [Shadcn UI](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/components/ui) / [Radix UI](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json)
- **Backend/BaaS:** [Supabase](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/integrations/supabase/client.ts) (Auth, Database, Storage)
- **Estado Global:** [TanStack Query (React Query)](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json) para dados do servidor e Context API para Autenticação.
- **Animações:** [Framer Motion](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json)
- **Validação:** [Zod](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json) com [React Hook Form](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/package.json)

## 2. Estrutura de Diretórios
- **/src/components:** Contém componentes reutilizáveis, organizados por funcionalidade (ex: dashboard, ui).
- **/src/hooks:** Hooks customizados para lógica de estado, como `useAuth` e `use-toast`.
- **/src/integrations/supabase:** Configuração do cliente Supabase e definições de tipos geradas automaticamente.
- **/src/lib:** Utilitários e configurações de bibliotecas externas (ex: `utils.ts` para Tailwind Merge).
- **/src/pages:** Páginas da aplicação que representam as rotas principais.
- **/supabase:** Contém migrações de banco de dados e arquivos de configuração do backend.

## 3. Conexão & Fluxo de Dados
A aplicação utiliza o padrão de **Single Page Application (SPA)**. A comunicação com o backend (Supabase) é feita através do cliente oficial do Supabase. 
- **Fetch de Dados:** Realizado via `useQuery` do TanStack Query, garantindo cache eficiente e sincronização em tempo real.
- **Mutations:** Alterações de dados utilizam `useMutation` para gerenciar estados de carregamento e erro.
- **Fluxo:** UI -> React Query Hook -> Supabase Client -> Supabase API -> Database.

## 4. Lógica de Negócio Principal
- **Autenticação:** Centralizada no [useAuth.tsx](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/hooks/useAuth.tsx), gerenciando login via senha e Google OAuth. Inclui lógica de RBAC (Role-Based Access Control) para distinguir entre Administradores e Clientes.
- **Visualização de Dados:** Dashboards específicos para cada perfil de usuário, exibindo processos e documentos filtrados por permissão.

## 5. Modo Demo/Mock
O sistema possui lógica de fallback para demonstração no [useAuth.tsx](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/hooks/useAuth.tsx), permitindo login com credenciais pré-definidas (`admin/admin` ou `client@email.com/client`) para visualização rápida das interfaces sem necessidade de chaves de API ativas.

## 6. Sistemas Específicos
- **CMS/Dashboard de Conteúdo:** Utiliza o [WysiwygEditor.tsx](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/components/dashboard/WysiwygEditor.tsx) baseado em Tiptap para permitir a edição dinâmica de posts do blog e páginas de conteúdo diretamente pela interface administrativa.
- **Gestão de Documentos:** Sistema de upload e gerenciamento de arquivos integrado ao Supabase Storage, com controle de acesso via RLS (Row Level Security).

## 7. Security Considerations
- **Input Validation & Sanitization:** While client-side validation is in place (Zod, React Hook Form), all backend operations, especially those within Supabase Edge Functions and database triggers, must implement robust server-side validation and sanitization to prevent XSS, SQL Injection, and other injection attacks.
- **Authentication & Authorization:** Rely on Supabase Auth for secure authentication. RBAC logic must be strictly enforced on the backend or via Supabase RLS policies to ensure users only access authorized resources.
- **Secrets Management:** All sensitive credentials (API keys, database URLs) must be stored as environment variables (e.g., in `.env` files) and never exposed in client-side code.
- **Rate Limiting:** Implement rate limiting on critical endpoints like authentication and sensitive data submission to mitigate brute-force and denial-of-service attacks.
- **Password Policies:** Ensure strong password policies are enforced, either through Supabase Auth configurations or application-level checks.
- **Secure Password Recovery:** The password recovery flow must use secure, time-limited tokens and be properly validated.
- **Audit Logging:** Consider implementing audit logs for critical user actions to track security-sensitive events.
- **Web Server Configuration for Internal Directories:** Ensure that the production web server (e.g., Nginx, Apache, or the server hosting Vite's build output) is strictly configured to serve only the intended public-facing assets (from `dist/` and `public/`). Prevent direct access to internal source code directories (`src/`), backend configurations (`supabase/`), and internal documentation (`.ai-home/`) by setting up appropriate routing rules or denial of access for these paths.
