import os

model_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\models\salesModel.js"
controller_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\salesController.js"

# Rewrite salesModel.js
model_content = """const pool = require("../config/db");

function mapKategoriDB(k) {
  if (!k) return k;
  const upper = k.toUpperCase();
  if (upper === 'INDUSTRI') return 'INDUSTRIAL';
  if (upper === 'AUTOMOTIVE') return 'AUTOMOTIVE';
  if (upper === 'DECORATIVE') return 'DECORATIVE';
  return upper;
}

async function getSalesmenForFilter(salesman, supervisor, area) {
  if (salesman && salesman !== "Semua Sales") {
    return [salesman];
  }

  let query = `
    SELECT u.name, sup.area 
    FROM users u 
    JOIN salesmen s ON u.user_id = s.salesman_id 
    JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id 
    JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
    WHERE u.role = 'sales'
  `;
  const params = [];

  if (supervisor && supervisor !== "Semua Supervisor") {
    query += " AND sup_user.name = ?";
    params.push(supervisor);
  }

  if (area && area !== "Semua Area") {
    let matchedAreas = [area];
    if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
    else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
    else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
    else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
    else if (area === "Sumatera") matchedAreas = ["Medan"];
    
    query += " AND sup.area IN (?)";
    params.push(matchedAreas);
  }

  const [salesUsers] = await pool.query(query, params);
  let names = salesUsers.map(u => u.name);

  return names.length > 0 ? names : ["__NONE__"];
}

async function fetchSalesmenList(supervisor, area) {
  let query = `
    SELECT u.name, sup.area 
    FROM users u 
    JOIN salesmen s ON u.user_id = s.salesman_id 
    JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id 
    JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
    WHERE u.role = 'sales'
  `;
  const params = [];

  if (supervisor && supervisor !== "Semua Supervisor") {
    query += " AND sup_user.name = ?";
    params.push(supervisor);
  }

  if (area && area !== "Semua Area") {
    let matchedAreas = [area];
    if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
    else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
    else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
    else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
    else if (area === "Sumatera") matchedAreas = ["Medan"];
    
    query += " AND sup.area IN (?)";
    params.push(matchedAreas);
  }

  query += " ORDER BY u.name ASC";
  const [rows] = await pool.query(query, params);
  return rows.map(r => r.name);
}

async function fetchSalesKpis(salesmen, filters = {}) {
  let query = `
    SELECT 
      COALESCE(SUM(f.netto), 0) AS total_sales,
      COALESCE(SUM(f.qty * COALESCE(p.berat, 1.0)), 0) AS total_weight_kg,
      COUNT(DISTINCT f.nofaktur) AS total_transactions,
      COUNT(DISTINCT f.customer_id) AS total_customers
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN users u ON u.user_id = f.salesman_id
    WHERE u.name IN (?)
  `;
  const params = [salesmen];

  if (filters.periodeAwal) {
    query += " AND f.tanggal >= ?";
    params.push(filters.periodeAwal);
  }
  if (filters.periodeAkhir) {
    query += " AND f.tanggal <= ?";
    params.push(filters.periodeAkhir);
  }
  if (filters.kategori) {
    query += " AND p.kategori = ?";
    params.push(mapKategoriDB(filters.kategori));
  }

  const [rows] = await pool.query(query, params);
  return rows[0] || { total_sales: 0, total_weight_kg: 0, total_transactions: 0, total_customers: 0 };
}

async function fetchContributionByIndustry(salesmen, filters = {}) {
  let query = `
    SELECT
      COALESCE(p.kategori, 'UNKNOWN') AS kategori,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN users u ON u.user_id = f.salesman_id
    WHERE u.name IN (?)
  `;
  const params = [salesmen];

  if (filters.periodeAwal) {
    query += " AND f.tanggal >= ?";
    params.push(filters.periodeAwal);
  }
  if (filters.periodeAkhir) {
    query += " AND f.tanggal <= ?";
    params.push(filters.periodeAkhir);
  }
  if (filters.kategori) {
    query += " AND p.kategori = ?";
    params.push(mapKategoriDB(filters.kategori));
  }

  query += " GROUP BY COALESCE(p.kategori, 'UNKNOWN') ORDER BY total_sales DESC";
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchTopProducts(salesmen, filters = {}, limit = 10) {
  let query = `
    SELECT
      p.nama_produk AS nama_produk,
      p.kode_produk AS kode_produk,
      COALESCE(SUM(f.netto), 0) AS total_sales,
      COALESCE(SUM(f.qty), 0) AS total_quantity
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN users u ON u.user_id = f.salesman_id
    WHERE u.name IN (?)
  `;
  const params = [salesmen];

  if (filters.periodeAwal) {
    query += " AND f.tanggal >= ?";
    params.push(filters.periodeAwal);
  }
  if (filters.periodeAkhir) {
    query += " AND f.tanggal <= ?";
    params.push(filters.periodeAkhir);
  }
  if (filters.kategori) {
    query += " AND p.kategori = ?";
    params.push(mapKategoriDB(filters.kategori));
  }

  query += `
    GROUP BY p.nama_produk, p.kode_produk
    ORDER BY total_sales DESC
    LIMIT ?
  `;
  params.push(limit);

  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchSalesTrend(salesmen, filters = {}) {
  let query = `
    SELECT
      MONTH(f.tanggal) AS group_val,
      COALESCE(SUM(f.netto), 0) AS value
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN users u ON u.user_id = f.salesman_id
    WHERE u.name IN (?) AND f.tanggal IS NOT NULL
  `;
  const params = [salesmen];

  if (filters.periodeAwal) {
    query += " AND f.tanggal >= ?";
    params.push(filters.periodeAwal);
  }
  if (filters.periodeAkhir) {
    query += " AND f.tanggal <= ?";
    params.push(filters.periodeAkhir);
  }
  if (filters.kategori) {
    query += " AND p.kategori = ?";
    params.push(mapKategoriDB(filters.kategori));
  }

  query += " GROUP BY MONTH(f.tanggal) ORDER BY group_val ASC";
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchCustomerTransactions(salesmen, filters = {}) {
  let query = `
    SELECT 
      f.tanggal,
      f.nofaktur AS noFaktur,
      c.nama_customer AS customer,
      p.nama_produk AS produk,
      f.qty,
      p.satuan_kecil AS satuan,
      f.netto AS totalPenjualan
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN customers c ON c.customer_id = f.customer_id
    LEFT JOIN users u ON u.user_id = f.salesman_id
    WHERE u.name IN (?)
  `;
  const params = [salesmen];

  if (filters.periodeAwal) {
    query += " AND f.tanggal >= ?";
    params.push(filters.periodeAwal);
  }
  if (filters.periodeAkhir) {
    query += " AND f.tanggal <= ?";
    params.push(filters.periodeAkhir);
  }
  if (filters.kategori) {
    query += " AND p.kategori = ?";
    params.push(mapKategoriDB(filters.kategori));
  }

  query += " ORDER BY f.tanggal DESC LIMIT 100";
  
  const [rows] = await pool.query(query, params);
  return rows.map(r => ({
    tanggal: new Date(r.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    noFaktur: r.noFaktur,
    customer: r.customer,
    produk: r.produk,
    qty: r.qty,
    satuan: r.satuan,
    totalPenjualan: r.totalPenjualan
  }));
}

async function getBestSalesmanLeaderboard(filters = {}) {
  let query = `
    SELECT
      u.name AS nama_salesman,
      sup.area,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM users u
    JOIN salesmen s ON u.user_id = s.salesman_id
    JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
    LEFT JOIN sales_transactions f ON u.user_id = f.salesman_id 
  `;
  const params = [];
  const conditions = ["u.role = 'sales'"];

  if (filters.periodeAwal) {
    conditions.push("f.tanggal >= ?");
    params.push(filters.periodeAwal);
  }
  if (filters.periodeAkhir) {
    conditions.push("f.tanggal <= ?");
    params.push(filters.periodeAkhir);
  }
  
  // NOTE: According to request 6: "jika lagi di filter ke kategori tertentu, pengambilan data leaderboard nya tetap berdasarkan semua kategori"
  // So we deliberately ignore filters.kategori here.

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " GROUP BY u.user_id, u.name, sup.area ORDER BY total_sales DESC LIMIT 3";
  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = {
  getSalesmenForFilter,
  fetchSalesmenList,
  fetchSalesKpis,
  fetchContributionByIndustry,
  fetchTopProducts,
  fetchSalesTrend,
  fetchCustomerTransactions,
  getBestSalesmanLeaderboard
};
"""

with open(model_path, "w", encoding="utf-8") as f:
    f.write(model_content)


print("Updated salesModel.js and salesController.js")
