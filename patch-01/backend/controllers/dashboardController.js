const model = require("../models/dashboardModel");
const pool = require("../config/db");

function toNumber(value) {
  return Number(value || 0);
}

async function getSalesmenForFilter(req) {
  const { salesman, supervisor, area } = req.query;

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
    // Map regional area to specific city area
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

  if (names.length === 0) {
    return ["__NONE__"]; // fallback if no salesmen matched
  }

  return names;
}

async function getTotalSales(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const totalSales = await model.fetchTotalSales(salesmen);
    res.json({ total_sales: toNumber(totalSales) });
  } catch (err) {
    next(err);
  }
}

async function getTotalTransactions(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const totalTransactions = await model.fetchTotalTransactions(salesmen);
    res.json({ total_transactions: toNumber(totalTransactions) });
  } catch (err) {
    next(err);
  }
}

async function getBestSellerProducts(req, res, next) {
  try {
    const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;
    const salesmen = await getSalesmenForFilter(req);
    const rows = await model.fetchBestSellerProducts(salesmen, limit);

    const data = rows.map((row) => ({
      nama_produk: row.nama_produk,
      kode_produk: row.kode_produk,
      total_quantity: toNumber(row.total_quantity),
      total_sales: toNumber(row.total_sales),
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getContributionByDistributor(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const rows = await model.fetchContributionByDistributor(salesmen);

    const total = rows.reduce((acc, row) => acc + toNumber(row.total_sales), 0);
    const data = rows.map((row) => {
      const value = toNumber(row.total_sales);
      return {
        kategori: row.kategori,
        total_sales: value,
        percentage: total ? Number(((value / total) * 100).toFixed(2)) : 0,
      };
    });

    res.json({ data, grand_total: total });
  } catch (err) {
    next(err);
  }
}

async function getSalesByValue(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const rows = await model.fetchSalesByValue(salesmen);

    const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const labels = rows.map((r) => MONTH_NAMES[(r.month_num || 1) - 1]);
    const values = rows.map((r) => toNumber(r.total_sales));

    res.json({ labels, values });
  } catch (err) {
    next(err);
  }
}

async function getSalesPerSales(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const rows = await model.fetchSalesPerSales(salesmen);
    const data = rows.map((r) => ({ nama_salesman: r.nama_salesman, total_penjualan: toNumber(r.total_penjualan) }));
    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getTotalQtyWeight(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const totalWeight = await model.fetchTotalQtyWeight(salesmen);
    res.json({ total_weight: toNumber(totalWeight) });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTotalSales,
  getTotalTransactions,
  getTotalQtyWeight,
  getBestSellerProducts,
  getContributionByDistributor,
  getSalesByValue,
  getSalesPerSales,
};
