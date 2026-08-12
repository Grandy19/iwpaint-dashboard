const mysql = require('mysql2/promise');

async function showTables() {
  const pool = mysql.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'iwpaint_optimized',
  });
  const [rows] = await pool.query('SHOW TABLES');
  console.log(rows);
  process.exit(0);
}

showTables().catch(err => {
  console.error(err);
  process.exit(1);
});
