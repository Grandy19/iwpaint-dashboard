const pool = require("../config/db");

async function fetchImportHistory() {
  const [rows] = await pool.query(
    `
      SELECT id, file_name, status, message, total_rows, processed_rows, uploaded_at
      FROM upload_logs
      ORDER BY uploaded_at DESC, id DESC
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
  await pool.query(`UPDATE upload_logs SET ${fields.join(", ")} WHERE id = ?`, values);
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

async function getOrCreateDistributor(conn, kode, nama) {
  const kodeDistributor =
    String(kode || "")
      .trim()
      .toUpperCase() || slugCodeFromName(nama, "DST");
  const namaDistributor = String(nama || "").trim() || kodeDistributor;
  try {
    const [existing] = await conn.query("SELECT id FROM dim_distributors WHERE kode_distributor = ? LIMIT 1", [kodeDistributor]);
    if (existing.length) return existing[0].id;

    const [inserted] = await conn.query("INSERT INTO dim_distributors (kode_distributor, nama_distributor) VALUES (?, ?)", [kodeDistributor, namaDistributor]);
    return inserted.insertId;
  } catch (err) {
    if (err && (err.code === "ER_NO_SUCH_TABLE" || /dim_distributors/i.test(err.sqlMessage || ""))) {
      console.warn("dim_distributors table missing — skipping distributor lookup/creation.");
      return null;
    }
    throw err;
  }
}

async function getOrCreateDivision(conn, namaDivisi) {
  const divisionName =
    String(namaDivisi || "")
      .trim()
      .toUpperCase() || "UNKNOWN";
  const [existing] = await conn.query("SELECT id FROM dim_divisions WHERE nama_divisi = ? LIMIT 1", [divisionName]);
  if (existing.length) return existing[0].id;

  const [inserted] = await conn.query("INSERT INTO dim_divisions (nama_divisi) VALUES (?)", [divisionName]);
  return inserted.insertId;
}

async function getOrCreateProduct(conn, productName, productCode) {
  if (!productName) return null;

  const productCodeStr = productCode
    ? String(productCode).trim().toUpperCase()
    : null;
  const productNameStr = String(productName).trim().toUpperCase();

  let existing;
  if (productCodeStr) {
    [existing] = await conn.query("SELECT id FROM dim_products WHERE kode_produk = ? LIMIT 1", [productCodeStr]);
    if (existing.length) return existing[0].id;
  }

  [existing] = await conn.query("SELECT id FROM dim_products WHERE nama_produk = ? LIMIT 1", [productNameStr]);
  if (existing.length) return existing[0].id;

  const [inserted] = await conn.query("INSERT INTO dim_products (kode_produk, nama_produk) VALUES (?, ?)", [productCodeStr || null, productNameStr]);
  return inserted.insertId;
}

async function ensureDimLookup(conn, table, kodeField, kodeValue, nameField, nameValue) {
  const kode = String(kodeValue || "").trim().toUpperCase();
  const name = String(nameValue || "").trim();

  if (!kode && !name) return null;

  try {
    if (kode) {
      const [existing] = await conn.query(`SELECT ${kodeField} FROM ${table} WHERE ${kodeField} = ? LIMIT 1`, [kode]);
      if (existing.length) return existing[0][kodeField];
    }

    const insertKode =
      kode ||
      name
        .replace(/[^A-Z0-9]/gi, "_")
        .slice(0, 20)
        .toUpperCase();
    const insertName = name || insertKode;
    await conn.query(`INSERT INTO ${table} (${kodeField}, ${nameField}) VALUES (?, ?)`, [insertKode, insertName]);
    return insertKode;
  } catch (err) {
    if (err && err.code === "ER_NO_SUCH_TABLE") {
      console.warn(`${table} table missing — skipping creation of lookup record.`);
      return kode || name || null;
    }
    throw err;
  }
}

async function insertSalesRow(conn, data) {
  const [result] = await conn.query(
    `
      INSERT INTO fact_sales (
        upload_log_id, jenis, nofaktur, tanggal, noso, tutupso, jatuh_tempo,
        kodecustomer, namacustomer, alamatcustomer,
        kode_salesman, nama_salesman, kode_gudang, nama_gudang,
        kode_barang, nama_barang, product_id,
        qty, hargajual, satuan_kecil, pdiscountitem, pdiscountitem2, pdiscountitem3, discountitem,
        netto, keterangan, kode_suplier, nama_suplier
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      data.uploadLogId,
      data.jenis || null,
      data.nofaktur || null,
      data.tanggal,
      data.noso || null,
      data.tutupso || null,
      data.jatuh_tempo || null,
      data.kodecustomer || null,
      data.namacustomer || null,
      data.alamatcustomer || null,
      data.ensuredSalesman || data.kodeSalesman || null,
      data.namaSalesman || null,
      data.ensuredGudang || data.kodeGudang || null,
      data.namaGudang || null,
      data.kodeProduk || null,
      data.namaProduk || null,
      data.productId || null,
      data.quantity,
      data.hargajual,
      data.satuanKecil || null,
      data.pdiscountitem,
      data.pdiscountitem2,
      data.pdiscountitem3,
      data.discountitem,
      data.netto,
      data.keterangan || null,
      data.ensuredSupplier || data.kodeSuplier || null,
      data.namaSuplier || null,
    ]
  );
  return result;
}

module.exports = {
  fetchImportHistory,
  insertImportLog,
  updateImportLog,
  getOrCreateDistributor,
  getOrCreateDivision,
  getOrCreateProduct,
  ensureDimLookup,
  insertSalesRow,
};
