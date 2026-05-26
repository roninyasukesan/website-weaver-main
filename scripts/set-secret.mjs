import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Client } = pg;

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:Cityofgod369%40@db.bvfiaknqkwdybpxdhfap.supabase.co:5432/postgres';
const openaiKey = process.env.OPENAI_API_KEY;

const c = new Client({
  connectionString
});

await c.connect();

try {
  if (openaiKey) {
    await c.query(`ALTER DATABASE postgres SET app.settings.openai_api_key = '${openaiKey}'`);
    console.log('✅ Secret configurado via pg');
  } else {
    console.log('❌ OPENAI_API_KEY não encontrada no .env');
  }
} catch (e) {
  console.log('⚠️  pg settings error:', e.message);
}

await c.end();
console.log('⚠️  Configure manualmente no Supabase Dashboard → Settings → Edge Functions → Secrets');
console.log('   Chave: OPENAI_API_KEY');
console.log('   Valor: ' + (openaiKey ? '********' : 'NÃO DEFINIDO'));