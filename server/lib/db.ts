import pg from 'pg';
import 'dotenv/config';

const { Pool, types } = pg;

// Parse BIGINT (OID 20) sebagai number, bukan string
types.setTypeParser(20, (val: string) => parseInt(val, 10));
// Parse NUMERIC (OID 1700) sebagai float
types.setTypeParser(1700, (val: string) => parseFloat(val));

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required.');
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err.message);
});

/** Helper: execute parameterized query */
export async function query(text: string, params?: any[]) {
  try {
    return await pool.query(text, params);
  } catch (error: any) {
    console.error('DB query error:', error.message);
    throw error;
  }
}

/** Helper: get a client for transactions */
export async function getClient() {
  const client = await pool.connect();
  return client;
}
