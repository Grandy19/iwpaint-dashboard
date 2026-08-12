const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({ host:'127.0.0.1', user:'root', password:'', database:'iwpaint_optimized'});
  const views = ['vw_penjualan_per_sales', 'vw_top10_produk'];
  for (const v of views) {
    console.log(`\n--- ${v} ---`);
    try {
      const [cols] = await pool.query(`SHOW CREATE VIEW ${v}`);
      console.log(cols[0]['Create View']);
    } catch(e) {
      console.log(`Error describing ${v}: ${e.message}`);
    }
  }
  process.exit(0);
}
run();
