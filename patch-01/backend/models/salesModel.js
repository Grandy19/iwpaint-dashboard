const pool = require("../config/db");

async function getSalesmenForFilter(salesman, supervisor, area) {
  if (salesman && salesman !== "Semua Sales") {
    return [salesman];
  }

  let query = "SELECT name, area FROM users WHERE role = 'sales'";
  const params = [];

  if (supervisor && supervisor !== "Semua Supervisor") {
    query += " AND supervisor_name = ?";
    params.push(supervisor);
  }

  const [salesUsers] = await pool.query(query, params);
  let names = salesUsers.map(u => u.name);

  if (area && area !== "Semua Area") {
    let matchedAreas = [area];
    if (area === "Jawa Barat") {
      matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
    } else if (area === "DKI Jakarta") {
      matchedAreas = ["Jakarta"];
    } else if (area === "Jawa Tengah") {
      matchedAreas = ["Semarang"];
    } else if (area === "Jawa Timur") {
      matchedAreas = ["Surabaya"];
    } else if (area === "Sumatera") {
      matchedAreas = ["Medan"];
    }

    names = salesUsers
      .filter(u => matchedAreas.includes(u.area))
      .map(u => u.name);
  }

  return names.length > 0 ? names : ["__NONE__"];
}

async function fetchSalesmenList(supervisor, area) {
  let query = "SELECT name FROM users WHERE role = 'sales'";
  const params = [];

  if (supervisor && supervisor !== "Semua Supervisor") {
    query += " AND supervisor_name = ?";
    params.push(supervisor);
  }

  if (area && area !== "Semua Area") {
    let matchedAreas = [area];
    if (area === "Jawa Barat") {
      matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
    } else if (area === "DKI Jakarta") {
      matchedAreas = ["Jakarta"];
    } else if (area === "Jawa Tengah") {
      matchedAreas = ["Semarang"];
    } else if (area === "Jawa Timur") {
      matchedAreas = ["Surabaya"];
    } else if (area === "Sumatera") {
      matchedAreas = ["Medan"];
    }
    query += " AND area IN (?)";
    params.push(matchedAreas);
  }

  query += " ORDER BY name ASC";
  const [rows] = await pool.query(query, params);
  return rows.map(r => r.name);
}

async function fetchSalesKpis(salesmen, filters = {}) {
  let query = `
    SELECT 
      COALESCE(SUM(f.netto), 0) AS total_sales,
      COALESCE(SUM(f.qty * COALESCE(p.berat, 1.0)), 0) AS total_weight_kg,
      COUNT(DISTINCT f.nofaktur) AS total_transactions,
      COUNT(DISTINCT f.namacustomer) AS total_customers
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    WHERE f.nama_salesman IN (?)
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
    params.push(filters.kategori);
  }

  const [rows] = await pool.query(query, params);
  return rows[0];
}

async function fetchSalesContribution(salesmen, filters = {}) {
  let query = `
    SELECT
      COALESCE(p.kategori, 'UNKNOWN') AS kategori,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    WHERE f.nama_salesman IN (?)
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
    params.push(filters.kategori);
  }

  query += " GROUP BY COALESCE(p.kategori, 'UNKNOWN') ORDER BY total_sales DESC";
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchSalesTrend(salesmen, filters = {}) {
  let dateSelect = "MONTH(f.tanggal) AS group_val";
  let groupBy = "MONTH(f.tanggal)";
  let orderBy = "group_val";

  if (filters.periode === 'Hari') {
    dateSelect = "DATE_FORMAT(f.tanggal, '%d/%m/%Y') AS group_val, f.tanggal AS sort_val";
    groupBy = "DATE_FORMAT(f.tanggal, '%d/%m/%Y'), f.tanggal";
    orderBy = "sort_val";
  } else if (filters.periode === 'Tahun') {
    dateSelect = "YEAR(f.tanggal) AS group_val";
    groupBy = "YEAR(f.tanggal)";
    orderBy = "group_val";
  }

  let valueSelect = "COALESCE(SUM(f.netto), 0) AS value";
  if (filters.jenisData === 'Total Qty') {
    valueSelect = "COALESCE(SUM(f.qty * COALESCE(p.berat, 1.0)), 0) AS value";
  }

  let query = `
    SELECT
      ${dateSelect},
      ${valueSelect}
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    WHERE f.nama_salesman IN (?) AND f.tanggal IS NOT NULL
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
    params.push(filters.kategori);
  }
  if (filters.customerName) {
    query += " AND f.namacustomer = ?";
    params.push(filters.customerName);
  }

  query += ` GROUP BY ${groupBy} ORDER BY ${orderBy}`;
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchSalesTopProducts(salesmen, filters = {}) {
  let query = `
    SELECT
      f.nama_barang AS nama_produk,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    WHERE f.nama_salesman IN (?)
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
    params.push(filters.kategori);
  }
  if (filters.customerName) {
    query += " AND f.namacustomer = ?";
    params.push(filters.customerName);
  }

  query += " GROUP BY f.nama_barang ORDER BY total_sales DESC LIMIT 10";
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchSalesTopSalesmen(salesmen, filters = {}) {
  let query = `
    SELECT
      f.kode_salesman,
      f.nama_salesman,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    WHERE f.nama_salesman IN (?)
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
    params.push(filters.kategori);
  }

  query += " GROUP BY f.kode_salesman, f.nama_salesman ORDER BY total_sales DESC LIMIT 10";
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchSalesTransactions(salesmen, filters = {}) {
  let query = `
    SELECT
      DATE_FORMAT(f.tanggal, '%Y-%m-%d') AS tanggal_formatted,
      f.nofaktur,
      f.namacustomer AS customer,
      f.nama_barang AS produk,
      f.qty,
      f.satuan_kecil AS satuan,
      f.netto AS total_penjualan
    FROM fact_sales f
    LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
    WHERE f.nama_salesman IN (?)
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
    params.push(filters.kategori);
  }

  query += " ORDER BY f.tanggal DESC, f.nofaktur DESC LIMIT 100";
  
  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = {
  getSalesmenForFilter,
  fetchSalesmenList,
  fetchSalesKpis,
  fetchSalesContribution,
  fetchSalesTrend,
  fetchSalesTopProducts,
  fetchSalesTopSalesmen,
  fetchSalesTransactions,
};
