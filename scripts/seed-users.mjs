import pg from 'pg';
const { Client } = pg;

const c = new Client({
  connectionString: 'postgresql://postgres:Cityofgod369%40@db.bvfiaknqkwdybpxdhfap.supabase.co:5432/postgres'
});

await c.connect();

const users = [
  { email: 'admin@keliane.adv.br', password: 'AdminKeliane2026!', full_name: 'Administrador Keliane Machado', phone: '11999999999', cpf: '12345678901', role: 'admin' },
  { email: 'cliente@keliane.adv.br', password: 'ClienteKeliane2026!', full_name: 'Cliente Demo', phone: '21988888888', cpf: '98765432109', role: 'client' }
];

for (const u of users) {
  try {
    const r = await c.query(`SELECT id FROM auth.users WHERE email = '${u.email}'`);
    if (r.rows.length === 0) {
      console.log(`⚠️  Usuario nao existe no auth: ${u.email}`);
      continue;
    }
    const uid = r.rows[0].id;
    await c.query(`INSERT INTO public.profiles (id, full_name, email, phone, cpf, approval_status) VALUES ('${uid}', '${u.full_name}', '${u.email}', '${u.phone}', '${u.cpf}', 'approved') ON CONFLICT (id) DO UPDATE SET full_name='${u.full_name}', phone='${u.phone}', approval_status='approved'`);
    await c.query(`INSERT INTO public.user_roles (user_id, role) VALUES ('${uid}', '${u.role}') ON CONFLICT (user_id) DO UPDATE SET role='${u.role}'`);
    console.log(`✅ ${u.email} (${u.role}) - UID: ${uid}`);
  } catch (e) {
    console.log(`❌ ${u.email}: ${e.message.substring(0, 80)}`);
  }
}

await c.end();
console.log('\n📋 Credenciais de acesso:');
console.log('ADMIN:   admin@keliane.adv.br / AdminKeliane2026!');
console.log('CLIENTE: cliente@keliane.adv.br / ClienteKeliane2026!');