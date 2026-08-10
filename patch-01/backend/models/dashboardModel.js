const pool = require("../config/db");

async function fetchTotalSales(salesmen) {
  const query = salesmen 
    ? `SELECT COALESCE(SUM(f.netto), 0) AS total_sales 
       FROM sales_transactions f
       JOIN salesmen s ON s.salesman_id = f.salesman_id
       JOIN users u ON u.user_id = s.salesman_id
       WHERE u.name IN (?)`
    : "SELECT COALESCE(SUM(netto), 0) AS total_sales FROM sales_transactions";
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows[0].total_sales;
}

async function fetchTotalTransactions(salesmen) {
  const query = salesmen 
    ? `SELECT COUNT(DISTINCT f.nofaktur) AS total_transactions 
       FROM sales_transactions f
       JOIN salesmen s ON s.salesman_id = f.salesman_id
       JOIN users u ON u.user_id = s.salesman_id
       WHERE u.name IN (?)`
    : "SELECT COUNT(DISTINCT nofaktur) AS total_transactions FROM sales_transactions";
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows[0].total_transactions;
}

async function fetchTotalQtyWeight(salesmen) {
  const query = `
    SELECT COALESCE(SUM(f.qty * COALESCE(p.berat, 1.0)), 0) AS total_weight_kg 
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    ${salesmen ? "JOIN salesmen s ON s.salesman_id = f.salesman_id JOIN users u ON u.user_id = s.salesman_id WHERE u.name IN (?)" : ""}
  `;
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows[0].total_weight_kg;
}

async function fetchBestSellerProducts(salesmen, limit = 10) {
  const query = `
    SELECT
      p.nama_produk AS nama_produk,
      p.kode_produk AS kode_produk,
      COALESCE(SUM(f.netto), 0) AS total_sales,
      COALESCE(SUM(f.qty), 0) AS total_quantity
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    ${salesmen ? "JOIN salesmen s ON s.salesman_id = f.salesman_id JOIN users u ON u.user_id = s.salesman_id WHERE u.name IN (?)" : ""}
    GROUP BY p.product_id, p.nama_produk, p.kode_produk
    ORDER BY total_sales DESC
    LIMIT ?
  `;
  const params = salesmen ? [salesmen, limit] : [limit];
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchContributionByDistributor(salesmen) {
  const query = `
    SELECT
      COALESCE(p.kategori, 'UNKNOWN') AS kategori,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    ${salesmen ? "JOIN salesmen s ON s.salesman_id = f.salesman_id JOIN users u ON u.user_id = s.salesman_id WHERE u.name IN (?)" : ""}
    GROUP BY COALESCE(p.kategori, 'UNKNOWN')
    ORDER BY total_sales DESC
  `;
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows;
}

async function fetchSalesByValue(salesmen) {
  const query = `
    SELECT
      MONTH(f.tanggal) AS month_num,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM sales_transactions f
    ${salesmen ? "JOIN salesmen s ON s.salesman_id = f.salesman_id JOIN users u ON u.user_id = s.salesman_id WHERE u.name IN (?) AND" : "WHERE"} f.tanggal IS NOT NULL
    GROUP BY MONTH(f.tanggal)
    ORDER BY month_num
  `;
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows;
}

async function fetchSalesPerSales(salesmen) {
  const query = `
    SELECT
      u.name AS nama_salesman,
      COALESCE(SUM(f.netto), 0) AS total_penjualan
    FROM sales_transactions f
    JOIN salesmen s ON s.salesman_id = f.salesman_id
    JOIN users u ON u.user_id = s.salesman_id
    ${salesmen ? "WHERE u.name IN (?)" : ""}
    GROUP BY u.user_id, u.name
    ORDER BY total_penjualan DESC
  `;
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows;
}

module.exports = {
  fetchTotalSales,
  fetchTotalTransactions,
  fetchTotalQtyWeight,
  fetchBestSellerProducts,
  fetchContributionByDistributor,
  fetchSalesByValue,
  fetchSalesPerSales,
};
