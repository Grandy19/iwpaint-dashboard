const pool = require("../config/db");

function mapKategori(kat) {
  if (!kat || kat === "Semua Kategori") return null;
  const k = String(kat).toUpperCase().trim();
  if (k === "INDUSTRI" || k === "INDUSTRIAL") return "INDUSTRIAL";
  return k; // DECORATIVE, AUTOMOTIVE
}

async function getSalesmenForFilter(salesman, supervisor, area) {
  if (salesman && salesman !== "Semua Sales") {
    return [salesman];
  }

  let query = `
    SELECT u.name, sp.area 
    FROM users u
    JOIN salesmen s ON s.salesman_id = u.user_id
    LEFT JOIN supervisors sp ON sp.supervisor_id = s.supervisor_id
    WHERE u.role = 'sales'
  `;
  const params = [];

  if (supervisor && supervisor !== "Semua Supervisor") {
    query += " AND s.supervisor_id = (SELECT user_id FROM users WHERE name = ? AND role = 'supervisor' LIMIT 1)";
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
  let query = `
    SELECT u.name, sp.area 
    FROM users u
    JOIN salesmen s ON s.salesman_id = u.user_id
    LEFT JOIN supervisors sp ON sp.supervisor_id = s.supervisor_id
    WHERE u.role = 'sales'
  `;
  const params = [];

  if (supervisor && supervisor !== "Semua Supervisor") {
    query += " AND s.supervisor_id = (SELECT user_id FROM users WHERE name = ? AND role = 'supervisor' LIMIT 1)";
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
    query += " AND sp.area IN (?)";
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
      COUNT(DISTINCT c.nama_customer) AS total_customers
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN customers c ON c.customer_id = f.customer_id
    JOIN salesmen s ON s.salesman_id = f.salesman_id
    JOIN users u ON u.user_id = s.salesman_id
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
  const cleanKategori = mapKategori(filters.kategori);
  if (cleanKategori) {
    query += " AND p.kategori = ?";
    params.push(cleanKategori);
  }

  const [rows] = await pool.query(query, params);
  return rows[0];
}

async function fetchSalesContribution(salesmen, filters = {}) {
  let query = `
    SELECT
      COALESCE(p.kategori, 'UNKNOWN') AS kategori,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    JOIN salesmen s ON s.salesman_id = f.salesman_id
    JOIN users u ON u.user_id = s.salesman_id
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
  const cleanKategori = mapKategori(filters.kategori);
  if (cleanKategori) {
    query += " AND p.kategori = ?";
    params.push(cleanKategori);
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
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN customers c ON c.customer_id = f.customer_id
    JOIN salesmen s ON s.salesman_id = f.salesman_id
    JOIN users u ON u.user_id = s.salesman_id
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
  const cleanKategori = mapKategori(filters.kategori);
  if (cleanKategori) {
    query += " AND p.kategori = ?";
    params.push(cleanKategori);
  }
  if (filters.customerName) {
    query += " AND c.nama_customer = ?";
    params.push(filters.customerName);
  }

  query += ` GROUP BY ${groupBy} ORDER BY ${orderBy}`;
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchSalesTopProducts(salesmen, filters = {}) {
  let query = `
    SELECT
      p.nama_produk AS nama_produk,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN customers c ON c.customer_id = f.customer_id
    JOIN salesmen s ON s.salesman_id = f.salesman_id
    JOIN users u ON u.user_id = s.salesman_id
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
  const cleanKategori = mapKategori(filters.kategori);
  if (cleanKategori) {
    query += " AND p.kategori = ?";
    params.push(cleanKategori);
  }
  if (filters.customerName) {
    query += " AND c.nama_customer = ?";
    params.push(filters.customerName);
  }

  query += " GROUP BY p.product_id, p.nama_produk ORDER BY total_sales DESC LIMIT 10";
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchSalesTopSalesmen(salesmen, filters = {}) {
  let query = `
    SELECT
      s.kode_salesman,
      u.name AS nama_salesman,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    JOIN salesmen s ON s.salesman_id = f.salesman_id
    JOIN users u ON u.user_id = s.salesman_id
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
  const cleanKategori = mapKategori(filters.kategori);
  if (cleanKategori) {
    query += " AND p.kategori = ?";
    params.push(cleanKategori);
  }

  query += " GROUP BY s.kode_salesman, u.name ORDER BY total_sales DESC LIMIT 10";
  
  const [rows] = await pool.query(query, params);
  return rows;
}

async function fetchSalesTransactions(salesmen, filters = {}) {
  let query = `
    SELECT
      DATE_FORMAT(f.tanggal, '%Y-%m-%d') AS tanggal_formatted,
      f.nofaktur,
      c.nama_customer AS customer,
      p.nama_produk AS produk,
      f.qty,
      p.satuan_kecil AS satuan,
      f.netto AS total_penjualan
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN customers c ON c.customer_id = f.customer_id
    JOIN salesmen s ON s.salesman_id = f.salesman_id
    JOIN users u ON u.user_id = s.salesman_id
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
  const cleanKategori = mapKategori(filters.kategori);
  if (cleanKategori) {
    query += " AND p.kategori = ?";
    params.push(cleanKategori);
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
