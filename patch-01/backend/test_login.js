const pool = require('./config/db');

async function test() {
  try {
    const email = 'fransiskus@gmail.com';
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1", [email, email]);
    console.log("Query with exactly 'fransiskus@gmail.com':", rows.length > 0 ? "FOUND" : "NOT FOUND");
    
    // Let's also check if there are any trailing spaces in the DB
    const [all] = await pool.query("SELECT id, username, email FROM users WHERE id = 3");
    console.log("Raw row 3:", all[0]);
    console.log("Email length in DB:", all[0].email.length);
    console.log("Email bytes:", Buffer.from(all[0].email));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

test();
