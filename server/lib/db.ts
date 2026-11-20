import pg from 'pg';
import 'dotenv/config';

const { Pool, types } = pg;

// Parse BIGINT (OID 20) sebagai number, bukan string
types.setTypeParser(20, (val: string) => parseInt(val, 10));
// Parse NUMERIC (OID 1700) sebagai float
types.setTypeParser(1700, (val: string) => parseFloat(val));

let poolInstance: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!poolInstance) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required.');
    }
    poolInstance = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    poolInstance.on('error', (err) => {
      console.error('Database pool error:', err.message);
    });
  }
  return poolInstance;
}

export const pool = {
  query: (text: string, params?: any[]) => getPool().query(text, params),
  connect: () => getPool().connect(),
  on: (event: string, listener: (...args: any[]) => void) => getPool().on(event, listener),
} as unknown as pg.Pool;

/** Helper: execute parameterized query */
export async function query(text: string, params?: any[]) {
  try {
    return await getPool().query(text, params);
  } catch (error: any) {
    console.error('DB query error:', error.message);
    throw error;
  }
}

/** Helper: get a client for transactions */
export async function getClient() {
  const client = await getPool().connect();
  return client;
}
