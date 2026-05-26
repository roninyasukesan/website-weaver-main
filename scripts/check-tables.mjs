import pg from 'pg';
const { Client } = pg;

const c = new Client({
  connectionString: 'postgresql://postgres:Cityofgod369%40@db.bvfiaknqkwdybpxdhfap.supabase.co:5432/postgres'
});

await c.connect();
const r = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public'");
console.log(JSON.stringify(r.rows, null, 2));
await c.end();