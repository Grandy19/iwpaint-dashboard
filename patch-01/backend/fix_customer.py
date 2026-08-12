import os

controller_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\customerController.js"

content = """const pool = require("../config/db");

async function getCustomers(req, res, next) {
  try {
    const { area, salesName, customerName, supervisor, periodeAwal, periodeAkhir } = req.query;

    let sql = `
      SELECT 
        c.nama_customer AS namaCustomer,
        c.kode_customer AS kodeCustomer,
        u.name AS sales,
        sup.area AS area,
        COUNT(DISTINCT f.nofaktur) AS totalTransaksi,
        SUM(f.netto) AS totalPenjualan,
        SUM(f.qty * COALESCE(p.berat, 1.0)) AS totalQty,
        MAX(f.tanggal) AS transaksiTerakhir,
        MAX(c.alamat_customer) AS alamat
      FROM sales_transactions f
      LEFT JOIN customers c ON c.customer_id = f.customer_id
      LEFT JOIN users u ON u.user_id = f.salesman_id
      LEFT JOIN salesmen s ON u.user_id = s.salesman_id
      LEFT JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      LEFT JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      LEFT JOIN products p ON p.product_id = f.product_id
      WHERE 1=1
    `;
    const params = [];

    if (customerName && customerName !== "Semua Customer") {
      sql += " AND c.nama_customer = ?";
      params.push(customerName);
    }
    if (salesName && salesName !== "Semua Sales") {
      sql += " AND u.name = ?";
      params.push(salesName);
    }
    if (supervisor && supervisor !== "Semua Supervisor") {
      sql += " AND sup_user.name = ?";
      params.push(supervisor);
    }
    if (periodeAwal) {
      sql += " AND DATE(f.tanggal) >= ?";
      params.push(periodeAwal);
    }
    if (periodeAkhir) {
      sql += " AND DATE(f.tanggal) <= ?";
      params.push(periodeAkhir);
    }

    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      
      sql += " AND sup.area IN (?)";
      params.push(matchedAreas);
    }

    sql += " GROUP BY c.nama_customer, c.kode_customer, u.name, sup.area";
    sql += " ORDER BY totalPenjualan DESC";

    const [rows] = await pool.query(sql, params);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

async function getCustomerKPIs(req, res, next) {
  try {
    const { area, supervisor, salesName, periodeAwal, periodeAkhir } = req.query;

    let sql = `
      SELECT 
        COUNT(DISTINCT f.customer_id) as totalCustomers,
        COUNT(DISTINCT f.nofaktur) as totalTransaksi,
        SUM(f.netto) as totalPenjualan,
        SUM(f.qty * COALESCE(p.berat, 1.0)) as totalQty
      FROM sales_transactions f
      LEFT JOIN users u ON u.user_id = f.salesman_id
      LEFT JOIN salesmen s ON u.user_id = s.salesman_id
      LEFT JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      LEFT JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      LEFT JOIN products p ON p.product_id = f.product_id
      WHERE 1=1
    `;
    const params = [];

    if (salesName && salesName !== "Semua Sales") {
      sql += " AND u.name = ?";
      params.push(salesName);
    }
    if (supervisor && supervisor !== "Semua Supervisor") {
      sql += " AND sup_user.name = ?";
      params.push(supervisor);
    }
    if (periodeAwal) {
      sql += " AND DATE(f.tanggal) >= ?";
      params.push(periodeAwal);
    }
    if (periodeAkhir) {
      sql += " AND DATE(f.tanggal) <= ?";
      params.push(periodeAkhir);
    }
    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      
      sql += " AND sup.area IN (?)";
      params.push(matchedAreas);
    }

    const [rows] = await pool.query(sql, params);
    res.json({
      totalCustomers: rows[0].totalCustomers || 0,
      totalTransaksi: rows[0].totalTransaksi || 0,
      totalPenjualan: rows[0].totalPenjualan || 0,
      totalQty: rows[0].totalQty || 0
    });
  } catch (err) {
    next(err);
  }
}

async function getCustomerList(req, res, next) {
  try {
    const { supervisor, area } = req.query;
    
    let sql = `
      SELECT DISTINCT c.nama_customer 
      FROM sales_transactions f
      LEFT JOIN customers c ON c.customer_id = f.customer_id
      LEFT JOIN salesmen s ON f.salesman_id = s.salesman_id
      LEFT JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      LEFT JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      WHERE c.nama_customer IS NOT NULL
    `;
    const params = [];

    if (supervisor && supervisor !== "Semua Supervisor") {
      sql += " AND sup_user.name = ?";
      params.push(supervisor);
    }

    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      
      sql += " AND sup.area IN (?)";
      params.push(matchedAreas);
    }

    sql += " ORDER BY c.nama_customer ASC";

    const [rows] = await pool.query(sql, params);
    res.json({ data: rows.map(r => r.nama_customer) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCustomers,
  getCustomerKPIs,
  getCustomerList
};
"""

with open(controller_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated customerController.js")
