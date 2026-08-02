const pool = require("../config/db");

async function getCustomers(req, res, next) {
  try {
    const { area, salesName, customerName, supervisor, periodeAwal, periodeAkhir } = req.query;

    let sql = `
      SELECT 
        c.nama_customer AS namaCustomer,
        c.kode_customer AS kodeCustomer,
        u.name AS sales,
        COALESCE(sp.area, c.area) AS area,
        COUNT(DISTINCT f.nofaktur) AS totalTransaksi,
        SUM(f.netto) AS totalPenjualan,
        SUM(f.qty * COALESCE(p.berat, 1.0)) AS totalQty,
        MAX(f.tanggal) AS transaksiTerakhir,
        c.alamat_customer AS alamat
      FROM sales_transactions f
      JOIN customers c ON c.customer_id = f.customer_id
      LEFT JOIN salesmen s ON s.salesman_id = f.salesman_id
      LEFT JOIN users u ON u.user_id = s.salesman_id
      LEFT JOIN supervisors sp ON sp.supervisor_id = s.supervisor_id
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
      const [supRows] = await pool.query("SELECT user_id FROM users WHERE name = ? AND role = 'supervisor' LIMIT 1", [supervisor]);
      if (supRows.length > 0) {
        sql += " AND s.supervisor_id = ?";
        params.push(supRows[0].user_id);
      }
    }
    if (periodeAwal) {
      sql += " AND DATE(f.tanggal) >= ?";
      params.push(periodeAwal);
    }
    if (periodeAkhir) {
      sql += " AND DATE(f.tanggal) <= ?";
      params.push(periodeAkhir);
    }

    sql += " GROUP BY c.customer_id, c.nama_customer, c.kode_customer, u.name, COALESCE(sp.area, c.area), c.alamat_customer";

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
      sql += " HAVING area IN (?)";
      params.push(matchedAreas);
    }

    const [rows] = await pool.query(sql, params);

    const data = rows.map((r, index) => ({
      id: index + 1,
      namaCustomer: r.namaCustomer || "UNKNOWN",
      kodeCustomer: r.kodeCustomer || "F.000",
      sales: r.sales || "UNKNOWN",
      area: r.area || "-",
      totalTransaksi: String(r.totalTransaksi),
      totalPenjualan: r.totalPenjualan >= 1e6 ? `Rp ${Number(r.totalPenjualan / 1e6).toFixed(1)} Jt` : `Rp ${Number(r.totalPenjualan).toLocaleString("id-ID")}`,
      raw_total_penjualan: Number(r.totalPenjualan),
      totalQty: `${Number(r.totalQty).toLocaleString("id-ID")} Kg`,
      raw_total_qty: Number(r.totalQty),
      alamat: r.alamat || "-",
      transaksiTerakhir: r.transaksiTerakhir ? new Date(r.transaksiTerakhir).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : "-"
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getCustomerTransactions(req, res, next) {
  try {
    const { customerName, salesName, area, supervisor, periodeAwal, periodeAkhir } = req.query;

    let sql = `
      SELECT 
        DATE_FORMAT(f.tanggal, '%d/%m/%Y') AS tanggal,
        f.nofaktur AS noFaktur,
        c.nama_customer AS customer,
        p.nama_produk AS produk,
        f.qty,
        p.satuan_kecil AS satuan,
        f.netto AS totalPenjualan,
        COALESCE(sp.area, c.area) AS area
      FROM sales_transactions f
      JOIN customers c ON c.customer_id = f.customer_id
      JOIN products p ON p.product_id = f.product_id
      LEFT JOIN salesmen s ON s.salesman_id = f.salesman_id
      LEFT JOIN users u ON u.user_id = s.salesman_id
      LEFT JOIN supervisors sp ON sp.supervisor_id = s.supervisor_id
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
      const [supRows] = await pool.query("SELECT user_id FROM users WHERE name = ? AND role = 'supervisor' LIMIT 1", [supervisor]);
      if (supRows.length > 0) {
        sql += " AND s.supervisor_id = ?";
        params.push(supRows[0].user_id);
      }
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
      sql += " HAVING area = ?";
      params.push(area);
    }

    sql += " ORDER BY f.tanggal DESC, f.transaction_id DESC LIMIT 100";

    const [rows] = await pool.query(sql, params);

    const data = rows.map((r, index) => ({
      id: index + 1,
      tanggal: r.tanggal,
      noFaktur: r.noFaktur || "-",
      customer: r.customer || "UNKNOWN",
      produk: r.produk || "-",
      qty: String(Number(r.qty)),
      satuan: r.satuan || "KLG",
      totalPenjualan: `Rp ${Number(r.totalPenjualan).toLocaleString("id-ID")}`,
      raw_total_penjualan: Number(r.totalPenjualan)
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCustomers,
  getCustomerTransactions
};
