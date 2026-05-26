import pg from 'pg';
const { Client } = pg;

const c = new Client({
  connectionString: 'postgresql://postgres:Cityofgod369%40@db.bvfiaknqkwdybpxdhfap.supabase.co:5432/postgres'
});

await c.connect();

const stmts = [
  `CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    cpf TEXT,
    address TEXT,
    approval_status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id)`,
  `CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)`,
  `CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))`,
  `CREATE TABLE public.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role TEXT NOT NULL CHECK (role IN ('admin', 'client')),
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))`,
  `CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id)`,
  `CREATE TABLE public.processes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "Clients can view own processes" ON public.processes FOR SELECT USING (auth.uid() = client_id)`,
  `CREATE POLICY "Clients can create own processes" ON public.processes FOR INSERT WITH CHECK (auth.uid() = client_id)`,
  `CREATE POLICY "Clients can update own processes" ON public.processes FOR UPDATE USING (auth.uid() = client_id)`,
  `CREATE POLICY "Admins can view all processes" ON public.processes FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))`,
  `CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`,
  `ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY`,
  `CREATE POLICY "Clients can view own documents" ON public.documents FOR SELECT USING (auth.uid() = client_id)`,
  `CREATE POLICY "Clients can upload own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = client_id)`,
  `CREATE POLICY "Admins can view all documents" ON public.documents FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin'))`
];

for (const sql of stmts) {
  try {
    await c.query(sql);
    console.log('✅', sql.substring(0, 60).replace(/\n/g, ' '));
  } catch (e) {
    console.log('❌', e.message.substring(0, 80));
  }
}

await c.end();
console.log('\n🏁 Feito!');