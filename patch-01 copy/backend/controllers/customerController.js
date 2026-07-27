const pool = require("../config/db");

async function getCustomers(req, res, next) {
  try {
    const { area, salesName, customerName, supervisor, periodeAwal, periodeAkhir } = req.query;

    let sql = `
      SELECT 
        f.namacustomer AS namaCustomer,
        f.kodecustomer AS kodeCustomer,
        f.nama_salesman AS sales,
        COALESCE(u.area, f.nama_gudang) AS area,
        COUNT(DISTINCT f.nofaktur) AS totalTransaksi,
        SUM(f.netto) AS totalPenjualan,
        SUM(f.qty * COALESCE(p.berat, 1.0)) AS totalQty,
        MAX(f.tanggal) AS transaksiTerakhir,
        MAX(f.alamatcustomer) AS alamat
      FROM fact_sales f
      LEFT JOIN users u ON u.name = f.nama_salesman AND u.role = 'sales'
      LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
      WHERE 1=1
    `;
    const params = [];

    if (customerName && customerName !== "Semua Customer") {
      sql += " AND f.namacustomer = ?";
      params.push(customerName);
    }
    if (salesName && salesName !== "Semua Sales") {
      sql += " AND f.nama_salesman = ?";
      params.push(salesName);
    }

    if (supervisor && supervisor !== "Semua Supervisor") {
      sql += " AND u.supervisor_name = ?";
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

    sql += " GROUP BY f.namacustomer, f.kodecustomer, f.nama_salesman, COALESCE(u.area, f.nama_gudang)";

    if (area && area !== "Semua Area") {
      sql += " HAVING area = ?";
      params.push(area);
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
        f.namacustomer AS customer,
        f.nama_barang AS produk,
        f.qty,
        f.satuan_kecil AS satuan,
        f.netto AS totalPenjualan
      FROM fact_sales f
      LEFT JOIN users u ON u.name = f.nama_salesman AND u.role = 'sales'
      WHERE 1=1
    `;
    const params = [];

    if (customerName && customerName !== "Semua Customer") {
      sql += " AND f.namacustomer = ?";
      params.push(customerName);
    }
    if (salesName && salesName !== "Semua Sales") {
      sql += " AND f.nama_salesman = ?";
      params.push(salesName);
    }
    if (area && area !== "Semua Area") {
      sql += " AND COALESCE(u.area, f.nama_gudang) = ?";
      params.push(area);
    }
    if (supervisor && supervisor !== "Semua Supervisor") {
      sql += " AND u.supervisor_name = ?";
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

    sql += " ORDER BY f.tanggal DESC, f.id DESC LIMIT 100";

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
