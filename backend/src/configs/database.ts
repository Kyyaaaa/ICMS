import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a new connection pool using the connection string from .env
// This string should point to your Supabase session pooler URL


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Recommended settings for connection pooling
  max: 10, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Catch any errors on idle clients
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to Supabase PostgreSQL database via Pooler');
    client.release(); // release the client back to the pool
  } catch (err) {
    console.error('Error connecting to Supabase database:', err);
  }
};

export default pool;
