const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function runSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
    },
    body: JSON.stringify({ sql })
  });
  return res.json();
}

async function seed() {
  console.log('🔧Seed de usuarios demo...\n');

  const demoUsers = [
    {
      email: 'admin@keliane.adv.br',
      role: 'admin',
      full_name: 'Administrador Keliane Machado',
      phone: '11999999999',
      cpf: '12345678901'
    },
    {
      email: 'cliente@keliane.adv.br',
      role: 'client',
      full_name: 'Cliente Demo',
      phone: '21988888888',
      cpf: '98765432109'
    }
  ];

  for (const user of demoUsers) {
    try {
      const { data: profileData, error: profileErr } = await fetch(`${SUPABASE_URL}/rest/v1/profiles?email=eq.${user.email}&select=id`, {
        headers: {
          'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          'apikey': SUPABASE_SERVICE_ROLE_KEY,
        }
      }).then(r => r.json()).catch(() => null);

      if (profileErr) {
        console.log(`❌ Erro ao buscar ${user.email}: ${profileErr.message}`);
        continue;
      }

      const existingProfile = Array.isArray(profileData) ? profileData[0] : null;

      if (existingProfile) {
        await runSQL(`UPDATE public.profiles SET full_name='${user.full_name}', phone='${user.phone}', cpf='${user.cpf}', approval_status='approved', email='${user.email}' WHERE id='${existingProfile.id}'`);
        await runSQL(`INSERT INTO public.user_roles (user_id, role) VALUES ('${existingProfile.id}', '${user.role}') ON CONFLICT (user_id) DO UPDATE SET role='${user.role}'`);
        console.log(`✅ Atualizado: ${user.email} (${user.role})`);
      } else {
        console.log(`⚠️  Usuario nao encontrado no auth: ${user.email} - pule este`);
      }

    } catch (e) {
      console.log(`❌ Erro: ${user.email} - ${e.message}`);
    }
  }

  console.log('\n🏁Seed completo!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('─────────────────────────────────');
  console.log('ADMIN:   admin@keliane.adv.br / AdminKeliane2026!');
  console.log('CLIENTE: cliente@keliane.adv.br / ClienteKeliane2026!');
  console.log('─────────────────────────────────');
  console.log('\n⚠️  Se os usuarios nao foram encontrados,');
  console.log('crie-os primeiro em Supabase Dashboard → Authentication → Users');
}

seed();
