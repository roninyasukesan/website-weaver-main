# 🤖 Prompts para Orquestração de Documentação (.md) 
 
 
 Este arquivo contém os prompts prontos para serem usados por um agente de orquestração ao criar a documentação técnica de um novo projeto. Cada seção abaixo corresponde a um arquivo `.md` essencial. 
 
 
 --- 
 
 
 ## 1. Prompt para ARCHITECTURE.md 
 **Objetivo:**  Criar a visão técnica geral do projeto. 
 
 
 > "Aja como um Arquiteto de Software Sênior. Analise o código do projeto e crie o arquivo `ARCHITECTURE.md` seguindo rigorosamente esta estrutura: 
 > 1. **Tech Stack:**  Liste as tecnologias principais (Framework, Linguagem, Estilização, UI, Backend/BaaS, Estado, Animações, Validação). 
 > 2. **Estrutura de Diretórios:**  Explique a organização das pastas (ex: /app, /components, /lib, /hooks, /supabase) e a responsabilidade de cada uma. 
 > 3. **Conexão & Fluxo de Dados:**  Descreva o padrão de acesso a dados (Fetch, SSR) e como a UI se comunica com o backend. 
 > 4. **Lógica de Negócio Principal:**  Detalhe os fluxos de Autenticação, Busca/Filtros e Visualização de Dados. 
 > 5. **Modo Demo/Mock:**  Se houver, explique como o sistema funciona offline or sem chaves de API. 
 > 6. **Sistemas Específicos:**  Se o projeto tiver funcionalidades complexas (ex: Chat, CMS, Admin), dedique uma seção para explicar sua arquitetura técnica e sincronização." 
 
 
 --- 
 
 
 ## 2. Prompt para DATABASE_SCHEMA.md 
 **Objetivo:**  Definir e documentar a modelagem de dados. 
 
 
 > "Analise o backend e os arquivos de configuração de banco de dados do projeto. Crie o arquivo `DATABASE_SCHEMA.md` com: 
 > 1. **Tecnologia de Banco:**  Justifique a escolha do banco (ex: PostgreSQL/Supabase). 
 > 2. **Esquema de Dados (ERD):**  Para cada tabela principal, liste os campos, tipos (ex: UUID, JSONB, Array) e chaves (PK, FK). 
 > 3. **Segurança (RLS):**  Descreva as políticas de segurança aplicadas às tabelas. 
 > 4. **Próximos Passos:**  Liste as ações necessárias para implementar ou migrar o banco (ex: Rodar migrações, configurar chaves de API)." 
 
 
 --- 
 
 
 ## 3. Prompt para DOCUMENTATION_MODIFICATIONS.md 
 **Objetivo:**  Registrar decisões arquiteturais e melhorias de UX/Performance. 
 
 
 > "Atue como um Engenheiro de Software documentando o progresso. Crie o arquivo `DOCUMENTATION_MODIFICATIONS.md` para registrar as principais mudanças técnicas realizadas. Para cada mudança, utilize OBRIGATORIAMENTE o formato abaixo: 
 > 
 > #### [Nome da Implementação/Mudança] 
 > * **Problema:**  Qual era a dor ou limitação técnica anterior? 
 > * **Solução:**  Como foi implementado tecnicamente? (Cite arquivos ou libs usadas). 
 > * **Resultado:**  Qual o impacto positivo direto (Performance, UX, Redução de código)?" 
 
 
 --- 
 
 
 ## 4. Prompt para FIXES_APPLIED.md 
 **Objetivo:**  Documentar a correção de bugs e riscos. 
 
 
 > "Crie o arquivo `FIXES_APPLIED.md` para registrar a correção de inconsistências ou riscos identificados. Utilize o formato: 
 > 
 > ## [Título da Correção] ✅ 
 > **Problema:**  Detalhe o erro ou risco que existia. 
 > **Solução:**  Explique a lógica da correção aplicada. 
 > **Arquivo modificado:**  Liste o caminho completo do arquivo. 
 > **Impacto:**  Quais os benefícios imediatos dessa correção (Segurança, Estabilidade, Conformidade)?" 
 
 
 --- 
 
 
 ## 5. Prompt para Roadmap e Change Requests 
 **Objetivo:**  Gerenciar o backlog do MVP. 
 
 
 > "Crie um arquivo de Roadmap (ex: `mvp-roadmap.md`) ou Change Requests (ex: `mvp-change-requests.md`) para gerenciar as próximas tarefas. Estruture cada item com: 
 > 1. **Mudança Necessária:**  Descrição clara da funcionalidade ou ajuste. 
 > 2. **Proposta de Implementação:**  Como o agente deve proceder tecnicamente. 
 > 3. **Critério de Aceitação:**  O que deve acontecer para a tarefa ser considerada concluída. 
 > 4. **Riscos e Rollback:**  O que pode dar errado e como reverter." 
 
 
 --- 
 
 
 ## 6. Prompt para REUSABLE_PROJECT_GUIDELINES.md 
 **Objetivo:**  Criar um guia de padrões para o projeto atual e futuros. 
 
 
 > "Consolide todos os padrões técnicos do projeto no arquivo `REUSABLE_PROJECT_GUIDELINES.md`. O prompt deve instruir a extrair: 
 > 1. **Padrões de Tech Stack:**  Framework, UI e Backend. 
 > 2. **Camada de Dados:**  Como as chamadas de banco devem ser abstraídas. 
 > 3. **Padrões de UI/UX:**  Mobile-first, feedback via toasts, modais de visualização. 
 > 4. **Regras de Documentação:**  Formatos obrigatórios para logs de modificações e correções. 
 > 5. **Qualidade:**  Uso de tipagem estrita e verificação de permissões (RBAC)."
