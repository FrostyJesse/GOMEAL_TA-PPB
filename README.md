# 🍱 GOMeal — Aplikasi Pemesanan Makanan
> *"Good Food, Good Mood!"*

GOMeal adalah aplikasi pemesanan makanan modern berbasis web (PWA-ready) dengan pendekatan *mobile-first*. Pengguna dapat menjelajahi aneka menu makanan lezat, melihat rincian bahan dan stok, menambahkan makanan ke keranjang belanja, melakukan checkout dengan berbagai metode pembayaran, serta memantau riwayat dan status pesanan secara real-time.

Aplikasi ini dibangun menggunakan arsitektur **Full-Stack** (React + Express.js) dengan database **PostgreSQL di Supabase Cloud**, dirancang dengan sistem warna bertema kuliner yang hangat (*Yellow, Orange, Green, Cream, Dark Brown*).

---

## 🎨 Color Palette & Identitas Desain

| Warna | Hex Code | Fungsi / Penerapan |
|---|---|---|
| **Yellow** | `#F6C445` | Identitas brand utama, highlight kategori, aksen visual |
| **Orange** | `#F05A28` | Tombol CTA ("Pesan Sekarang", "Tambah Keranjang", "Checkout"), badge penting |
| **Green** | `#8BC34A` | Label ketersediaan, status pesanan selesai, diskon |
| **Cream** | `#FFF3D6` | Background aplikasi, section header, container card |
| **Dark Brown** | `#3B2F2F` | Teks utama, judul, ikon kontras |

---

## 🚀 Fitur Utama

1. **Beranda Interaktif (`/`)**
   - Header aplikasi dengan identitas GOMeal dan status login.
   - Search bar terintegrasi dengan filter pencarian nama makanan.
   - Hero banner promosi *"Perut Lapar? GOMeal Solusinya!"*.
   - Slider kategori makanan interaktif (*Makanan Berat, Ayam, Seafood, Mie, Snack, Minuman*).
   - Menu Terpopuler & Rekomendasi Pilihan langsung dari database Supabase.

2. **Katalog Menu Lengkap (`/menu`)**
   - Pencarian real-time berdasarkan nama dan deskripsi.
   - Filter instan berdasarkan kategori.
   - Pengurutan (*Sorting*) berdasarkan rating terpopuler, harga terendah, harga tertinggi, dan alfabet.
   - Pagination responsif dengan indikator loading skeleton dan empty state.

3. **Detail Makanan (`/menu/:id`)**
   - Tampilan foto makanan resolusi tinggi dengan object-fit cover.
   - Informasi harga, rating bintang, estimasi waktu persiapan, dan sisa stok.
   - Pengatur jumlah pesanan (+ / -).
   - Tombol "+ Keranjang" dan "Pesan Sekarang" (langsung menuju checkout).
   - Tombol simpan ke daftar Favorit.

4. **Keranjang Belanja (`/cart`)**
   - State management keranjang persisten (tersimpan di localStorage).
   - Penyesuaian kuantitas atau hapus item seketika.
   - Kalkulasi otomatis subtotal, ongkir flat Rp10.000, diskon 10% untuk pesanan di atas Rp100.000, dan total pembayaran.

5. **Checkout & Pembayaran (`/checkout`)**
   - Formulir pengiriman: Nama Penerima, Nomor Telepon/WhatsApp, Alamat Lengkap, dan Catatan Restoran.
   - Opsi metode pembayaran: *Cash on Delivery (COD)*, *Transfer Bank (Simulasi)*, dan *QRIS (Simulasi)*.
   - **Validasi Server-Side & Transaksi Atomik:** Memastikan stok diverifikasi di server, harga diambil langsung dari database (bukan dari client), dan stok berkurang secara atomik saat pesanan berhasil dibuat.

6. **Riwayat & Detail Pesanan (`/orders` & `/orders/:id`)**
   - Riwayat pesanan khusus milik pengguna yang sedang login.
   - Status pesanan dengan badge berwarna (*Menunggu Konfirmasi, Diproses, Sedang Diantar, Selesai, Dibatalkan*).
   - Progress bar / timeline 4 tahap pemrosesan pesanan.
   - Rincian snapshot harga dan nama makanan saat transaksi.
   - Fitur **Batalkan Pesanan** yang secara otomatis mengembalikan stok ke database.

7. **Sistem Favorit (`/favorites`)**
   - Pengguna dapat menandai makanan favorit yang tersinkronisasi ke database.

8. **Profil Pengguna (`/profile`)**
   - Menampilkan avatar, nama lengkap, email, nomor HP, dan alamat tersimpan.
   - Fitur edit dan perbarui profil secara langsung ke backend API.

9. **Tentang GOMeal (`/about`)**
   - Informasi lengkap visi aplikasi, arsitektur teknologi, versi, dan identitas pengembang.

10. **Autentikasi Mandiri (`/auth`)**
    - Sistem registrasi & login berbasis JSON Web Token (JWT) dengan enkripsi password menggunakan `bcryptjs`.

11. **Bottom Navigation Bar Reusable**
    - Navigasi 5 menu tetap di bagian bawah layar (*Beranda, Menu, Pesanan, Keranjang, Profil*).
    - Dilengkapi badge penghitung jumlah item keranjang belanja.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend:** React 18, TypeScript, Tailwind CSS, Vite
- **UI & Icons:** Lucide React, Radix UI (shadcn/ui), Framer Motion
- **State Management & Caching:** React Context API, TanStack React Query v5
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL (Supabase Cloud Database) dengan Connection Pooling (`pg`)
- **Keamanan:** JWT Authentication, Bcrypt Password Hashing, Helmet, Express Rate Limit, Zod Validation
- **PWA:** Vite Plugin PWA (Manifest & Service Worker)
- **Package Manager:** PNPM

---

## 📁 Struktur Direktori

```text
├── client/
│   ├── components/
│   │   ├── BottomNav.tsx        # Bottom Navigation Bar 5 menu utama
│   │   ├── Header.tsx           # Header aplikasi & navigasi desktop
│   │   ├── FoodCard.tsx         # Card item makanan
│   │   ├── CategoryCard.tsx     # Card kategori makanan
│   │   ├── OrderCard.tsx        # Card riwayat pesanan dengan status
│   │   ├── CartItem.tsx         # Item baris pada keranjang belanja
│   │   ├── SearchBar.tsx        # Input pencarian reusable
│   │   └── ui/                  # Komponen UI Radix & Tailwind
│   ├── context/
│   │   ├── AuthContext.tsx      # Manajemen state user & sesi JWT
│   │   ├── CartContext.tsx      # Manajemen state keranjang belanja
│   │   └── FavoritesContext.tsx # Manajemen state makanan favorit
│   ├── lib/
│   │   ├── api.ts               # Kumpulan fungsi pemanggil REST API
│   │   └── utils.ts             # Utility formatting & styling
│   ├── pages/
│   │   ├── Index.tsx            # Halaman 1: Beranda
│   │   ├── Menu.tsx             # Halaman 2: Katalog Menu
│   │   ├── MenuDetail.tsx       # Halaman 3: Detail Menu
│   │   ├── Orders.tsx           # Halaman 4: Riwayat Pesanan
│   │   ├── OrderDetail.tsx      # Halaman 5: Detail Pesanan
│   │   ├── Cart.tsx             # Halaman 6: Keranjang
│   │   ├── Checkout.tsx         # Halaman 7: Formulir Checkout
│   │   ├── Profile.tsx          # Halaman 8: Profil Pengguna
│   │   ├── About.tsx            # Halaman 9: Tentang GOMeal
│   │   ├── Auth.tsx             # Halaman Autentikasi (Masuk & Daftar)
│   │   └── Favorites.tsx        # Halaman Makanan Favorit
│   ├── App.tsx                  # Root router & provider configuration
│   └── global.css               # Tema warna GOMeal & font custom
├── server/
│   ├── lib/
│   │   └── db.ts                # Koneksi PostgreSQL (pg Pool) ke Supabase
│   ├── middleware/
│   │   └── auth.ts              # Middleware verifikasi JWT & RBAC admin
│   ├── routes/
│   │   ├── auth.ts              # Endpoint autentikasi (/api/auth)
│   │   ├── menu.ts              # Endpoint katalog menu (/api/v1/menu)
│   │   ├── categories.ts        # Endpoint kategori (/api/v1/categories)
│   │   ├── orders.ts            # Endpoint transaksi pesanan (/api/v1/orders)
│   │   ├── profile.ts           # Endpoint profil pengguna (/api/v1/profile)
│   │   └── favorites.ts         # Endpoint favorit (/api/v1/favorites)
│   └── index.ts                 # Express Server entrypoint
├── shared/
│   ├── schema.ts                # Schema Zod & TypeScript interfaces bersama
│   └── api.ts                   # Response types REST API
├── supabase/
│   ├── schema.sql               # Skema DDL tabel database
│   └── seed.sql                 # Data awal 10 menu & 6 kategori
├── scripts/
│   ├── migrate.js               # Runner migrasi DDL & Seed ke Supabase
│   └── test-api.ts              # Automated end-to-end integration test
├── .env.example                 # Template environment variables
├── package.json
└── vite.config.ts
```

---

## ⚙️ Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat
- Node.js versi 18 atau lebih baru.
- PNPM (atau jalankan melalui `npx pnpm`).

### 2. Instalasi Dependensi
```bash
pnpm install
```

### 3. Konfigurasi Environment Variables
Salin template file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Isi konfigurasi pada file `.env`:
```env
# Supabase PostgreSQL Connection String (Transaction pooler atau Session mode)
DATABASE_URL=postgresql://postgres.koewcsjyzostrqqbzaeg:Buni132006123@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres

# JWT Secret untuk pengamanan token autentikasi
JWT_SECRET=gomeal_secure_jwt_secret_2024_xK9mP2nQ7wR4tY6u
```

### 4. Menjalankan Migrasi & Mengisi Seed Data ke Supabase
Jalankan script migrasi otomatis untuk membuat tabel dan memasukkan 10 menu awal:
```bash
node scripts/migrate.js
```
*Output sukses:*
```text
✅ Koneksi PostgreSQL Berhasil!
✅ Skema tabel GOMeal berhasil dibuat!
✅ Seed data GOMeal berhasil dimasukkan!
📊 Status Database: 6 kategori, 10 menu makanan
```

### 5. Menjalankan Aplikasi Secara Lokal (Development)
```bash
pnpm dev
```
Aplikasi akan berjalan dan dapat diakses di browser pada:
`http://localhost:8080`

### 6. Menjalankan Pengujian Otomatis
- **Typecheck TypeScript:**
  ```bash
  pnpm typecheck
  ```
- **Unit Test (Vitest):**
  ```bash
  pnpm test
  ```
- **End-to-End API Test (15 Endpoint dengan database real):**
  ```bash
  npx tsx scripts/test-api.ts
  ```

### 7. Membangun Aplikasi untuk Produksi (Production Build)
```bash
pnpm build
```

---

## 📡 Daftar Endpoint REST API Backend

Seluruh data aplikasi diakses melalui backend Express.js mandiri:

| Method | Endpoint | Hak Akses | Deskripsi |
|---|---|---|---|
| `GET` | `/api/health` | Publik | Health check status server |
| `POST` | `/api/auth/register` | Publik | Registrasi akun pengguna baru |
| `POST` | `/api/auth/login` | Publik | Login & penerbitan token JWT |
| `GET` | `/api/auth/me` | User | Mengambil data akun yang sedang login |
| `GET` | `/api/v1/categories` | Publik | Mengambil daftar seluruh kategori |
| `GET` | `/api/v1/menu` | Publik | Katalog menu (filter kategori, search, sort, pagination) |
| `GET` | `/api/v1/menu/:id` | Publik | Detail lengkap satu makanan |
| `POST` | `/api/v1/menu` | Admin | Tambah menu makanan baru |
| `PUT` | `/api/v1/menu/:id` | Admin | Perbarui informasi menu makanan |
| `DELETE` | `/api/v1/menu/:id` | Admin | Hapus menu makanan |
| `GET` | `/api/v1/orders` | User | Riwayat pesanan milik pengguna |
| `GET` | `/api/v1/orders/:id` | User | Detail pesanan dan rincian item |
| `POST` | `/api/v1/orders` | User | Checkout pesanan (Validasi stok atomik) |
| `PATCH` | `/api/v1/orders/:id/cancel` | User | Batalkan pesanan & pulihkan stok |
| `GET` | `/api/v1/profile` | User | Mengambil informasi profil pengguna |
| `PUT` | `/api/v1/profile` | User | Memperbarui informasi profil pengguna |
| `GET` | `/api/v1/favorites` | User | Mengambil daftar makanan favorit pengguna |
| `POST` | `/api/v1/favorites` | User | Menambahkan makanan ke favorit |
| `DELETE` | `/api/v1/favorites/:menuId` | User | Menghapus makanan dari favorit |

---

## 🔒 Keamanan & Praktik Terbaik

- **Parameterized Queries:** Seluruh interaksi database menggunakan query parameter (`$1`, `$2`) untuk mencegah SQL Injection.
- **Isolasi Database:** Frontend tidak mengakses Supabase secara langsung; seluruh komunikasi melewati REST API Express.
- **Kerahasiaan Kredensial:** `.env` dikecualikan secara ketat pada `.gitignore`. Password hash disimpan menggunakan `bcryptjs` dan tidak pernah dikirimkan ke frontend.
- **Validasi Zod:** Seluruh input formulir dan request payload divalidasi ketat di sisi server.
- **Transaksi Basis Data:** Checkout order dieksekusi dalam blok `BEGIN ... COMMIT` dengan baris dikunci (`FOR UPDATE`) untuk menjamin konsistensi stok dan mencegah *race condition*.

---

*GOMeal — Aplikasi Pemesanan Makanan. Good Food, Good Mood!*
