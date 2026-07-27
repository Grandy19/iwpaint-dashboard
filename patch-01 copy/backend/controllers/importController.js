const fs = require("fs");
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
      normalized = s.replace(/\./g, "").replace(/,/g, ".");
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
  const value = String(monthName || "")
    .trim()
    .toUpperCase();
  const map = {
    JANUARI: "JAN", JAN: "JAN",
    FEBRUARI: "FEB", FEB: "FEB",
    MARET: "MAR", MAR: "MAR",
    APRIL: "APR", APR: "APR",
    MEI: "MEI", MAY: "MEI",
    JUNI: "JUN", JUN: "JUN",
    JULI: "JUL", JUL: "JUL",
    AGUSTUS: "AGU", AGU: "AGU", AUG: "AUG",
    SEPTEMBER: "SEP", SEP: "SEP", SEPT: "SEPT",
    OKTOBER: "OKT", OKT: "OKT", OCT: "OCT",
    NOVEMBER: "NOV", NOV: "NOV",
    DESEMBER: "DES", DES: "DES", DEC: "DEC",
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
    } catch (e) {
      return null;
    }
  }

  const s = String(value).trim();
  if (!s) return null;

  const m = s.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (m) {
    const part1 = parseInt(m[1], 10);
    const part2 = parseInt(m[2], 10);
    let year = parseInt(m[3], 10);
    if (m[3].length === 2) {
      year += year < 50 ? 2000 : 1900;
    }
    let day = part1;
    let month = part2;
    if (part2 > 12 && part1 <= 12) {
      day = part2;
      month = part1;
    }
    const hour = m[4] ? parseInt(m[4], 10) : 0;
    const minute = m[5] ? parseInt(m[5], 10) : 0;
    const second = m[6] ? parseInt(m[6], 10) : 0;

    const d = new Date(year, month - 1, day, hour, minute, second);
    if (!Number.isNaN(d.getTime())) {
      return formatDateToYmd(d);
    }
  }

  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) {
    if (s.match(/^\d{4}-\d{2}-\d{2}/)) {
      return s.slice(0, 10);
    }
    return formatDateToYmd(d);
  }

  const indonesianMonths = {
    januari: "jan", februari: "feb", maret: "mar", april: "apr",
    mei: "may", juni: "jun", juli: "jul", agustus: "aug",
    september: "sep", oktober: "oct", november: "nov", desember: "dec"
  };
  
  let cleaned = s.toLowerCase();
  let foundIndoMonth = false;
  for (const [indo, eng] of Object.entries(indonesianMonths)) {
    if (cleaned.includes(indo)) {
      cleaned = cleaned.replace(indo, eng);
      foundIndoMonth = true;
      break;
    }
  }

  if (foundIndoMonth) {
    const dEng = new Date(cleaned);
    if (!Number.isNaN(dEng.getTime())) {
      return formatDateToYmd(dEng);
    }
    const mEng = cleaned.match(/^(\d{1,2})[\/\-\.\s]+([a-z]{3})[\/\-\.\s]+(\d{2,4})/);
    if (mEng) {
      const day = parseInt(mEng[1], 10);
      const monthStr = mEng[2];
      let year = parseInt(mEng[3], 10);
      if (mEng[3].length === 2) {
        year += year < 50 ? 2000 : 1900;
      }
      const monthsEngList = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      const monthIdx = monthsEngList.indexOf(monthStr);
      if (monthIdx !== -1) {
        const dIdx = new Date(year, monthIdx, day);
        if (!Number.isNaN(dIdx.getTime())) {
          return formatDateToYmd(dIdx);
        }
      }
    }
  }
  return null;
}

function readRowsFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const options = { cellDates: true };

  if (ext === ".csv") {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      const firstLine = content.split(/\r?\n/)[0] || "";
      const commaCount = (firstLine.match(/,/g) || []).length;
      const semiCount = (firstLine.match(/;/g) || []).length;
      const tabCount = (firstLine.match(/\t/g) || []).length;
      if (semiCount > commaCount && semiCount > tabCount) {
        options.FS = ";";
      } else if (tabCount > commaCount && tabCount > semiCount) {
        options.FS = "\t";
      }
    } catch (e) {
      console.error("Error detecting CSV delimiter:", e);
    }
  }

  const workbook = XLSX.readFile(filePath, options);
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  return XLSX.utils.sheet_to_json(sheet, { defval: null, raw: false });
}

function normalizeHeaderKey(key) {
  return String(key || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeRow(row) {
  return Object.entries(row || {}).reduce((accumulator, [key, value]) => {
    accumulator[normalizeHeaderKey(key)] = value;
    return accumulator;
  }, {});
}

function getValue(row, candidates, fallback = null) {
  for (const key of candidates) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
      return row[key];
    }
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

        const rawDate = getValue(data, [
          "tgl", "tanggal", "date",
          "tgl_faktur", "tanggal_faktur",
          "tgl_dokumen", "tanggal_dokumen",
          "tgl_transaksi", "tanggal_transaksi",
          "tgl_so", "tanggal_so",
          "tgl_invoice", "tanggal_invoice"
        ]);
        const tanggal = excelDateToIso(rawDate);

        const rawMonth = getValue(data, ["bulan_nama", "bulan", "month"]);
        const bulanNama = normalizeMonthName(rawMonth || (tanggal ? new Date(tanggal).toLocaleString("en-US", { month: "short" }) : "JAN"));

        const rawYear = getValue(data, ["tahun", "year"]);
        const tahun = Number(rawYear || (tanggal ? new Date(tanggal).getFullYear() : new Date().getFullYear()));

        const jenis = getValue(data, ["jenis"]);
        const nofaktur = getValue(data, [
          "nofaktur", "no_faktur", "no_fak", "nofak",
          "no_invoice", "no_inv", "invoice_no",
          "nomor_faktur", "no_dokumen", "nomor_dokumen"
        ]);
        const noso = getValue(data, ["noso", "no_so", "no_so"]);
        const tutupso = getValue(data, ["tutupso", "tutup_so"]);
        const jatuh_tempo = excelDateToIso(getValue(data, ["jatuh_tempo", "due_date", "due_date"]));

        const kodecustomer = getValue(data, [
          "kode_customer", "kodecustomer", "kode_pelanggan", "kodepelanggan",
          "cust_code", "kode_cust", "kodecust"
        ]);
        const namacustomer = getValue(data, [
          "nama_customer", "namacustomer", "customer_name", "nama_pelanggan",
          "namapelanggan", "cust_name", "nama_cust", "namacust"
        ]);
        const alamatcustomer = getValue(data, ["alamat_customer", "alamatcustomer", "address", "alamat"]);

        const kodeSalesman = getValue(data, ["kode_salesman", "kodesalesman", "kode_sales", "kodesales", "sales_code"]);
        const namaSalesman = getValue(data, ["nama_salesman", "namasalesman", "nama_sales", "namasales", "sales_name"]);
        const kodeGudang = getValue(data, ["kode_gudang", "kodegudang", "gudang", "wh_code", "kode_wh"]);
        const namaGudang = getValue(data, ["nama_gudang", "namagudang", "nama_wh", "wh_name"]);

        const kodeProduk = getValue(data, [
          "kode_barang", "kodebarang", "kode_produk", "kodeproduk",
          "item_code", "kode_item", "kodeitem"
        ]);
        const namaProduk = getValue(data, [
          "nama_barang", "namabarang", "nama_produk", "namaproduk",
          "item_name", "nama_item", "namaitem"
        ]);

        const kodeSuplier = getValue(data, ["kode_suplier", "kode_supplier", "kodesupplier", "vendor_code", "kode_vendor"]);
        const namaSuplier = getValue(data, ["nama_suplier", "nama_supplier", "namasupplier", "vendor_name", "nama_vendor"]);

        const ensuredSalesman = await model.ensureDimLookup(conn, "dim_salesman", "kode_salesman", kodeSalesman, "nama_salesman", namaSalesman);
        const ensuredGudang = await model.ensureDimLookup(conn, "dim_gudang", "kode_gudang", kodeGudang, "nama_gudang", namaGudang);
        const ensuredSupplier = await model.ensureDimLookup(conn, "dim_supplier", "kode_supplier", kodeSuplier, "nama_supplier", namaSuplier);

        const productId = await model.getOrCreateProduct(conn, namaProduk, kodeProduk);

        const quantity = toNumber(getValue(data, [
          "qty", "quantity", "jumlah", "quantity_pcs", "qty_pcs", "pcs"
        ]), 0);
        const hargajual = toNumber(getValue(data, ["hargajual", "harga_jual", "price", "harga", "hargasatuan", "harga_satuan"]), 0);
        const netto = toNumber(getValue(data, [
          "netto", "total_sales", "nilai_penjualan",
          "nilai", "net_amount", "amount", "total",
          "subtotal", "nilai_netto", "dpp"
        ]), 0) || quantity * hargajual;

        const pdiscountitem = toNumber(getValue(data, ["pdiscountitem", "p_discount_item"]), 0);
        const pdiscountitem2 = toNumber(getValue(data, ["pdiscountitem2", "p_discount_item2"]), 0);
        const pdiscountitem3 = toNumber(getValue(data, ["pdiscountitem3", "p_discount_item3"]), 0);
        const discountitem = toNumber(getValue(data, ["discountitem", "discount_item"]), 0);
        const satuanKecil = getValue(data, ["satuan_kecil", "satuan", "satuan_kecil"]);
        const keterangan = getValue(data, ["keterangan", "notes", "remark"]);

        if (tanggal && (quantity > 0 || netto > 0)) {
          const result = await model.insertSalesRow(conn, {
            uploadLogId, jenis, nofaktur, tanggal, noso, tutupso, jatuh_tempo,
            kodecustomer, namacustomer, alamatcustomer,
            ensuredSalesman, kodeSalesman, namaSalesman, ensuredGudang, kodeGudang, namaGudang,
            kodeProduk, namaProduk, productId,
            quantity, hargajual, satuanKecil, pdiscountitem, pdiscountitem2, pdiscountitem3, discountitem,
            netto, keterangan, ensuredSupplier, kodeSuplier, namaSuplier
          });

          try {
            const insertId = result && (result.insertId || (result[0] && result[0].insertId));
            console.log(`Inserted fact_sales row id=${insertId || "unknown"} nofaktur=${nofaktur || ""} qty=${quantity} netto=${netto}`);
          } catch (e) {
            console.log("fact_sales insert executed (no insertId available).");
          }

          processedRows += 1;
        } else {
          console.log(`Skipped import row — tanggal=${tanggal} qty=${quantity} netto=${netto} nofaktur=${nofaktur || ""}`);
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
      } catch (e) {
        // ignore
      }
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
