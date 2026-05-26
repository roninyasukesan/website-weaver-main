const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const PROJECT_ID = process.env.VITE_SUPABASE_PROJECT_ID;

async function runSQL(sql) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_ID}/database/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ query: sql })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.msg || data.message || JSON.stringify(data));
  }
  return data;
}

async function setupAll() {
  console.log('🔧 Criando schema completo...\n');

  const statements = [
    `-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

    `-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  cpf TEXT,
  address TEXT,
  approval_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`,

    `-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;`,

    `-- Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);`,

    `-- User Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,

    `-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;`,

    `-- Policies for user_roles
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);`,

    `-- Processos table
CREATE TABLE IF NOT EXISTS public.processes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`,

    `-- Enable RLS on processos
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;`,

    `-- Policies for processos
DROP POLICY IF EXISTS "Clients can view own processes" ON public.processes;
CREATE POLICY "Clients can view own processes" ON public.processes FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can create own processes" ON public.processes;
CREATE POLICY "Clients can create own processes" ON public.processes FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can update own processes" ON public.processes;
CREATE POLICY "Clients can update own processes" ON public.processes FOR UPDATE USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins can view all processes" ON public.processes;
CREATE POLICY "Admins can view all processes" ON public.processes FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);`,

    `-- Documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`,

    `-- Enable RLS on documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;`,

    `-- Policies for documents
DROP POLICY IF EXISTS "Clients can view own documents" ON public.documents;
CREATE POLICY "Clients can view own documents" ON public.documents FOR SELECT USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can upload own documents" ON public.documents;
CREATE POLICY "Clients can upload own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Admins can view all documents" ON public.documents;
CREATE POLICY "Admins can view all documents" ON public.documents FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);`
  ];

  for (const sql of statements) {
    try {
      await runSQL(sql);
      console.log(`✅ ${sql.substring(0, 60).replace(/\n/g, ' ')}...`);
    } catch (e) {
      console.log(`❌ ${e.message.substring(0, 80)}`);
    }
  }

  console.log('\n🏁 Schema criado!');
}

setupAll();
