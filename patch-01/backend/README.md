# Dashboard Monitoring Penjualan - IWPAINT

Aplikasi dashboard interaktif berbasis web untuk mengimpor, memproses, menyimpan, dan memvisualisasikan data keuangan penjualan produk. Dibangun menggunakan stack modern **Node.js + Express + MySQL** di backend dan **Tailwind CSS + Chart.js** di frontend.

---

## Fitur Utama

### 1. Modul Import Data (\`/import\`)
- Mendukung berkas dengan format **CSV** dan **XLSX**.
- Melakukan pembersihan data otomatis: baris bermasalah di-skip, dan baris dengan nilai retur (QTY negatif) diabaikan secara aman.
- Menyimpan riwayat berkas yang berhasil diimpor beserta log status pemrosesan.

### 2. Dashboard Utama (\`/dashboard\` atau \`/\`)
- **KPI Metrics**: 
  - **Total Penjualan (Rp)**: Akumulasi nilai penjualan bersih (\`netto\`).
  - **Total Qty Terjual (Kg)**: Berat penjualan total yang dikonversi dari satuan kemasan produk (KLG=1kg, GLN=5kg, PAIL=20kg, PCS=1kg, JRG=5kg, BKS=1kg, DRUM=250kg, ZAK=20kg, GR=0,001kg, LT=1,2kg, TUBE=0,05kg).
  - **Total Transaksi**: Jumlah transaksi unik berdasarkan kolom \`NOFAKTUR\`.
- **Visualisasi Dinamis**:
  - Donut Chart Distribusi Penjualan per Kategori Produk.
  - Line Chart Tren Penjualan bulanan.
  - Bar Chart Top 10 Salesman Terbaik.
  - Tabel Top 10 Produk Terlaris.

### 3. Dashboard Sales Baru (\`/sales\`)
Memiliki **Mode Ganda Interaktif**:
- **Mode Semua Sales (Agregat)**:
  - KPI ringkasan total penjualan, total Qty berat terakumulasi, dan total transaksi unik.
  - Grafik Kontribusi Penjualan per Sales (Donut Chart ukuran besar \`360px\`).
  - Tabel Top 10 Salesman Terbaik berdasarkan perolehan penjualan.
  - Tren bulanan performa sales.
- **Mode Sales Spesifik (Filter Individu)**:
  - KPI Tambahan: **Customer yang Dilayani** (jumlah customer unik).
  - Grafik Kontribusi Penjualan per Customer milik salesman bersangkutan.
  - Grafik Tren Pembelian per bulan.
  - List Top 10 Produk Terlaris Sales.
  - **Tabel Transaksi Sales** detail (tanggal, nomor faktur, nama customer, produk, QTY, satuan, dan total rupiah).

### 4. Perbaikan Kestabilan Layout & Memori
- Menggunakan mekanisme daur hidup Chart.js dinamis (menghancurkan objek grafik lama via \`.destroy()\` saat beralih tampilan).
- Mengamankan kanvas grafik di dalam pembungkus non-flex bertinggi tetap (\`class="h-[180px] w-full relative"\` untuk detail, dan \`h-[360px]\` untuk agregat). Ini membatasi ukuran kanvas secara rigid dan menghentikan loop layout secara permanen.

---

## Struktur Proyek

```text
├── config/
│   ├── db.js                # Koneksi MySQL pool menggunakan promise
│   └── initDb.js            # Inisialisasi/penyesuaian skema database
├── controllers/
│   ├── dashboardController.js
│   ├── importController.js
│   └── salesController.js
├── routes/
│   ├── dashboardRoutes.js
│   ├── importRoutes.js
│   └── salesRoutes.js
├── migrations/              # Berkas migrasi database
├── tools/                   # Skrip utilitas database pengembang
├── uploads/                 # Folder tempat berkas import disimpan sementara
├── dashboard.html           # UI Dashboard Utama
├── import.html              # UI Import Data
├── sales.html               # UI Dashboard Sales baru (Mode Ganda)
├── server.js                # Titik masuk utama aplikasi (Express server)
├── package.json
└── README.md
```

---

## Petunjuk Penggunaan (Setup)

1. **Salin Environment Variables**:
   Salin berkas \`.env.example\` menjadi \`.env\` lalu sesuaikan kredensial MySQL Anda:
   \`\`\`env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=iwpaint
   PORT=3000
   \`\`\`

2. **Inisialisasi Database**:
   Import berkas SQL yang disediakan (misal \`localhost.sql\`) ke database MySQL Anda.

3. **Install Dependensi**:
   \`\`\`bash
   npm install
   \`\`\`

4. **Jalankan Aplikasi**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Aplikasi akan aktif di alamat [http://localhost:3000](http://localhost:3000).

---

## Endpoint API

### 1. Dashboard Utama (\`/api/dashboard\`)
- \`GET /total-sales\` - Total nilai penjualan bersih (Rp)
- \`GET /total-qty\` - Total Qty berat terjual (Kg)
- \`GET /total-transactions\` - Total transaksi unik
- \`GET /best-seller-products\` - Daftar produk terlaris
- \`GET /contribution-by-distributor\` - Kontribusi per kategori
- \`GET /sales-by-value\` - Tren bulanan penjualan
- \`GET /sales-per-sales\` - Performa penjualan per salesman

### 2. Dashboard Sales (\`/api/sales\`)
- \`GET /list\` - Daftar salesman unik untuk filter
- \`GET /kpis\` - Metrik KPI (Total Sales, Berat Kg, Transaksi, Jumlah Customer)
- \`GET /contribution\` - Kontribusi kategori atau customer
- \`GET /trend\` - Tren bulanan penjualan/pembelian
- \`GET /top-products\` - Top 10 produk terlaris sales
- \`GET /top-salesmen\` - Top 10 salesman berdasarkan penjualan
- \`GET /transactions\` - Daftar transaksi individual per salesman

### 3. Modul Import (\`/api\`)
- \`POST /import\` - Unggah berkas Excel/CSV
- \`GET /import-history\` - Riwayat impor data
- \`GET /health\` - Health check status koneksi database
