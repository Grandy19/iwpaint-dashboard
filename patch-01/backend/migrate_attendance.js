const mysql = require('mysql2/promise');
async function run() {
  const pool = mysql.createPool({ host:'127.0.0.1', user:'root', password:'', database:'iwpaint_optimized'});
  
  try {
    await pool.query('ALTER TABLE users ADD COLUMN last_activity DATETIME NULL');
    console.log('Added last_activity to users');
  } catch(e) {
    if(e.code === 'ER_DUP_FIELDNAME') console.log('last_activity already exists');
    else console.log('Error adding last_activity:', e.message);
  }

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        login_time DATETIME NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
      )
    `);
    console.log('Created attendance_logs table');
  } catch(e) {
    console.log('Error creating attendance_logs:', e.message);
  }

  process.exit(0);
}
run();
