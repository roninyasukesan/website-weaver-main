#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bvfiaknqkwdybpxdhfap.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não configurada');
  console.error('   Obtenha em: Supabase Dashboard → Settings → API → service_role_key');
  console.error('   E exporte: export SUPABASE_SERVICE_ROLE_KEY="sua_chave_aqui"');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createDemoUsers() {
  console.log('🔧 Criando usuários demo...\n');

  const demoUsers = [
    {
      email: 'admin@keliane.adv.br',
      password: 'AdminKeliane2026!',
      full_name: 'Administrador Keliane Machado',
      role: 'admin',
      phone: '11999999999',
      cpf: '12345678901'
    },
    {
      email: 'cliente@keliane.adv.br',
      password: 'ClienteKeliane2026!',
      full_name: 'Cliente Demo',
      role: 'client',
      phone: '21988888888',
      cpf: '98765432109'
    }
  ];

  for (const user of demoUsers) {
    try {
      console.log(`📝 Criando ${user.role}: ${user.email}`);

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: { full_name: user.full_name }
      });

      if (authError) {
        if (authError.message.includes('already been registered')) {
          console.log(`   ⚠️  Usuário já existe, pulando...`);
          continue;
        }
        throw authError;
      }

      const userId = authData.user.id;

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          cpf: user.cpf,
          approval_status: 'approved'
        }, { onConflict: 'id' });

      if (profileError) throw profileError;

      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({
          user_id: userId,
          role: user.role
        }, { onConflict: 'user_id,role' });

      if (roleError) throw roleError;

      console.log(`   ✅ Criado com sucesso!`);
      console.log(`      Senha temporária: ${user.password}`);
      console.log(`      UUID: ${userId}\n`);

    } catch (error) {
      console.error(`   ❌ Erro: ${error.message}\n`);
    }
  }

  console.log('🏁 Seed completo!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('─────────────────────────────────');
  console.log('ADMIN:');
  console.log('   Email:    admin@keliane.adv.br');
  console.log('   Senha:    AdminKeliane2026!');
  console.log('─────────────────────────────────');
  console.log('CLIENTE:');
  console.log('   Email:    cliente@keliane.adv.br');
  console.log('   Senha:    ClienteKeliane2026!');
  console.log('─────────────────────────────────');
}

createDemoUsers().catch(console.error);
