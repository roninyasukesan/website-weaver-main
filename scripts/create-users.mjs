import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Erro: VITE_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não definidos no .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function getUserIdByEmail(email) {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) return null;
  const user = data.users.find(u => u.email === email);
  return user ? user.id : null;
}

async function deleteUser(id) {
  const { error } = await supabase.auth.admin.deleteUser(id);
  return !error;
}

async function createUsers() {
  console.log('1. Deletando usuarios existentes...');

  const emails = ['admin@keliane.adv.br', 'cliente@keliane.adv.br'];
  for (const email of emails) {
    const uid = await getUserIdByEmail(email);
    if (uid) {
      const ok = await deleteUser(uid);
      console.log(`   ${ok ? '✅' : '❌'} Deleted: ${email} (${uid})`);
    } else {
      console.log(`   ⚠️  Nao encontrado: ${email}`);
    }
  }

  console.log('\n2. Criando usuarios com senhas corretas...');

  const users = [
    { email: 'admin@keliane.adv.br', password: 'AdminKeliane2026!', full_name: 'Administrador Keliane Machado', role: 'admin' },
    { email: 'cliente@keliane.adv.br', password: 'ClienteKeliane2026!', full_name: 'Cliente Demo', role: 'client' }
  ];

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.full_name }
    });

    if (error) {
      console.log(`   ❌ ${u.email}: ${error.message}`);
      continue;
    }

    const uid = data.user.id;

    await supabase.from('profiles').upsert({
      id: uid,
      full_name: u.full_name,
      email: u.email,
      phone: u.role === 'admin' ? '11999999999' : '21988888888',
      cpf: u.role === 'admin' ? '12345678901' : '98765432109',
      approval_status: 'approved'
    });

    await supabase.from('user_roles').upsert({
      user_id: uid,
      role: u.role
    });

    console.log(`   ✅ ${u.email} (${u.role}) - UID: ${uid}`);
  }

  console.log('\n📋 Credenciais:');
  console.log('ADMIN:   admin@keliane.adv.br / AdminKeliane2026!');
  console.log('CLIENTE: cliente@keliane.adv.br / ClienteKeliane2026!');
}

createUsers();