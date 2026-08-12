require('dotenv').config();
const pool = require('./config/db');

async function test() {
  try {
    const [rows] = await pool.query(`
      SELECT u.user_id, u.name, sup.area, sup_user.name as supervisor_name, s.kode_salesman, s.salesman_id
      FROM users u
      JOIN salesmen s ON u.user_id = s.salesman_id
      JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      WHERE u.name = 'FRANSISKUS'
    `);
    console.log('Query result:', rows);
    
    // Check if targets exist
    if (rows.length > 0) {
      const [targets] = await pool.query(`SELECT * FROM salesman_targets WHERE salesman_id = ?`, [rows[0].salesman_id]);
      console.log('Targets:', targets);
    }
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}
test();
