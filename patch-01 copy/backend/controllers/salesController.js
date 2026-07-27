const model = require("../models/salesModel");

function toNumber(value) {
  return Number(value || 0);
}

async function getSalesmenList(req, res, next) {
  try {
    const { supervisor, area } = req.query;
    const list = await model.fetchSalesmenList(supervisor, area);
    res.json({ data: list });
  } catch (err) {
    next(err);
  }
}

async function getSalesKpis(req, res, next) {
  try {
    const { salesman, supervisor, area, periodeAwal, periodeAkhir, kategori } = req.query;
    const salesmen = await model.getSalesmenForFilter(salesman, supervisor, area);
    const row = await model.fetchSalesKpis(salesmen, { periodeAwal, periodeAkhir, kategori });

    res.json({
      total_sales: toNumber(row.total_sales),
      total_weight: toNumber(row.total_weight_kg),
      total_transactions: toNumber(row.total_transactions),
      total_customers: toNumber(row.total_customers),
    });
  } catch (err) {
    next(err);
  }
}

async function getSalesContribution(req, res, next) {
  try {
    const { salesman, supervisor, area, periodeAwal, periodeAkhir, kategori } = req.query;
    const salesmen = await model.getSalesmenForFilter(salesman, supervisor, area);
    const rows = await model.fetchSalesContribution(salesmen, { periodeAwal, periodeAkhir, kategori });

    const total = rows.reduce((acc, r) => acc + toNumber(r.total_sales), 0);
    const data = rows.map((r) => {
      const val = toNumber(r.total_sales);
      return {
        kategori: r.kategori || "UMUM",
        total_sales: val,
        percentage: total ? Number(((val / total) * 100).toFixed(2)) : 0,
      };
    });

    res.json({ data, grand_total: total });
  } catch (err) {
    next(err);
  }
}

async function getSalesTrend(req, res, next) {
  try {
    const { salesman, supervisor, area, periodeAwal, periodeAkhir, kategori, periode, jenisData, customerName } = req.query;
    const salesmen = await model.getSalesmenForFilter(salesman, supervisor, area);
    const rows = await model.fetchSalesTrend(salesmen, { periodeAwal, periodeAkhir, kategori, periode, jenisData, customerName });

    const MONTH_NAMES = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const labels = rows.map((r) => {
      if (periode === 'Hari' || periode === 'Tahun') return r.group_val;
      return MONTH_NAMES[(r.group_val || 1) - 1];
    });
    const values = rows.map((r) => toNumber(r.value));

    res.json({ labels, values });
  } catch (err) {
    next(err);
  }
}

async function getSalesTopProducts(req, res, next) {
  try {
    const { salesman, supervisor, area, periodeAwal, periodeAkhir, kategori, customerName } = req.query;
    const salesmen = await model.getSalesmenForFilter(salesman, supervisor, area);
    const rows = await model.fetchSalesTopProducts(salesmen, { periodeAwal, periodeAkhir, kategori, customerName });

    const data = rows.map((r) => ({
      nama_produk: r.nama_produk,
      total_sales: toNumber(r.total_sales),
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getSalesTopSalesmen(req, res, next) {
  try {
    const { salesman, supervisor, area, periodeAwal, periodeAkhir, kategori } = req.query;
    const salesmen = await model.getSalesmenForFilter(salesman, supervisor, area);
    const rows = await model.fetchSalesTopSalesmen(salesmen, { periodeAwal, periodeAkhir, kategori });
    const data = rows.map((r) => ({
      kode_salesman: r.kode_salesman,
      nama_salesman: r.nama_salesman || "UMUM",
      total_sales: toNumber(r.total_sales),
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

async function getSalesTransactions(req, res, next) {
  try {
    const { salesman, supervisor, area, periodeAwal, periodeAkhir, kategori } = req.query;
    const salesmen = await model.getSalesmenForFilter(salesman, supervisor, area);
    const rows = await model.fetchSalesTransactions(salesmen, { periodeAwal, periodeAkhir, kategori });
    const data = rows.map((r) => ({
      tanggal_formatted: r.tanggal_formatted,
      nofaktur: r.nofaktur,
      customer: r.customer,
      produk: r.produk,
      qty: toNumber(r.qty),
      satuan: r.satuan,
      total_penjualan: toNumber(r.total_penjualan),
    }));

    res.json({ data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSalesmenList,
  getSalesKpis,
  getSalesContribution,
  getSalesTrend,
  getSalesTopProducts,
  getSalesTopSalesmen,
  getSalesTransactions,
};
