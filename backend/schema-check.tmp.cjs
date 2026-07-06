require('dotenv').config();
const { Client } = require('pg');

const client = new Client({ connectionString: process.env.DATABASE_URL });

(async () => {
  await client.connect();
  const result = await client.query(
    `SELECT table_name, column_name
     FROM information_schema.columns
     WHERE table_schema = $1 AND table_name = ANY($2)
     ORDER BY table_name, column_name`,
    ['public', ['payments', 'invoices', 'refund_requests', 'attendances', 'class_sessions', 'change_requests']]
  );
  console.log(JSON.stringify(result.rows));
  await client.end();
})().catch(async (error) => {
  console.error(error.message);
  try { await client.end(); } catch {}
  process.exit(1);
});
