const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({ host:'127.0.0.1', user:'root', password:'', database:'iwpaint_optimized'});
  const tables = ['sales_transactions', 'products', 'customers', 'salesmen', 'supervisors', 'salesman_targets'];
  for (const t of tables) {
    console.log(`\n--- ${t} ---`);
    try {
      const [cols] = await pool.query(`DESCRIBE ${t}`);
      console.log(cols.map(c => `${c.Field} (${c.Type})`).join(', '));
    } catch(e) {
      console.log(`Error describing ${t}: ${e.message}`);
    }
  }
  process.exit(0);
}
run();
