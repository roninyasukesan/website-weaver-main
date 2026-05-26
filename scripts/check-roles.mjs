import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Cityofgod369%40@db.bvfiaknqkwdybpxdhfap.supabase.co:5432/postgres';

const c = new Client({
  connectionString
});

await c.connect();

const r = await c.query(`
  SELECT u.email, r.role
  FROM auth.users u
  LEFT JOIN public.user_roles r ON r.user_id = u.id
  ORDER BY u.email
`);

console.log(JSON.stringify(r.rows, null, 2));
await c.end();