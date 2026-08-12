const pool = require("../config/db");

async function fetchImportHistory() {
  const [rows] = await pool.query(
    `SELECT upload_log_id as id, file_name, status, message, total_rows, processed_rows, uploaded_at
     FROM upload_logs ORDER BY uploaded_at DESC, upload_log_id DESC`
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
  const base = String(name || "").toUpperCase().replace(/[^A-Z0-9 ]/g, " ").trim();
  if (!base) return `${fallbackPrefix}${Math.floor(Math.random() * 900 + 100)}`;
  const parts = base.split(/\s+/).filter(Boolean);
  const initials = parts.map((p) => p[0]).join("").slice(0, 3);
  return (initials || base.slice(0, 3)).padEnd(3, "X").slice(0, 10);
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

  const [inserted] = await conn.query(
    "INSERT INTO products (kode_produk, nama_produk, harga_jual, satuan_kecil, kategori, berat) VALUES (?, ?, 0, '', '', 1)",
    [productCodeStr || null, productNameStr]
  );
  return inserted.insertId;
}

async function getOrCreateCustomer(conn, nama, kode, alamat) {
  if (!nama) return null;
  const kodeStr = kode ? String(kode).trim().toUpperCase() : null;
  const namaStr = String(nama).trim().toUpperCase();
  const alamatStr = String(alamat || "").trim();

  let existing;
  if (kodeStr) {
    [existing] = await conn.query("SELECT customer_id FROM customers WHERE kode_customer = ? LIMIT 1", [kodeStr]);
    if (existing.length) return existing[0].customer_id;
  }
  [existing] = await conn.query("SELECT customer_id FROM customers WHERE nama_customer = ? LIMIT 1", [namaStr]);
  if (existing.length) return existing[0].customer_id;

  const [inserted] = await conn.query(
    "INSERT INTO customers (kode_customer, nama_customer, alamat_customer) VALUES (?, ?, ?)",
    [kodeStr || null, namaStr, alamatStr]
  );
  return inserted.insertId;
}

async function getOrCreateSalesman(conn, nama, kode) {
  if (!nama) return null;
  const namaStr = String(nama).trim();

  const [existing] = await conn.query("SELECT user_id FROM users WHERE name = ? AND role = 'sales' LIMIT 1", [namaStr]);
  if (existing.length) return existing[0].user_id;

  const username = (slugCodeFromName(namaStr, "SLS") + Math.floor(Math.random() * 1000)).toLowerCase();
  const email = `${username}@dummy.com`;
  const [insertedUser] = await conn.query(
    "INSERT INTO users (username, email, password, name, role) VALUES (?, ?, ?, ?, 'sales')",
    [username, email, '123456', namaStr]
  );
  const userId = insertedUser.insertId;
  
  const kodeStr = kode ? String(kode).trim().toUpperCase() : slugCodeFromName(namaStr, "S");
  await conn.query("INSERT INTO salesmen (salesman_id, kode_salesman) VALUES (?, ?)", [userId, kodeStr]);

  return userId;
}

async function getOrCreateWarehouse(conn, nama, kode) {
  if (!nama && !kode) return null;
  const namaStr = String(nama || kode).trim().toUpperCase();
  const kodeStr = String(kode || slugCodeFromName(namaStr, "W")).trim().toUpperCase();

  const [existing] = await conn.query("SELECT warehouse_id FROM warehouses WHERE kode_gudang = ? LIMIT 1", [kodeStr]);
  if (existing.length) return existing[0].warehouse_id;

  const [inserted] = await conn.query(
    "INSERT INTO warehouses (kode_gudang, nama_gudang) VALUES (?, ?)",
    [kodeStr, namaStr]
  );
  return inserted.insertId;
}

async function getOrCreateSupplier(conn, nama, kode) {
  if (!nama && !kode) return null;
  const namaStr = String(nama || kode).trim().toUpperCase();
  const kodeStr = String(kode || slugCodeFromName(namaStr, "SUP")).trim().toUpperCase();

  const [existing] = await conn.query("SELECT supplier_id FROM suppliers WHERE kode_supplier = ? LIMIT 1", [kodeStr]);
  if (existing.length) return existing[0].supplier_id;

  const [inserted] = await conn.query(
    "INSERT INTO suppliers (kode_supplier, nama_supplier) VALUES (?, ?)",
    [kodeStr, namaStr]
  );
  return inserted.insertId;
}

async function insertSalesRow(conn, data) {
  // if warehouseId is null, use a default dummy one
  let warehouseId = data.warehouseId;
  if (!warehouseId) {
    warehouseId = await getOrCreateWarehouse(conn, "DEFAULT WAREHOUSE", "WHD");
  }

  const [result] = await conn.query(
    `INSERT INTO sales_transactions (
      upload_log_id, jenis, nofaktur, tanggal, noso, tutupso, jatuh_tempo,
      customer_id, salesman_id, product_id, warehouse_id, supplier_id,
      qty, harga_jual, pdiscount_item, pdiscount_item2, pdiscount_item3, discount_item,
      netto, keterangan
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.uploadLogId, data.jenis || null, data.nofaktur || null, data.tanggal || null,
      data.noso || null, data.tutupso || null, data.jatuh_tempo || null,
      data.customerId || null, data.salesmanId || null, data.productId || null, warehouseId, data.supplierId || null,
      data.quantity || 0, data.hargajual || 0, data.pdiscountitem || 0,
      data.pdiscountitem2 || 0, data.pdiscountitem3 || 0, data.discountitem || 0,
      data.netto || 0, data.keterangan || null
    ]
  );
  return result;
}

module.exports = {
  fetchImportHistory,
  insertImportLog,
  updateImportLog,
  getOrCreateProduct,
  getOrCreateCustomer,
  getOrCreateSalesman,
  getOrCreateWarehouse,
  getOrCreateSupplier,
  insertSalesRow
};
