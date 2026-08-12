const mysql = require('mysql2/promise');

async function checkSchema() {
  const pool1 = mysql.createPool({ host: '127.0.0.1', user: 'root', password: '', database: 'iwpaint' });
  const pool2 = mysql.createPool({ host: '127.0.0.1', user: 'root', password: '', database: 'iwpaint_optimized' });

  try {
    const [factSales] = await pool1.query('DESCRIBE fact_sales');
    console.log('--- iwpaint.fact_sales ---');
    console.log(factSales.map(r => `${r.Field} (${r.Type})`).join(', '));
  } catch (e) {
    console.log('Error describing fact_sales:', e.message);
  }

  try {
    const [salesTx] = await pool2.query('DESCRIBE sales_transactions');
    console.log('\n--- iwpaint_optimized.sales_transactions ---');
    console.log(salesTx.map(r => `${r.Field} (${r.Type})`).join(', '));
  } catch (e) {
    console.log('Error describing sales_transactions:', e.message);
  }

  try {
    const [factSalesOpt] = await pool2.query('DESCRIBE fact_sales');
    console.log('\n--- iwpaint_optimized.fact_sales ---');
    console.log('It exists!');
  } catch (e) {
    console.log('\nError describing iwpaint_optimized.fact_sales:', e.message);
  }

  process.exit(0);
}

checkSchema();
