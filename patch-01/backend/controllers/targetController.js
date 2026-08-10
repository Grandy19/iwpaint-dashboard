const pool = require("../config/db");

function monthNameToNum(name) {
  const map = {
    januari: 1, jan: 1,
    februari: 2, feb: 2,
    maret: 3, mar: 3,
    april: 4, apr: 4,
    mei: 5, may: 5,
    juni: 6, jun: 6,
    juli: 7, jul: 7,
    agustus: 8, agu: 8, aug: 8,
    september: 9, sep: 9,
    oktober: 10, okt: 10, oct: 10,
    november: 11, nov: 11,
    desember: 12, des: 12, dec: 12
  };
  const cleaned = String(name || "").toLowerCase().trim();
  return map[cleaned] || 7;
}

async function getTargets(req, res, next) {
  try {
    const { tahun = 2026, bulan_nama = "Juli", salesman, supervisor, area, periodeAwal, periodeAkhir } = req.query;
    const monthNum = monthNameToNum(bulan_nama);

    // Get all sales users with their area & supervisor
    let usersQuery = "SELECT name, area, supervisor_name, kode_salesman FROM users WHERE role = 'sales'";
    const usersParams = [];
    if (salesman && salesman !== "Semua Sales") {
      usersQuery += " AND name = ?";
      usersParams.push(salesman);
    } else if (supervisor && supervisor !== "Semua Supervisor") {
      usersQuery += " AND supervisor_name = ?";
      usersParams.push(supervisor);
    } else if (area && area !== "Semua Area") {
      usersQuery += " AND area = ?";
      usersParams.push(area);
    }
    const [salesUsers] = await pool.query(usersQuery, usersParams);

    const resultData = [];

    for (const user of salesUsers) {
      let target = null;
      let targetDeco = 0;
      let targetAuto = 0;
      let targetInd = 0;
      let real = { realisasi_deco: 0, realisasi_auto: 0, realisasi_ind: 0 };

      if (user.kode_salesman) {
        let targetQuery = "";
        let targetParams = [];

        if (periodeAwal && periodeAkhir) {
          const monthCase = `CASE LOWER(bulan_nama) WHEN 'januari' THEN '01' WHEN 'februari' THEN '02' WHEN 'maret' THEN '03' WHEN 'april' THEN '04' WHEN 'mei' THEN '05' WHEN 'juni' THEN '06' WHEN 'juli' THEN '07' WHEN 'agustus' THEN '08' WHEN 'september' THEN '09' WHEN 'oktober' THEN '10' WHEN 'november' THEN '11' WHEN 'desember' THEN '12' END`;
          targetQuery = `SELECT SUM(target_deco) as target_deco, SUM(target_auto) as target_auto, SUM(target_ind) as target_ind FROM fact_targets WHERE kode_salesman = ? AND DATE(CONCAT(tahun, '-', ${monthCase}, '-01')) BETWEEN DATE(CONCAT(LEFT(?, 7), '-01')) AND DATE(CONCAT(LEFT(?, 7), '-01'))`;
          targetParams = [user.kode_salesman, periodeAwal, periodeAkhir];
        } else {
          targetQuery = "SELECT * FROM fact_targets WHERE kode_salesman = ? AND tahun = ? AND bulan_nama = ? LIMIT 1";
          targetParams = [user.kode_salesman, tahun, bulan_nama];
        }

        const [targetRows] = await pool.query(targetQuery, targetParams);
        if (targetRows.length > 0 && (targetRows[0].target_deco != null || targetRows[0].tahun)) {
          target = targetRows[0];
          targetDeco = Number(target.target_deco || 0);
          targetAuto = Number(target.target_auto || 0);
          targetInd = Number(target.target_ind || 0);
        }
      }

      // Get realisasi from fact_sales
      let realQuery = `SELECT 
         COALESCE(SUM(CASE WHEN UPPER(TRIM(p.kategori)) = 'DECORATIVE' THEN f.netto ELSE 0 END), 0) AS realisasi_deco,
         COALESCE(SUM(CASE WHEN UPPER(TRIM(p.kategori)) = 'AUTOMOTIVE' THEN f.netto ELSE 0 END), 0) AS realisasi_auto,
         COALESCE(SUM(CASE WHEN UPPER(TRIM(p.kategori)) = 'INDUSTRIAL' THEN f.netto ELSE 0 END), 0) AS realisasi_ind,
         COUNT(DISTINCT f.nofaktur) AS total_transaksi,
         COALESCE(SUM(f.qty * COALESCE(p.berat, 1.0)), 0) AS total_qty
       FROM fact_sales f
       LEFT JOIN dim_products p ON (p.id = f.product_id OR p.kode_produk = f.kode_barang)
       WHERE f.nama_salesman = ?`;
      let realParams = [user.name];

      if (periodeAwal && periodeAkhir) {
        realQuery += ` AND f.tanggal BETWEEN ? AND ?`;
        realParams.push(periodeAwal, periodeAkhir);
      } else {
        realQuery += ` AND YEAR(f.tanggal) = ? AND MONTH(f.tanggal) = ?`;
        realParams.push(tahun, monthNum);
      }

      const [realisasiRows] = await pool.query(realQuery, realParams);
      real = realisasiRows[0] || real;

      const totalTarget = targetDeco + targetAuto + targetInd;

      const realDeco = Number(real.realisasi_deco);
      const realAuto = Number(real.realisasi_auto);
      const realInd = Number(real.realisasi_ind);
      const totalRealisasi = realDeco + realAuto + realInd;

      const rawPercentage = totalTarget > 0 ? Number(((totalRealisasi / totalTarget) * 100).toFixed(2)) : 0;
      const percentage = Math.min(rawPercentage, 100);

      resultData.push({
        id: target ? target.id : Math.random(),
        sales: user.name,
        kodeSalesman: user.kode_salesman,
        area: user.area || "-",
        supervisor: user.supervisor_name,
        decorative: target ? `Rp ${Number(target.target_deco / 1e6).toLocaleString("id-ID")} Jt` : "-",
        automotive: target ? `Rp ${Number(target.target_auto / 1e6).toLocaleString("id-ID")} Jt` : "-",
        industri: target ? `Rp ${Number(target.target_ind / 1e6).toLocaleString("id-ID")} Jt` : "-",
        raw_target_deco: targetDeco,
        raw_target_auto: targetAuto,
        raw_target_ind: targetInd,
        totalTarget: totalTarget > 0 ? `Rp ${Number(totalTarget / 1e6).toLocaleString("id-ID")} Jt` : "-",
        raw_total_target: totalTarget,
        status: target ? "Sudah Input" : "Belum Input",
        realisasi_deco: realDeco,
        realisasi_auto: realAuto,
        realisasi_ind: realInd,
        totalRealisasi: totalRealisasi >= 1e9 ? `Rp ${(totalRealisasi / 1e9).toFixed(1)} M` : `Rp ${(totalRealisasi / 1e6).toFixed(1)} Jt`,
        percentage: percentage,
        totalTransaksi: real.total_transaksi || 0,
        totalQty: Number(real.total_qty || 0).toFixed(1)
      });
    }

    res.json({ data: resultData });
  } catch (err) {
    next(err);
  }
}

async function saveTarget(req, res, next) {
  try {
    const { sales, tahun = 2026, bulan_nama = "Juli", decorative = 0, automotive = 0, industri = 0 } = req.body;

    if (!sales) {
      return res.status(400).json({ message: "Nama sales wajib diisi." });
    }

    // Look up the sales user to get their kode_salesman
    const [userRows] = await pool.query("SELECT kode_salesman FROM users WHERE name = ? AND role = 'sales' LIMIT 1", [sales]);
    if (userRows.length === 0 || !userRows[0].kode_salesman) {
      return res.status(400).json({ message: `Sales '${sales}' tidak memiliki kode_salesman yang terhubung.` });
    }

    const kodeSalesman = userRows[0].kode_salesman;

    await pool.query(
      `INSERT INTO fact_targets (kode_salesman, tahun, bulan_nama, target_deco, target_auto, target_ind) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         target_deco = VALUES(target_deco), 
         target_auto = VALUES(target_auto), 
         target_ind = VALUES(target_ind)`,
      [kodeSalesman, tahun, bulan_nama, decorative, automotive, industri]
    );

    res.json({ message: "Target berhasil disimpan" });
  } catch (err) {
    next(err);
  }
}

async function getTargetPerformance(req, res, next) {
  try {
    const { tahun = 2026, bulan_nama = "Juli", salesman, supervisor, area, periodeAwal, periodeAkhir } = req.query;
    const monthNum = monthNameToNum(bulan_nama);

    let salesQuery = "SELECT name, area, kode_salesman FROM users WHERE role = 'sales'";
    const salesParams = [];

    if (salesman && salesman !== "Semua Sales") {
      salesQuery += " AND name = ?";
      salesParams.push(salesman);
    } else if (supervisor && supervisor !== "Semua Supervisor") {
      salesQuery += " AND supervisor_name = ?";
      salesParams.push(supervisor);
    } else if (area && area !== "Semua Area") {
      salesQuery += " AND area = ?";
      salesParams.push(area);
    }

    const [salesUsers] = await pool.query(salesQuery, salesParams);
    const salesmanNames = salesUsers.map(u => u.name);

    if (salesmanNames.length === 0) {
      return res.json({
        percentage: 0,
        targetGlobal: "Rp 0 Jt",
        realisasi: "Rp 0 Jt",
        selisih: "Rp 0 Jt",
        raw_target: 0,
        raw_realisasi: 0
      });
    }

    // Get combined targets using inner join on users
    let targetRows, realisasiRows;

    if (periodeAwal && periodeAkhir) {
      const monthCase = `CASE LOWER(t.bulan_nama) WHEN 'januari' THEN '01' WHEN 'februari' THEN '02' WHEN 'maret' THEN '03' WHEN 'april' THEN '04' WHEN 'mei' THEN '05' WHEN 'juni' THEN '06' WHEN 'juli' THEN '07' WHEN 'agustus' THEN '08' WHEN 'september' THEN '09' WHEN 'oktober' THEN '10' WHEN 'november' THEN '11' WHEN 'desember' THEN '12' END`;
      [targetRows] = await pool.query(
        `SELECT SUM(t.target_deco + t.target_auto + t.target_ind) AS total_target 
         FROM fact_targets t 
         INNER JOIN users u ON u.kode_salesman = t.kode_salesman 
         WHERE u.name IN (?) 
           AND DATE(CONCAT(t.tahun, '-', ${monthCase}, '-01')) BETWEEN DATE(CONCAT(LEFT(?, 7), '-01')) AND DATE(CONCAT(LEFT(?, 7), '-01'))`,
        [salesmanNames, periodeAwal, periodeAkhir]
      );

      [realisasiRows] = await pool.query(
        `SELECT SUM(f.netto) AS total_realisasi
         FROM fact_sales f
         WHERE f.nama_salesman IN (?) 
           AND f.tanggal BETWEEN ? AND ?`,
        [salesmanNames, periodeAwal, periodeAkhir]
      );
    } else {
      [targetRows] = await pool.query(
        "SELECT SUM(t.target_deco + t.target_auto + t.target_ind) AS total_target FROM fact_targets t INNER JOIN users u ON u.kode_salesman = t.kode_salesman WHERE u.name IN (?) AND t.tahun = ? AND t.bulan_nama = ?",
        [salesmanNames, tahun, bulan_nama]
      );

      [realisasiRows] = await pool.query(
        `SELECT SUM(f.netto) AS total_realisasi
         FROM fact_sales f
         WHERE f.nama_salesman IN (?) 
           AND YEAR(f.tanggal) = ? 
           AND MONTH(f.tanggal) = ?`,
        [salesmanNames, tahun, monthNum]
      );
    }

    const totalTarget = Number(targetRows[0].total_target || 0);
    const totalRealisasi = Number(realisasiRows[0].total_realisasi || 0);
    const selisih = totalTarget - totalRealisasi;
    const rawPercentage = totalTarget > 0 ? Number(((totalRealisasi / totalTarget) * 100).toFixed(2)) : 0;
    const percentage = Math.min(rawPercentage, 100);

    res.json({
      percentage,
      targetGlobal: totalTarget >= 1e9 ? `Rp ${(totalTarget / 1e9).toFixed(1)} M` : `Rp ${(totalTarget / 1e6).toFixed(1)} Jt`,
      realisasi: totalRealisasi >= 1e9 ? `Rp ${(totalRealisasi / 1e9).toFixed(1)} M` : `Rp ${(totalRealisasi / 1e6).toFixed(1)} Jt`,
      selisih: selisih >= 1e9 ? `Rp ${(selisih / 1e9).toFixed(1)} M` : (selisih >= 0 ? `Rp ${(selisih / 1e6).toFixed(1)} Jt` : `Rp 0 Jt`),
      raw_target: totalTarget,
      raw_realisasi: totalRealisasi
    });
  } catch (err) {
    next(err);
  }
}

async function getTargetHistory(req, res, next) {
  try {
    const { salesman, supervisor } = req.query;
    if (!salesman && !supervisor) {
      return res.status(400).json({ error: "salesman or supervisor is required" });
    }

    let usersQuery = "SELECT name, kode_salesman FROM users WHERE role = 'sales'";
    let usersParams = [];
    if (salesman && salesman !== "Semua Sales") {
      usersQuery += " AND name = ?";
      usersParams.push(salesman);
    } else if (supervisor) {
      usersQuery += " AND supervisor_name = ?";
      usersParams.push(supervisor);
    }

    const [users] = await pool.query(usersQuery, usersParams);
    if (users.length === 0) {
      return res.json({ data: [] });
    }

    const kodeSalesmen = users.map(u => u.kode_salesman).filter(Boolean);
    const userNames = users.map(u => u.name);
    
    if (kodeSalesmen.length === 0) {
      return res.json({ data: [] });
    }

    const [targets] = await pool.query(
      `SELECT tahun, bulan_nama, SUM(target_deco) as target_deco, SUM(target_auto) as target_auto, SUM(target_ind) as target_ind 
       FROM fact_targets 
       WHERE kode_salesman IN (?) 
       GROUP BY tahun, bulan_nama 
       ORDER BY tahun DESC, 
         CASE LOWER(bulan_nama) 
           WHEN 'januari' THEN 1 WHEN 'februari' THEN 2 WHEN 'maret' THEN 3 WHEN 'april' THEN 4 
           WHEN 'mei' THEN 5 WHEN 'juni' THEN 6 WHEN 'juli' THEN 7 WHEN 'agustus' THEN 8 
           WHEN 'september' THEN 9 WHEN 'oktober' THEN 10 WHEN 'november' THEN 11 WHEN 'desember' THEN 12 
         END DESC`,
      [kodeSalesmen]
    );

    const historyData = [];

    for (const target of targets) {
      const monthNum = monthNameToNum(target.bulan_nama);
      const [realisasiRows] = await pool.query(
        `SELECT SUM(netto) AS total_realisasi FROM fact_sales 
         WHERE nama_salesman IN (?) AND YEAR(tanggal) = ? AND MONTH(tanggal) = ?`,
        [userNames, target.tahun, monthNum]
      );

      const totalTarget = Number(target.target_deco) + Number(target.target_auto) + Number(target.target_ind);
      const totalRealisasi = Number(realisasiRows[0]?.total_realisasi || 0);
      const rawPercentage = totalTarget > 0 ? Number(((totalRealisasi / totalTarget) * 100).toFixed(2)) : 0;
      const percentage = Math.min(rawPercentage, 100);

      historyData.push({
        id: `${target.tahun}-${target.bulan_nama}`,
        periode: `${target.bulan_nama} ${target.tahun}`,
        target: totalTarget >= 1e9 ? `Rp ${(totalTarget / 1e9).toFixed(1)} M` : `Rp ${(totalTarget / 1e6).toFixed(1)} Jt`,
        realisasi: totalRealisasi >= 1e9 ? `Rp ${(totalRealisasi / 1e9).toFixed(1)} M` : `Rp ${(totalRealisasi / 1e6).toFixed(1)} Jt`,
        pencapaian: `${percentage}%`,
        status: percentage >= 100 ? "Tercapai" : "Belum Tercapai"
      });
    }

    res.json({ data: historyData });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTargets,
  saveTarget,
  getTargetPerformance,
  getTargetHistory
};
