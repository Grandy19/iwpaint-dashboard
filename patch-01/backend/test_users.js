const pool = require('./config/db');

async function test() {
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE role = 'sales'");
    console.log(rows);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

test();
