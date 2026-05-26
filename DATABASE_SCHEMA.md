# DATABASE_SCHEMA.md

## 1. Tecnologia de Banco
- **Banco de Dados:** [PostgreSQL](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/src/integrations/supabase/types.ts) via **Supabase**.
- **Justificativa:** O Supabase oferece uma infraestrutura completa de Backend-as-a-Service (BaaS), incluindo autenticação integrada, Row Level Security (RLS) para segurança granular, armazenamento de arquivos (Storage) e APIs automáticas (REST e Realtime), o que acelera o desenvolvimento e garante escalabilidade.

## 2. Esquema de Dados (ERD)

### Tabela: `profiles`
Armazena informações adicionais dos usuários (clientes e administradores).
- `id`: UUID (PK, FK para `auth.users`)
- `full_name`: TEXT
- `email`: TEXT
- `phone`: TEXT
- `cpf`: TEXT
- `address`: TEXT
- `approval_status`: `approval_status` (Enum: 'pending', 'approved', 'rejected')
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

### Tabela: `user_roles`
Gerencia os papéis de acesso dos usuários.
- `id`: UUID (PK)
- `user_id`: UUID (FK para `auth.users`)
- `role`: `app_role` (Enum: 'admin', 'client')
- `created_at`: TIMESTAMP WITH TIME ZONE

### Tabela: `processes`
Registra os processos jurídicos/administrativos dos clientes.
- `id`: UUID (PK)
- `client_id`: UUID (FK para `auth.users`)
- `title`: TEXT
- `description`: TEXT
- `case_number`: TEXT
- `category`: TEXT (Default: 'previdenciario')
- `status`: `process_status` (Enum: 'pending', 'in_progress', 'completed', 'cancelled')
- `notes`: TEXT
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

### Tabela: `documents`
Gerencia os arquivos vinculados a processos ou clientes.
- `id`: UUID (PK)
- `process_id`: UUID (FK para `public.processes`)
- `client_id`: UUID (FK para `auth.users`)
- `file_name`: TEXT
- `file_path`: TEXT
- `file_type`: TEXT
- `file_size`: INTEGER
- `description`: TEXT
- `created_at`: TIMESTAMP WITH TIME ZONE

### Tabela: `website_content`
Armazena o conteúdo dinâmico editável via dashboard (WYSIWYG).
- `id`: UUID (PK)
- `section_key`: TEXT (Unique)
- `title`: TEXT
- `content`: TEXT
- `image_url`: TEXT
- `metadata`: JSONB
- `updated_at`: TIMESTAMP WITH TIME ZONE
- `updated_by`: UUID (FK para `auth.users`)

### Tabela: `seo_settings`
Configurações de SEO por página.
- `id`: UUID (PK)
- `page_path`: TEXT (Unique)
- `title`: TEXT
- `description`: TEXT
- `keywords`: TEXT
- `og_image`: TEXT
- `updated_at`: TIMESTAMP WITH TIME ZONE
- `updated_by`: UUID (FK para `auth.users`)

## 3. Segurança (RLS)
Todas as tabelas possuem **Row Level Security (RLS)** habilitado:
- **Perfis e Papéis:** Usuários só podem visualizar/atualizar seus próprios dados. Administradores têm acesso total.
- **Processos e Documentos:** Clientes só acessam itens vinculados ao seu `client_id`. Administradores gerenciam todos os registros.
- **Conteúdo do Site:** Leitura pública permitida para todos; edição restrita a administradores.
- **Storage:** O bucket `documents` possui políticas que restringem o acesso aos arquivos baseando-se no `auth.uid()` do usuário e no papel de administrador.

## 3.1. Validação e Sanitização de Dados em Triggers
- **Importância:** Embora o RLS controle o acesso, triggers de banco de dados (`on_auth_user_created`, etc.) podem ser pontos de entrada para dados maliciosos se não forem devidamente validados.
- **Recomendação:** Certificar-se de que quaisquer triggers ou funções de banco de dados que manipulam dados insiram lógica de validação e sanitização para garantir a integridade e segurança dos dados, complementando as validações do lado do cliente e das Edge Functions.

## 4. Próximos Passos
1. **Migrações:** Certifique-se de que a migração inicial em [supabase/migrations](file:///c:/Users/hakun/Documents/trae_projects/kelianemachado/website-weaver-main/supabase/migrations) foi aplicada ao seu projeto Supabase.
2. **Variáveis de Ambiente:** Configure as chaves `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` no arquivo `.env`.
3. **Triggers:** Verifique se o trigger `on_auth_user_created` está funcionando para criar perfis automáticos no momento do cadastro.