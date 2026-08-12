import os

model_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\models\importModel.js"
controller_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\importController.js"

model_content = """const pool = require("../config/db");
const bcrypt = require("bcryptjs");

async function fetchImportHistory() {
  const [rows] = await pool.query(
    `SELECT id, file_name, status, message, total_rows, processed_rows, uploaded_at
     FROM upload_logs ORDER BY uploaded_at DESC, id DESC`
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
  await pool.query(`UPDATE upload_logs SET ${fields.join(", ")} WHERE id = ?`, values);
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

  // Insert dummy user if doesn't exist
  const username = (slugCodeFromName(namaStr, "SLS") + Math.floor(Math.random() * 1000)).toLowerCase();
  const email = `${username}@dummy.com`;
  const [insertedUser] = await conn.query(
    "INSERT INTO users (username, email, password, name, role) VALUES (?, ?, ?, ?, 'sales')",
    [username, email, '123456', namaStr] // dummy password, in reality they should be created properly
  );
  const userId = insertedUser.insertId;
  
  // also insert to salesmen
  const kodeStr = kode ? String(kode).trim().toUpperCase() : slugCodeFromName(namaStr, "S");
  await conn.query("INSERT INTO salesmen (salesman_id, kode_salesman) VALUES (?, ?)", [userId, kodeStr]);

  return userId;
}

async function insertSalesRow(conn, data) {
  const [result] = await conn.query(
    `INSERT INTO sales_transactions (
      upload_log_id, jenis, nofaktur, tanggal, noso, tutupso, jatuh_tempo,
      customer_id, salesman_id, product_id,
      qty, harga_jual, pdiscount_item, pdiscount_item2, pdiscount_item3, discount_item,
      netto, keterangan
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.uploadLogId, data.jenis || null, data.nofaktur || null, data.tanggal || null,
      data.noso || null, data.tutupso || null, data.jatuh_tempo || null,
      data.customerId || null, data.salesmanId || null, data.productId || null,
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
  insertSalesRow
};
"""

controller_content = """const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const pool = require("../config/db");
const model = require("../models/importModel");

function toNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  let s = String(value).trim();
  s = s.replace(/[^0-9,.-]/g, "");
  const hasComma = s.indexOf(",") !== -1;
  const hasDot = s.indexOf(".") !== -1;
  let normalized;
  if (hasComma && hasDot) {
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      normalized = s.replace(/\\./g, "").replace(/,/g, ".");
    } else {
      normalized = s.replace(/,/g, "");
    }
  } else if (hasComma && !hasDot) {
    normalized = s.replace(/,/g, ".");
  } else {
    normalized = s;
  }
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeMonthName(monthName) {
  const value = String(monthName || "").trim().toUpperCase();
  const map = {
    JANUARI: "JAN", JAN: "JAN", FEBRUARI: "FEB", FEB: "FEB", MARET: "MAR", MAR: "MAR",
    APRIL: "APR", APR: "APR", MEI: "MEI", MAY: "MEI", JUNI: "JUN", JUN: "JUN",
    JULI: "JUL", JUL: "JUL", AGUSTUS: "AGU", AGU: "AGU", AUG: "AUG",
    SEPTEMBER: "SEP", SEP: "SEP", SEPT: "SEPT", OKTOBER: "OKT", OKT: "OKT", OCT: "OCT",
    NOVEMBER: "NOV", NOV: "NOV", DESEMBER: "DES", DES: "DES", DEC: "DEC",
  };
  return map[value] || value || "JAN";
}

function formatDateToYmd(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function excelDateToIso(value) {
  if (!value) return null;
  if (value instanceof Date) {
    return !Number.isNaN(value.getTime()) ? formatDateToYmd(value) : null;
  }
  if (typeof value === "number") {
    try {
      const parsed = XLSX.SSF.parse_date_code(value);
      if (!parsed) return null;
      const date = new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d));
      const yyyy = date.getUTCFullYear();
      const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
      const dd = String(date.getUTCDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch (e) { return null; }
  }
  const s = String(value).trim();
  if (!s) return null;
  const m = s.match(/^(\\d{1,2})[\\/\\-\\.](\\d{1,2})[\\/\\-\\.](\\d{2,4})(?:\\s+(\\d{1,2}):(\\d{2})(?::(\\d{2}))?)?/);
  if (m) {
    const part1 = parseInt(m[1], 10);
    const part2 = parseInt(m[2], 10);
    let year = parseInt(m[3], 10);
    if (m[3].length === 2) year += year < 50 ? 2000 : 1900;
    let day = part1; let month = part2;
    if (part2 > 12 && part1 <= 12) { day = part2; month = part1; }
    const hour = m[4] ? parseInt(m[4], 10) : 0;
    const minute = m[5] ? parseInt(m[5], 10) : 0;
    const second = m[6] ? parseInt(m[6], 10) : 0;
    const d = new Date(year, month - 1, day, hour, minute, second);
    if (!Number.isNaN(d.getTime())) return formatDateToYmd(d);
  }
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    if (s.match(/^\\d{4}-\\d{2}-\\d{2}/)) return s.slice(0, 10);
    return formatDateToYmd(d);
  }
  return null;
}

function readRowsFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const options = { cellDates: true };
  if (ext === ".csv") {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const firstLine = content.split(/\\r?\\n/)[0] || "";
      const commaCount = (firstLine.match(/,/g) || []).length;
      const semiCount = (firstLine.match(/;/g) || []).length;
      const tabCount = (firstLine.match(/\\t/g) || []).length;
      if (semiCount > commaCount && semiCount > tabCount) options.FS = ";";
      else if (tabCount > commaCount && tabCount > semiCount) options.FS = "\\t";
    } catch (e) {}
  }
  const workbook = XLSX.readFile(filePath, options);
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });
}

function normalizeHeaderKey(key) {
  return String(key || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}

function normalizeRow(row) {
  return Object.entries(row || {}).reduce((accumulator, [key, value]) => {
    accumulator[normalizeHeaderKey(key)] = value;
    return accumulator;
  }, {});
}

function getValue(row, candidates, fallback = null) {
  for (const key of candidates) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") return row[key];
  }
  return fallback;
}

async function handleImportFile(req, res, next) {
  let uploadLogId = null;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File wajib diupload (.csv/.xlsx)." });
    }

    uploadLogId = await model.insertImportLog(req.file.originalname);
    const rows = readRowsFromFile(req.file.path);

    const conn = await pool.getConnection();
    let processedRows = 0;

    try {
      await conn.beginTransaction();

      for (const row of rows) {
        const data = normalizeRow(row);

        const rawDate = getValue(data, ["tgl", "tanggal", "date", "tgl_faktur", "tanggal_faktur"]);
        const tanggal = excelDateToIso(rawDate);

        const jenis = getValue(data, ["jenis"]);
        const nofaktur = getValue(data, ["nofaktur", "no_faktur", "no_fak", "nofak", "no_invoice", "no_inv"]);
        const noso = getValue(data, ["noso", "no_so"]);
        const tutupso = getValue(data, ["tutupso", "tutup_so"]);
        const jatuh_tempo = excelDateToIso(getValue(data, ["jatuh_tempo", "due_date"]));

        const kodecustomer = getValue(data, ["kode_customer", "kodecustomer", "kode_pelanggan"]);
        const namacustomer = getValue(data, ["nama_customer", "namacustomer", "customer_name", "nama_pelanggan"]);
        const alamatcustomer = getValue(data, ["alamat_customer", "alamatcustomer", "address", "alamat"]);

        const kodeSalesman = getValue(data, ["kode_salesman", "kodesalesman", "kode_sales", "sales_code"]);
        const namaSalesman = getValue(data, ["nama_salesman", "namasalesman", "nama_sales", "sales_name"]);

        const kodeProduk = getValue(data, ["kode_barang", "kodebarang", "kode_produk", "item_code"]);
        const namaProduk = getValue(data, ["nama_barang", "namabarang", "nama_produk", "item_name"]);

        const quantity = toNumber(getValue(data, ["qty", "quantity", "jumlah", "quantity_pcs"]), 0);
        const hargajual = toNumber(getValue(data, ["hargajual", "harga_jual", "price", "harga"]), 0);
        const netto = toNumber(getValue(data, ["netto", "total_sales", "nilai_penjualan", "nilai", "net_amount", "amount", "total"]), 0) || (quantity * hargajual);

        const pdiscountitem = toNumber(getValue(data, ["pdiscountitem", "p_discount_item"]), 0);
        const pdiscountitem2 = toNumber(getValue(data, ["pdiscountitem2", "p_discount_item2"]), 0);
        const pdiscountitem3 = toNumber(getValue(data, ["pdiscountitem3", "p_discount_item3"]), 0);
        const discountitem = toNumber(getValue(data, ["discountitem", "discount_item"]), 0);
        const keterangan = getValue(data, ["keterangan", "notes", "remark"]);

        if (tanggal && (quantity > 0 || netto > 0)) {
          // Relational lookups
          const productId = await model.getOrCreateProduct(conn, namaProduk, kodeProduk);
          const customerId = await model.getOrCreateCustomer(conn, namacustomer, kodecustomer, alamatcustomer);
          const salesmanId = await model.getOrCreateSalesman(conn, namaSalesman, kodeSalesman);

          await model.insertSalesRow(conn, {
            uploadLogId, jenis, nofaktur, tanggal, noso, tutupso, jatuh_tempo,
            customerId, salesmanId, productId,
            quantity, hargajual, pdiscountitem, pdiscountitem2, pdiscountitem3, discountitem,
            netto, keterangan
          });

          processedRows += 1;
        }
      }

      await conn.commit();
      await model.updateImportLog(uploadLogId, {
        status: "success",
        message: "Import selesai",
        total_rows: rows.length,
        processed_rows: processedRows,
      });

      res.status(201).json({
        message: "Import berhasil",
        upload_log_id: uploadLogId,
        total_rows: rows.length,
        processed_rows: processedRows,
      });
    } catch (innerErr) {
      await conn.rollback();
      await model.updateImportLog(uploadLogId, {
        status: "failed",
        message: innerErr.message.slice(0, 255),
        total_rows: rows.length,
        processed_rows: 0,
      });
      throw innerErr;
    } finally {
      conn.release();
    }
  } catch (err) {
    if (uploadLogId) {
      try {
        await model.updateImportLog(uploadLogId, {
          status: "failed",
          message: err.message.slice(0, 255),
        });
      } catch (e) {}
    }
    next(err);
  } finally {
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
}

async function getImportHistory(req, res, next) {
  try {
    const rows = await model.fetchImportHistory();
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleImportFile,
  getImportHistory,
};
"""

with open(model_path, "w", encoding="utf-8") as f:
    f.write(model_content)

with open(controller_path, "w", encoding="utf-8") as f:
    f.write(controller_content)

print("Updated importModel.js and importController.js")
