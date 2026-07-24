const pool = require('./db');

async function hasColumn(tableName, columnName) {
  const [rows] = await pool.query(
    `
      SELECT COUNT(*) AS total
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `,
    [tableName, columnName]
  );

  return Number(rows[0].total || 0) > 0;
}

async function ensureUploadLogColumns() {
  const columns = [
    { name: 'status', ddl: "ALTER TABLE upload_logs ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'success'" },
    { name: 'message', ddl: 'ALTER TABLE upload_logs ADD COLUMN message VARCHAR(255) NULL' },
    { name: 'total_rows', ddl: 'ALTER TABLE upload_logs ADD COLUMN total_rows INT NOT NULL DEFAULT 0' },
    { name: 'processed_rows', ddl: 'ALTER TABLE upload_logs ADD COLUMN processed_rows INT NOT NULL DEFAULT 0' }
  ];

  for (const col of columns) {
    const exists = await hasColumn('upload_logs', col.name);
    if (!exists) {
      await pool.query(col.ddl);
    }
  }
}

async function initSchemaAndSeed() {
  await ensureUploadLogColumns();

  // Drop users and targets to recreate with proper relations and seed data
  console.log('Recreating tables with new relations...');
  await pool.query('DROP TABLE IF EXISTS fact_targets');
  await pool.query('DROP TABLE IF EXISTS users');

  // Create users table
  await pool.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      name VARCHAR(150) NOT NULL,
      nomor_hp VARCHAR(20) NULL,
      alamat VARCHAR(255) NULL,
      area VARCHAR(100) NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'Aktif',
      supervisor_name VARCHAR(150) NULL,
      tanggal_bergabung DATE NULL,
      kode_salesman VARCHAR(20) NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kode_salesman) REFERENCES dim_salesman(kode_salesman) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

  // Create fact_targets table
  await pool.query(`
    CREATE TABLE fact_targets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kode_salesman VARCHAR(20) NOT NULL,
      tahun INT NOT NULL,
      bulan_nama VARCHAR(20) NOT NULL,
      target_deco DECIMAL(15,2) DEFAULT 0.00,
      target_auto DECIMAL(15,2) DEFAULT 0.00,
      target_ind DECIMAL(15,2) DEFAULT 0.00,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_sales_period (kode_salesman, tahun, bulan_nama),
      FOREIGN KEY (kode_salesman) REFERENCES dim_salesman(kode_salesman) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

  // Seed default users
  console.log('Seeding initial users...');
  const initialUsers = [
    // Admin
    ['admin', 'admin@iwpaint.com', 'password123', 'admin', 'Admin IW Paint', '081290922800', 'Office', 'All', 'Aktif', null, '2026-01-01', null],
    
    // Real Sales mapping from dim_salesman
    ['julianto123', 'julianto@gmail.com', 'password123', 'sales', 'JULIANTO', '081290922801', 'Bandung', 'Bandung', 'Aktif', 'Andi', '2026-01-12', 'G'],
    ['fransiskus45', 'fransiskus@gmail.com', 'password123', 'sales', 'FRANSISKUS', '081290922802', 'Bandung', 'Bandung', 'Aktif', 'Andi', '2026-02-15', 'J'],
    ['rudi_sales', 'rudi@gmail.com', 'password123', 'sales', 'RUDI *', '081290922803', 'Bandung', 'Bandung', 'Aktif', 'Andi', '2026-03-10', 'L'],
    ['depobdg', 'depobdg@gmail.com', 'password123', 'sales', 'DEPO BANDUNG', '081290922804', 'Bandung', 'Bandung', 'Aktif', 'Andi', '2026-04-05', '14'],
    
    ['ganis', 'ganis@gmail.com', 'password123', 'sales', 'GANIS', '081290922805', 'Cirebon', 'Cirebon', 'Aktif', 'Hartono', '2026-05-20', 'U'],
    ['keny123', 'keny@gmail.com', 'password123', 'sales', 'KEN - Y', '081290922806', 'Cirebon', 'Cirebon', 'Aktif', 'Hartono', '2026-06-01', 'Y'],
    ['simon', 'simon@gmail.com', 'password123', 'sales', 'SIMON QIRENE', '081290922807', 'Cirebon', 'Cirebon', 'Aktif', 'Hartono', '2026-07-15', 'R'],
    
    ['yonathan', 'yonathan@gmail.com', 'password123', 'sales', 'YONATHAN', '081290922808', 'Tasikmalaya', 'Tasikmalaya', 'Aktif', 'Rahmat', '2026-08-10', 'C'],
    ['willy', 'willy@gmail.com', 'password123', 'sales', 'WILLY', '081290922810', 'Tasikmalaya', 'Tasikmalaya', 'Aktif', 'Rahmat', '2026-08-11', 'D'],
    ['burini', 'burini@gmail.com', 'password123', 'sales', 'BU RINI', '081290922811', 'Tasikmalaya', 'Tasikmalaya', 'Aktif', 'Rahmat', '2026-08-12', '13'],
    
    ['yanseng123', 'yanseng@gmail.com', 'password123', 'sales', 'YANSENG', '081290922812', 'Jakarta', 'Jakarta', 'Aktif', 'Eka', '2026-08-13', 'H'],
    ['miming', 'miming@gmail.com', 'password123', 'sales', 'MIMING', '081290922813', 'Jakarta', 'Jakarta', 'Aktif', 'Eka', '2026-08-14', 'H1'],
    ['umum', 'umum@gmail.com', 'password123', 'sales', 'UMUM', '081290922814', 'Jakarta', 'Jakarta', 'Aktif', 'Eka', '2026-08-15', 'M'],
    ['bciang', 'bciang@gmail.com', 'password123', 'sales', 'B CIANG', '081290922815', 'Jakarta', 'Jakarta', 'Aktif', 'Eka', '2026-08-16', 'I'],

    // Supervisors
    ['andi', 'andi@gmail.com', 'password123', 'supervisor', 'Andi', '081290923456', 'Bandung', 'Bandung', 'Aktif', null, '2026-07-16', null],
    ['hartono', 'hartono@gmail.com', 'password123', 'supervisor', 'Hartono', '081290923456', 'Cirebon', 'Cirebon', 'Aktif', null, '2026-07-16', null],
    ['deni', 'deni@gmail.com', 'password123', 'supervisor', 'Deni', '081290923456', 'Kuningan', 'Kuningan', 'Aktif', null, '2026-07-16', null],
    ['rahmat', 'rahmat@gmail.com', 'password123', 'supervisor', 'Rahmat', '081290923456', 'Tasikmalaya', 'Tasikmalaya', 'Aktif', null, '2026-07-15', null],
    ['dudu', 'dudu@gmail.com', 'password123', 'supervisor', 'Dudu', '081290923456', 'Bogor', 'Bogor', 'Aktif', null, '2026-07-15', null],
    ['eka', 'eka@gmail.com', 'password123', 'supervisor', 'Eka', '081290923456', 'Jakarta', 'Jakarta', 'Aktif', null, '2026-07-14', null],
    
    // Distributors
    ['bambang', 'bambang@gmail.com', 'password123', 'distributor', 'Bambang', '089567182781', 'Bandung', 'Jawa Barat', 'Aktif', null, '2026-07-16', null],
    ['hendra_dist', 'hendra@gmail.com', 'password123', 'distributor', 'Hendra', '089567182781', 'Semarang', 'Jawa Tengah', 'Aktif', null, '2026-07-16', null],
    ['dedi', 'dedi@gmail.com', 'password123', 'distributor', 'Dedi', '089567182781', 'Surabaya', 'Jawa Timur', 'Aktif', null, '2026-07-16', null],
    ['anton', 'anton@gmail.com', 'password123', 'distributor', 'Anton', '089567182781', 'Medan', 'Sumatera', 'Aktif', null, '2026-07-15', null],
    ['gery', 'gery@gmail.com', 'password123', 'distributor', 'Gery', '089567182781', 'Jakarta', 'DKI Jakarta', 'Aktif', null, '2026-07-15', null]
  ];

  for (const u of initialUsers) {
    await pool.query(
      `INSERT INTO users (username, email, password, role, name, nomor_hp, alamat, area, status, supervisor_name, tanggal_bergabung, kode_salesman) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      u
    );
  }

  // Seed default targets
  console.log('Seeding initial targets...');
  const initialTargets = [
    ['G', 2026, 'Juli', 200000000.00, 80000000.00, 50000000.00],
    ['J', 2026, 'Juli', 180000000.00, 70000000.00, 48000000.00],
    ['L', 2026, 'Juli', 160000000.00, 60000000.00, 43000000.00],
    ['14', 2026, 'Juli', 130000000.00, 57000000.00, 40000000.00],
    ['U', 2026, 'Juli', 210000000.00, 90000000.00, 60000000.00],
    ['Y', 2026, 'Juli', 150000000.00, 50000000.00, 35000000.00],
    ['R', 2026, 'Juli', 170000000.00, 55000000.00, 38000000.00],
    ['H', 2026, 'Juli', 250000000.00, 100000000.00, 75000000.00]
  ];

  for (const t of initialTargets) {
    await pool.query(
      `INSERT INTO fact_targets (kode_salesman, tahun, bulan_nama, target_deco, target_auto, target_ind) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      t
    );
  }
}

module.exports = {
  ensureUploadLogColumns
};
