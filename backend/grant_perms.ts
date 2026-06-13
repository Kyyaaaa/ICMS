import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function run() {
  await client.connect();
  try {
    await client.query('GRANT ALL ON TABLE classroom TO service_role;');
    await client.query('GRANT ALL ON TABLE classroom_maintenance TO service_role;');
    await client.query('GRANT ALL ON TABLE classroom TO authenticated;');
    await client.query('GRANT ALL ON TABLE classroom TO anon;');
    await client.query('GRANT ALL ON TABLE classroom_maintenance TO authenticated;');
    await client.query('GRANT ALL ON TABLE classroom_maintenance TO anon;');
    console.log('Permissions granted successfully!');
  } catch (e) {
    console.error('Error granting permissions:', e);
  } finally {
    await client.end();
  }
}

run();
