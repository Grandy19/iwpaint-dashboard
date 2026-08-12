const pool = require('./config/db');

async function showTables() {
  const [rows] = await pool.query('SHOW TABLES');
  console.log(rows);
  process.exit(0);
}

showTables().catch(err => {
  console.error(err);
  process.exit(1);
});
