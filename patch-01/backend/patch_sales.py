import os
import re

model_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\models\salesModel.js"
controller_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\salesController.js"

# 1. Update salesController.js
with open(controller_path, "r", encoding="utf-8") as f:
    c_content = f.read()

c_content = c_content.replace("await model.fetchSalesTopProducts(", "await model.fetchTopProducts(")
with open(controller_path, "w", encoding="utf-8") as f:
    f.write(c_content)

# 2. Update salesModel.js
with open(model_path, "r", encoding="utf-8") as f:
    m_content = f.read()

# Add fetchSalesTopSalesmen before module.exports
top_salesmen_func = """async function fetchSalesTopSalesmen(salesmen, filters = {}, limit = 10) {
  let query = `
    SELECT
      s.kode_salesman,
      u.name AS nama_salesman,
      COALESCE(SUM(f.netto), 0) AS total_sales
    FROM sales_transactions f
    LEFT JOIN users u ON u.user_id = f.salesman_id
    LEFT JOIN salesmen s ON s.salesman_id = u.user_id
    LEFT JOIN products p ON p.product_id = f.product_id
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
    GROUP BY s.kode_salesman, u.name
    ORDER BY total_sales DESC
    LIMIT ?
  `;
  params.push(limit);

  const [rows] = await pool.query(query, params);
  return rows;
}

module.exports = {"""
m_content = m_content.replace("module.exports = {", top_salesmen_func)

# Add it to module.exports
m_content = m_content.replace("fetchSalesTrend,", "fetchSalesTrend,\n  fetchSalesTopSalesmen,")

# Fix fetchTopProducts to support customerName and join customers
fetch_top_products_old = """async function fetchTopProducts(salesmen, filters = {}, limit = 10) {
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
  `;"""

fetch_top_products_new = """async function fetchTopProducts(salesmen, filters = {}, limit = 10) {
  let query = `
    SELECT
      p.nama_produk AS nama_produk,
      p.kode_produk AS kode_produk,
      COALESCE(SUM(f.netto), 0) AS total_sales,
      COALESCE(SUM(f.qty), 0) AS total_quantity
    FROM sales_transactions f
    LEFT JOIN products p ON p.product_id = f.product_id
    LEFT JOIN customers c ON c.customer_id = f.customer_id
    LEFT JOIN users u ON u.user_id = f.salesman_id
    WHERE u.name IN (?)
  `;"""
m_content = m_content.replace(fetch_top_products_old, fetch_top_products_new)

fetch_top_products_filter_old = """  if (filters.kategori) {
    query += " AND p.kategori = ?";
    params.push(mapKategoriDB(filters.kategori));
  }"""

fetch_top_products_filter_new = """  if (filters.kategori) {
    query += " AND p.kategori = ?";
    params.push(mapKategoriDB(filters.kategori));
  }
  if (filters.customerName && filters.customerName !== 'Semua Customer') {
    query += " AND c.nama_customer = ?";
    params.push(filters.customerName);
  }"""
m_content = m_content.replace(fetch_top_products_filter_old, fetch_top_products_filter_new)

with open(model_path, "w", encoding="utf-8") as f:
    f.write(m_content)

print("Updated salesModel.js and salesController.js")
