const pool = require("../config/db");

async function fetchImportHistory() {
  const [rows] = await pool.query(
    `
      SELECT upload_log_id AS id, file_name, status, message, total_rows, processed_rows, uploaded_at
      FROM upload_logs
      ORDER BY uploaded_at DESC, upload_log_id DESC
    `
  );
  return rows;
}

async function insertImportLog(fileName) {
  const [result] = await pool.query(
    "INSERT INTO upload_logs (file_name, status, message, total_rows, processed_rows) VALUES (?, 'processing', 'Sedang diproses', 0, 0)",
    [fileName]
  );
  return result.insertId;
}

async function updateImportLog(logId, patch) {
  const fields = [];
  const values = [];

  for (const [key, value] of Object.entries(patch)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  if (!fields.length) return;

  values.push(logId);
  await pool.query(`UPDATE upload_logs SET ${fields.join(", ")} WHERE upload_log_id = ?`, values);
}

function slugCodeFromName(name, fallbackPrefix) {
  const base = String(name || "")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .trim();
  if (!base) return `${fallbackPrefix}${Math.floor(Math.random() * 900 + 100)}`;

  const parts = base.split(/\s+/).filter(Boolean);
  const initials = parts
    .map((p) => p[0])
    .join("")
    .slice(0, 3);
  return (initials || base.slice(0, 3)).padEnd(3, "X").slice(0, 10);
}

async function getOrCreateSalesman(conn, kode, name) {
  const cleanKode = String(kode || "").trim().toUpperCase();
  const cleanName = String(name || "").trim() || cleanKode;
  if (!cleanKode) return null;

  const [existing] = await conn.query("SELECT salesman_id FROM salesmen WHERE kode_salesman = ? LIMIT 1", [cleanKode]);
  if (existing.length) return existing[0].salesman_id;

  // Insert parent user first
  const username = cleanName.toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 100);
  const [userInsert] = await conn.query(
    "INSERT INTO users (username, email, password, name, role, status) VALUES (?, ?, ?, ?, 'sales', 'Aktif')",
    [username, `${username}@iwpaint.com`, 'password123', cleanName]
  );
  const newUserId = userInsert.insertId;

  // Insert subclass salesmen record
  await conn.query("INSERT INTO salesmen (salesman_id, kode_salesman) VALUES (?, ?)", [newUserId, cleanKode]);
  return newUserId;
}

async function getOrCreateWarehouse(conn, kode, name) {
  const cleanKode = String(kode || "").trim().toUpperCase();
  const cleanName = String(name || "").trim() || cleanKode;
  if (!cleanKode) return null;

  const [existing] = await conn.query("SELECT warehouse_id FROM warehouses WHERE kode_gudang = ? LIMIT 1", [cleanKode]);
  if (existing.length) return existing[0].warehouse_id;

  const [inserted] = await conn.query("INSERT INTO warehouses (kode_gudang, nama_gudang) VALUES (?, ?)", [cleanKode, cleanName]);
  return inserted.insertId;
}

async function getOrCreateSupplier(conn, kode, name) {
  if (!kode && !name) return null;
  const cleanKode = String(kode || "").trim().toUpperCase() || slugCodeFromName(name, "SPL");
  const cleanName = String(name || "").trim() || cleanKode;

  const [existing] = await conn.query("SELECT supplier_id FROM suppliers WHERE kode_supplier = ? LIMIT 1", [cleanKode]);
  if (existing.length) return existing[0].supplier_id;

  const [inserted] = await conn.query("INSERT INTO suppliers (kode_supplier, nama_supplier) VALUES (?, ?)", [cleanKode, cleanName]);
  return inserted.insertId;
}

async function getOrCreateCustomer(conn, kode, name, address, salesmanId) {
  if (!kode && !name) return null;
  const cleanKode = String(kode || "").trim().toUpperCase() || slugCodeFromName(name, "CST");
  const cleanName = String(name || "").trim() || cleanKode;
  const cleanAddress = String(address || "").trim() || null;

  const [existing] = await conn.query("SELECT customer_id FROM customers WHERE kode_customer = ? LIMIT 1", [cleanKode]);
  if (existing.length) return existing[0].customer_id;

  const [inserted] = await conn.query(
    "INSERT INTO customers (kode_customer, nama_customer, alamat_customer, salesman_id) VALUES (?, ?, ?, ?)",
    [cleanKode, cleanName, cleanAddress, salesmanId]
  );
  return inserted.insertId;
}

async function getOrCreateProduct(conn, productName, productCode) {
  if (!productName) return null;

  const productCodeStr = productCode ? String(productCode).trim().toUpperCase() : null;
  const productNameStr = String(productName).trim().toUpperCase();

  let existing;
  if (productCodeStr) {
    [existing] = await conn.query("SELECT product_id FROM products WHERE kode_produk = ? LIMIT 1", [productCodeStr]);
    if (existing.length) return existing[0].product_id;
  }

  [existing] = await conn.query("SELECT product_id FROM products WHERE nama_produk = ? LIMIT 1", [productNameStr]);
  if (existing.length) return existing[0].product_id;

  const [inserted] = await conn.query("INSERT INTO products (kode_produk, nama_produk) VALUES (?, ?)", [productCodeStr || null, productNameStr]);
  return inserted.insertId;
}

async function insertSalesRow(conn, data) {
  const [result] = await conn.query(
    `
      INSERT INTO sales_transactions (
        upload_log_id, jenis, nofaktur, tanggal, noso, tutupso, jatuh_tempo,
        customer_id, salesman_id, warehouse_id, product_id, supplier_id,
        qty, harga_jual, pdiscount_item, pdiscount_item2, pdiscount_item3, discount_item,
        netto, keterangan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.uploadLogId,
      data.jenis || null,
      data.nofaktur || null,
      data.tanggal,
      data.noso || null,
      data.tutupso || null,
      data.jatuh_tempo || null,
      data.customerId,
      data.salesmanId,
      data.warehouseId,
      data.productId,
      data.supplierId || null,
      data.quantity,
      data.hargajual,
      data.pdiscountitem,
      data.pdiscountitem2,
      data.pdiscountitem3,
      data.discountitem,
      data.netto,
      data.keterangan || null,
    ]
  );
  return result;
}

module.exports = {
  fetchImportHistory,
  insertImportLog,
  updateImportLog,
  getOrCreateSalesman,
  getOrCreateWarehouse,
  getOrCreateSupplier,
  getOrCreateCustomer,
  getOrCreateProduct,
  insertSalesRow,
};
