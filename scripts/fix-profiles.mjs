import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Cityofgod369%40@db.bvfiaknqkwdybpxdhfap.supabase.co:5432/postgres';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const c = new Client({
  connectionString
});

await c.connect();

async function getAuthUsers() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?page=1&per_page=10`, {
    headers: {
      'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': SUPABASE_SERVICE_ROLE_KEY,
    }
  });
  const data = await res.json();
  return data.users || [];
}

async function seed() {
  console.log('🔧 Seedando profiles e roles...\n');

  const users = await getAuthUsers();
  console.log(`Encontrados ${users.length} usuarios`);

  for (const authUser of users) {
    const email = authUser.email;
    const uid = authUser.id;
    const isAdmin = email === 'admin@keliane.adv.br';
    const fullName = authUser.user_metadata?.full_name || email;

    try {
      await c.query(`
        INSERT INTO public.profiles (id, full_name, email, phone, cpf, approval_status)
        VALUES ('${uid}', '${fullName}', '${email}', '${isAdmin ? '11999999999' : '21988888888'}', '${isAdmin ? '12345678901' : '98765432109'}', 'approved')
        ON CONFLICT (id) DO UPDATE SET full_name='${fullName}', approval_status='approved'
      `);
      console.log(`✅ Profile: ${email}`);

      await c.query(`
        INSERT INTO public.user_roles (user_id, role)
        VALUES ('${uid}', '${isAdmin ? 'admin' : 'client'}')
        ON CONFLICT (user_id) DO UPDATE SET role='${isAdmin ? 'admin' : 'client'}'
      `);
      console.log(`✅ Role: ${email} = ${isAdmin ? 'admin' : 'client'}`);
    } catch (e) {
      console.log(`❌ ${email}: ${e.message.substring(0, 100)}`);
    }
  }

  console.log('\n🏁 Feito!');
  await c.end();
}

seed();