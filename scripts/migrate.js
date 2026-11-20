import pg from 'pg';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

const { Client } = pg;

async function runMigration() {
  console.log('--- Memulai Migrasi Database Supabase GOMeal ---');
  
  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL tidak ditemukan di .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 15000,
  });

  try {
    console.log('Menghubungkan ke PostgreSQL Supabase...');
    await client.connect();
    console.log('✅ Koneksi PostgreSQL Berhasil!');

    // 1. Eksekusi schema.sql
    console.log('Menerapkan supabase/schema.sql...');
    const schemaSql = fs.readFileSync(path.resolve('./supabase/schema.sql'), 'utf8');
    await client.query(schemaSql);
    console.log('✅ Skema tabel GOMeal berhasil dibuat!');

    // 2. Eksekusi seed.sql
    console.log('Menerapkan supabase/seed.sql...');
    const seedSql = fs.readFileSync(path.resolve('./supabase/seed.sql'), 'utf8');
    await client.query(seedSql);
    console.log('✅ Seed data GOMeal berhasil dimasukkan!');

    // 3. Verifikasi jumlah data
    const categoriesCount = await client.query('SELECT COUNT(*) as count FROM categories');
    const menusCount = await client.query('SELECT COUNT(*) as count FROM menus');
    console.log(`📊 Status Database:`);
    console.log(`- Kategori: ${categoriesCount.rows[0].count} kategori`);
    console.log(`- Menu Makanan: ${menusCount.rows[0].count} item`);

    const menusList = await client.query('SELECT name, price, rating FROM menus LIMIT 5');
    console.log('Contoh 5 menu teratas:');
    menusList.rows.forEach((m, i) => console.log(`  ${i+1}. ${m.name} - Rp${Number(m.price).toLocaleString('id-ID')} (⭐ ${m.rating})`));

    console.log('🎉 Migrasi & Seed Selesai dengan Sukses!');
  } catch (error) {
    console.error('❌ Gagal menjalankan migrasi:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
