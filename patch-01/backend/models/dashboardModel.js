const pool = require("../config/db");

async function fetchTotalSales(salesmen) {
  const query = salesmen 
    ? "SELECT COALESCE(SUM(netto), 0) AS total_sales FROM fact_sales WHERE nama_salesman IN (?)" 
    : "SELECT COALESCE(SUM(netto), 0) AS total_sales FROM fact_sales";
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows[0].total_sales;
}

async function fetchTotalTransactions(salesmen) {
  const query = salesmen 
    ? "SELECT COUNT(DISTINCT nofaktur) AS total_transactions FROM fact_sales WHERE nama_salesman IN (?)" 
    : "SELECT COUNT(DISTINCT nofaktur) AS total_transactions FROM fact_sales";
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows[0].total_transactions;
}

async function fetchTotalQtyWeight(salesmen) {
  const query = `
    SELECT COALESCE(SUM(f.qty * COALESCE(p.berat, 1.0)), 0) AS total_weight_kg 
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    ${salesmen ? "WHERE f.nama_salesman IN (?)" : ""}
  `;
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows[0].total_weight_kg;
}

async function fetchBestSellerProducts(salesmen, limit = 10) {
  const query = `
    SELECT
      COALESCE(p.nama_produk, f.nama_barang) AS nama_produk,
      COALESCE(p.kode_produk, f.kode_barang) AS kode_produk,
      COALESCE(SUM(f.netto), 0) AS total_sales,
      COALESCE(SUM(f.qty), 0) AS total_quantity
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    ${salesmen ? "WHERE f.nama_salesman IN (?)" : ""}
    GROUP BY COALESCE(p.nama_produk, f.nama_barang), COALESCE(p.kode_produk, f.kode_barang)
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
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    ${salesmen ? "WHERE f.nama_salesman IN (?)" : ""}
    GROUP BY COALESCE(p.kategori, 'UNKNOWN')
    ORDER BY total_sales DESC
  `;
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows;
}

async function fetchSalesByValue(salesmen) {
  const query = `
    SELECT
      MONTH(tanggal) AS month_num,
      COALESCE(SUM(netto), 0) AS total_sales
    FROM fact_sales
    WHERE ${salesmen ? "nama_salesman IN (?) AND" : ""} tanggal IS NOT NULL
    GROUP BY MONTH(tanggal)
    ORDER BY month_num
  `;
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows;
}

async function fetchSalesPerSales(salesmen) {
  const query = `
    SELECT
      nama_salesman,
      COALESCE(SUM(netto), 0) AS total_penjualan
    FROM fact_sales
    ${salesmen ? "WHERE nama_salesman IN (?)" : ""}
    GROUP BY nama_salesman
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
