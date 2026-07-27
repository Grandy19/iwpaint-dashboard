const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'iwpaint',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Disable ONLY_FULL_GROUP_BY for current session to support legacy view aggregations
pool.on('connection', (connection) => {
  connection.query("SET SESSION sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))", (err) => {
    if (err) {
      console.warn("Failed to modify sql_mode on connection:", err.message);
    }
  });
});

module.exports = pool;
