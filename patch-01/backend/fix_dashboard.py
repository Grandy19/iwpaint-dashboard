import os

controller_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\dashboardController.js"
model_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\models\dashboardModel.js"

# Rewrite dashboardController.js
controller_content = """const model = require("../models/dashboardModel");
const pool = require("../config/db");

function toNumber(value) {
  return Number(value || 0);
}

async function getSalesmenForFilter(req) {
  const { salesman, supervisor, area } = req.query;

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
    query += " AND sup.area IN (?)";
    params.push(matchedAreas);
  }

  const [salesUsers] = await pool.query(query, params);
  let names = salesUsers.map(u => u.name);

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
    const totalTx = await model.fetchTotalTransactions(salesmen);
    res.json({ total_transactions: toNumber(totalTx) });
  } catch (err) {
    next(err);
  }
}

async function getTotalQtyWeight(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const totalWeight = await model.fetchTotalQtyWeight(salesmen);
    res.json({ total_weight_kg: toNumber(totalWeight) });
  } catch (err) {
    next(err);
  }
}

async function getBestSellerProducts(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const products = await model.fetchBestSellerProducts(salesmen, 10);
    res.json({ data: products.map(p => ({
      ...p,
      total_sales: toNumber(p.total_sales),
      total_quantity: toNumber(p.total_quantity)
    }))});
  } catch (err) {
    next(err);
  }
}

async function getContributionByDistributor(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const distribs = await model.fetchContributionByDistributor(salesmen);
    res.json({ data: distribs.map(d => ({
      ...d,
      total_sales: toNumber(d.total_sales)
    }))});
  } catch (err) {
    next(err);
  }
}

async function getSalesTrend(req, res, next) {
  try {
    const salesmen = await getSalesmenForFilter(req);
    const trend = await model.fetchSalesTrend(salesmen);
    const completeTrend = [];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    
    for (let i = 1; i <= 12; i++) {
      const found = trend.find(t => Number(t.group_val) === i);
      completeTrend.push({
        group_val: monthNames[i - 1],
        value: found ? toNumber(found.value) : 0
      });
    }

    res.json({ data: completeTrend });
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
  getSalesTrend
};
"""

with open(controller_path, "w", encoding="utf-8") as f:
    f.write(controller_content)


# Rewrite dashboardModel.js
model_content = """const pool = require("../config/db");

async function fetchTotalSales(salesmen) {
  const query = salesmen 
    ? `SELECT COALESCE(SUM(f.netto), 0) AS total_sales 
       FROM sales_transactions f 
       LEFT JOIN users u ON u.user_id = f.salesman_id 
       WHERE u.name IN (?)`
    : "SELECT COALESCE(SUM(netto), 0) AS total_sales FROM sales_transactions";
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows[0].total_sales;
}

async function fetchTotalTransactions(salesmen) {
  const query = salesmen 
    ? `SELECT COUNT(DISTINCT f.nofaktur) AS total_transactions 
       FROM sales_transactions f 
       LEFT JOIN users u ON u.user_id = f.salesman_id 
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
    ${salesmen ? "LEFT JOIN users u ON u.user_id = f.salesman_id WHERE u.name IN (?)" : ""}
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
    ${salesmen ? "LEFT JOIN users u ON u.user_id = f.salesman_id WHERE u.name IN (?)" : ""}
    GROUP BY p.nama_produk, p.kode_produk
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
    ${salesmen ? "LEFT JOIN users u ON u.user_id = f.salesman_id WHERE u.name IN (?)" : ""}
    GROUP BY COALESCE(p.kategori, 'UNKNOWN')
    ORDER BY total_sales DESC
  `;
  const [rows] = await pool.query(query, salesmen ? [salesmen] : []);
  return rows;
}

async function fetchSalesTrend(salesmen) {
  const query = `
    SELECT
      MONTH(f.tanggal) AS group_val,
      COALESCE(SUM(f.netto), 0) AS value
    FROM sales_transactions f
    ${salesmen ? "LEFT JOIN users u ON u.user_id = f.salesman_id WHERE u.name IN (?)" : ""}
    GROUP BY MONTH(f.tanggal)
    ORDER BY group_val ASC
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
  fetchSalesTrend
};
"""

with open(model_path, "w", encoding="utf-8") as f:
    f.write(model_content)

print("Updated dashboardController.js and dashboardModel.js")
