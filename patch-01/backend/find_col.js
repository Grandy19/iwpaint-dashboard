const mysql = require('mysql2/promise');

async function findCol() {
  const pool = mysql.createPool({ host:'127.0.0.1', user:'root', password:''});
  const [dbs] = await pool.query('SHOW DATABASES');
  for (let db of dbs) {
    const dbName = db.Database;
    if (dbName === 'information_schema' || dbName === 'mysql' || dbName === 'performance_schema' || dbName === 'sys') continue;
    const [cols] = await pool.query(`SELECT TABLE_SCHEMA, TABLE_NAME FROM information_schema.COLUMNS WHERE COLUMN_NAME = 'nofaktur' AND TABLE_SCHEMA = '${dbName}'`);
    if(cols.length) console.log(cols);
  }
  process.exit(0);
}
findCol();
