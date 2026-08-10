const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'iwpaint2'
  });

  const [targets] = await connection.query(`
    SELECT t.target_id, u.name AS salesman_name, t.tahun, t.bulan_nama, t.target_deco, t.target_auto, t.target_ind
    FROM salesman_targets t
    JOIN users u ON u.user_id = t.salesman_id
  `);
  console.log('--- ALL SEEDED SALESMAN TARGETS ---');
  console.log(targets);
  await connection.end();
}
run().catch(console.error);
