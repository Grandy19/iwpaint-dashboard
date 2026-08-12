import os

controller_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\targetController.js"

content = """const pool = require("../config/db");

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

function mapKategoriDB(k) {
  if (!k) return k;
  const upper = k.toUpperCase();
  if (upper === 'INDUSTRI') return 'INDUSTRIAL';
  if (upper === 'AUTOMOTIVE') return 'AUTOMOTIVE';
  if (upper === 'DECORATIVE') return 'DECORATIVE';
  return upper;
}

async function getTargets(req, res, next) {
  try {
    const { tahun = 2026, bulan_nama = "Juli", salesman, supervisor, area, periodeAwal, periodeAkhir } = req.query;
    const monthNum = monthNameToNum(bulan_nama);

    let usersQuery = `
      SELECT u.user_id, u.name, sup.area, sup_user.name as supervisor_name, s.kode_salesman, s.salesman_id
      FROM users u
      JOIN salesmen s ON u.user_id = s.salesman_id
      JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      WHERE u.role = 'sales'
    `;
    const usersParams = [];
    
    if (salesman && salesman !== "Semua Sales") {
      usersQuery += " AND u.name = ?";
      usersParams.push(salesman);
    } else if (supervisor && supervisor !== "Semua Supervisor") {
      usersQuery += " AND sup_user.name = ?";
      usersParams.push(supervisor);
    } else if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      usersQuery += " AND sup.area IN (?)";
      usersParams.push(matchedAreas);
    }

    const [salesUsers] = await pool.query(usersQuery, usersParams);

    const resultData = [];

    for (const user of salesUsers) {
      // Find target for this salesman
      const [targetRows] = await pool.query(
        "SELECT target_deco, target_auto, target_ind FROM salesman_targets WHERE salesman_id = ? AND tahun = ? AND bulan_nama = ? LIMIT 1",
        [user.salesman_id, tahun, bulan_nama]
      );
      
      let targetDeco = 0, targetAuto = 0, targetInd = 0;
      if (targetRows.length > 0) {
        targetDeco = Number(targetRows[0].target_deco) || 0;
        targetAuto = Number(targetRows[0].target_auto) || 0;
        targetInd = Number(targetRows[0].target_ind) || 0;
      }
      const totalTarget = targetDeco + targetAuto + targetInd;

      // Realisasi DECO
      let qDeco = `
        SELECT COALESCE(SUM(f.netto), 0) AS val 
        FROM sales_transactions f 
        JOIN products p ON f.product_id = p.product_id 
        WHERE f.salesman_id = ? AND p.kategori = 'DECORATIVE'
      `;
      let pDeco = [user.salesman_id];
      if (periodeAwal) { qDeco += " AND DATE(f.tanggal) >= ?"; pDeco.push(periodeAwal); }
      if (periodeAkhir) { qDeco += " AND DATE(f.tanggal) <= ?"; pDeco.push(periodeAkhir); }
      if (!periodeAwal && !periodeAkhir) { qDeco += " AND MONTH(f.tanggal) = ? AND YEAR(f.tanggal) = ?"; pDeco.push(monthNum, tahun); }
      
      const [rowDeco] = await pool.query(qDeco, pDeco);
      const realDeco = Number(rowDeco[0].val);

      // Realisasi AUTO
      let qAuto = `
        SELECT COALESCE(SUM(f.netto), 0) AS val 
        FROM sales_transactions f 
        JOIN products p ON f.product_id = p.product_id 
        WHERE f.salesman_id = ? AND p.kategori = 'AUTOMOTIVE'
      `;
      let pAuto = [user.salesman_id];
      if (periodeAwal) { qAuto += " AND DATE(f.tanggal) >= ?"; pAuto.push(periodeAwal); }
      if (periodeAkhir) { qAuto += " AND DATE(f.tanggal) <= ?"; pAuto.push(periodeAkhir); }
      if (!periodeAwal && !periodeAkhir) { qAuto += " AND MONTH(f.tanggal) = ? AND YEAR(f.tanggal) = ?"; pAuto.push(monthNum, tahun); }

      const [rowAuto] = await pool.query(qAuto, pAuto);
      const realAuto = Number(rowAuto[0].val);

      // Realisasi IND
      let qInd = `
        SELECT COALESCE(SUM(f.netto), 0) AS val 
        FROM sales_transactions f 
        JOIN products p ON f.product_id = p.product_id 
        WHERE f.salesman_id = ? AND p.kategori = 'INDUSTRIAL'
      `;
      let pInd = [user.salesman_id];
      if (periodeAwal) { qInd += " AND DATE(f.tanggal) >= ?"; pInd.push(periodeAwal); }
      if (periodeAkhir) { qInd += " AND DATE(f.tanggal) <= ?"; pInd.push(periodeAkhir); }
      if (!periodeAwal && !periodeAkhir) { qInd += " AND MONTH(f.tanggal) = ? AND YEAR(f.tanggal) = ?"; pInd.push(monthNum, tahun); }

      const [rowInd] = await pool.query(qInd, pInd);
      const realInd = Number(rowInd[0].val);

      const totalRealisasi = realDeco + realAuto + realInd;

      resultData.push({
        id: user.user_id,
        sales: user.name,
        supervisor: user.supervisor_name,
        area: user.area,
        totalTarget,
        totalRealisasi,
        persentaseTotal: totalTarget > 0 ? (totalRealisasi / totalTarget) * 100 : 0,
        kategori: {
          deco: { target: targetDeco, realisasi: realDeco, persentase: targetDeco > 0 ? (realDeco / targetDeco) * 100 : 0 },
          auto: { target: targetAuto, realisasi: realAuto, persentase: targetAuto > 0 ? (realAuto / targetAuto) * 100 : 0 },
          ind: { target: targetInd, realisasi: realInd, persentase: targetInd > 0 ? (realInd / targetInd) * 100 : 0 }
        }
      });
    }

    res.json({ data: resultData });
  } catch (err) {
    next(err);
  }
}

async function updateTarget(req, res, next) {
  try {
    const { id } = req.params;
    const { sales, target_deco, target_auto, target_ind, bulan_nama, tahun } = req.body;

    const [uRows] = await pool.query("SELECT user_id FROM users WHERE name = ? AND role = 'sales' LIMIT 1", [sales]);
    if (uRows.length === 0) {
      return res.status(404).json({ message: "Sales tidak ditemukan" });
    }
    const salesmanId = uRows[0].user_id;

    const [existing] = await pool.query(
      "SELECT * FROM salesman_targets WHERE salesman_id = ? AND tahun = ? AND bulan_nama = ? LIMIT 1",
      [salesmanId, tahun, bulan_nama]
    );

    if (existing.length === 0) {
      await pool.query(
        "INSERT INTO salesman_targets (salesman_id, tahun, bulan_nama, target_deco, target_auto, target_ind) VALUES (?, ?, ?, ?, ?, ?)",
        [salesmanId, tahun, bulan_nama, target_deco, target_auto, target_ind]
      );
    } else {
      await pool.query(
        "UPDATE salesman_targets SET target_deco = ?, target_auto = ?, target_ind = ? WHERE salesman_id = ? AND tahun = ? AND bulan_nama = ?",
        [target_deco, target_auto, target_ind, salesmanId, tahun, bulan_nama]
      );
    }

    res.json({ message: "Target berhasil diperbarui" });
  } catch (err) {
    next(err);
  }
}

async function getTargetKPIs(req, res, next) {
  try {
    const { tahun = 2026, bulan_nama = "Juli", salesman, supervisor, area, periodeAwal, periodeAkhir } = req.query;
    const monthNum = monthNameToNum(bulan_nama);

    let usersQuery = `
      SELECT u.user_id, u.name, sup.area, sup_user.name as supervisor_name
      FROM users u
      JOIN salesmen s ON u.user_id = s.salesman_id
      JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      WHERE u.role = 'sales'
    `;
    const usersParams = [];
    if (salesman && salesman !== "Semua Sales") { usersQuery += " AND u.name = ?"; usersParams.push(salesman); }
    if (supervisor && supervisor !== "Semua Supervisor") { usersQuery += " AND sup_user.name = ?"; usersParams.push(supervisor); }
    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      usersQuery += " AND sup.area IN (?)";
      usersParams.push(matchedAreas);
    }

    const [salesUsers] = await pool.query(usersQuery, usersParams);
    if (salesUsers.length === 0) {
      return res.json({ targetBulanIni: 0, pencapaianBulanIni: 0, pencapaianPersen: 0 });
    }

    const userIds = salesUsers.map(u => u.user_id);

    // Sum targets
    const [targetRows] = await pool.query(
      "SELECT SUM(target_deco + target_auto + target_ind) AS total_target FROM salesman_targets WHERE salesman_id IN (?) AND tahun = ? AND bulan_nama = ?",
      [userIds, tahun, bulan_nama]
    );
    const totalTarget = Number(targetRows[0].total_target || 0);

    // Sum realisasi
    let realQuery = "SELECT COALESCE(SUM(f.netto), 0) AS total_realisasi FROM sales_transactions f WHERE f.salesman_id IN (?)";
    let realParams = [userIds];
    
    if (periodeAwal) { realQuery += " AND DATE(f.tanggal) >= ?"; realParams.push(periodeAwal); }
    if (periodeAkhir) { realQuery += " AND DATE(f.tanggal) <= ?"; realParams.push(periodeAkhir); }
    if (!periodeAwal && !periodeAkhir) { realQuery += " AND MONTH(f.tanggal) = ? AND YEAR(f.tanggal) = ?"; realParams.push(monthNum, tahun); }

    const [realRows] = await pool.query(realQuery, realParams);
    const totalRealisasi = Number(realRows[0].total_realisasi || 0);

    res.json({
      targetBulanIni: totalTarget,
      pencapaianBulanIni: totalRealisasi,
      pencapaianPersen: totalTarget > 0 ? (totalRealisasi / totalTarget) * 100 : 0
    });
  } catch (err) {
    next(err);
  }
}

async function getPerformaArea(req, res, next) {
  try {
    const { tahun = 2026, bulan_nama = "Juli", periodeAwal, periodeAkhir } = req.query;
    const monthNum = monthNameToNum(bulan_nama);

    let areaQuery = `
      SELECT sup.area, u.user_id
      FROM users u
      JOIN salesmen s ON u.user_id = s.salesman_id
      JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      WHERE u.role = 'sales'
    `;
    const [salesRows] = await pool.query(areaQuery);

    const areasMap = {};
    for (const r of salesRows) {
      if (!areasMap[r.area]) areasMap[r.area] = [];
      areasMap[r.area].push(r.user_id);
    }

    const regionalMap = {
      "Jawa Barat": ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"],
      "DKI Jakarta": ["Jakarta"],
      "Jawa Tengah": ["Semarang"],
      "Jawa Timur": ["Surabaya"],
      "Sumatera": ["Medan"]
    };

    const regionalStats = {};
    for (const region of Object.keys(regionalMap)) {
      regionalStats[region] = { target: 0, realisasi: 0 };
      
      let regionUserIds = [];
      for (const city of regionalMap[region]) {
        if (areasMap[city]) {
          regionUserIds = regionUserIds.concat(areasMap[city]);
        }
      }

      if (regionUserIds.length > 0) {
        const [targetRows] = await pool.query(
          "SELECT SUM(target_deco + target_auto + target_ind) AS val FROM salesman_targets WHERE salesman_id IN (?) AND tahun = ? AND bulan_nama = ?",
          [regionUserIds, tahun, bulan_nama]
        );
        regionalStats[region].target = Number(targetRows[0].val || 0);

        let rQ = "SELECT COALESCE(SUM(f.netto), 0) AS val FROM sales_transactions f WHERE f.salesman_id IN (?)";
        let rP = [regionUserIds];
        if (periodeAwal) { rQ += " AND DATE(f.tanggal) >= ?"; rP.push(periodeAwal); }
        if (periodeAkhir) { rQ += " AND DATE(f.tanggal) <= ?"; rP.push(periodeAkhir); }
        if (!periodeAwal && !periodeAkhir) { rQ += " AND MONTH(f.tanggal) = ? AND YEAR(f.tanggal) = ?"; rP.push(monthNum, tahun); }

        const [realRows] = await pool.query(rQ, rP);
        regionalStats[region].realisasi = Number(realRows[0].val || 0);
      }
    }

    const result = Object.keys(regionalStats).map(name => {
      const { target, realisasi } = regionalStats[name];
      return {
        name,
        target,
        realisasi,
        persentase: target > 0 ? (realisasi / target) * 100 : 0
      };
    });

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function getPerformaSupervisor(req, res, next) {
  try {
    const { tahun = 2026, bulan_nama = "Juli", area, periodeAwal, periodeAkhir } = req.query;
    const monthNum = monthNameToNum(bulan_nama);

    let usersQuery = `
      SELECT sup_user.name as supervisor_name, sup.area, u.user_id
      FROM users u
      JOIN salesmen s ON u.user_id = s.salesman_id
      JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      WHERE u.role = 'sales'
    `;
    const usersParams = [];
    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      usersQuery += " AND sup.area IN (?)";
      usersParams.push(matchedAreas);
    }

    const [salesUsers] = await pool.query(usersQuery, usersParams);
    
    const supervisorMap = {};
    salesUsers.forEach(u => {
      if (!supervisorMap[u.supervisor_name]) supervisorMap[u.supervisor_name] = { area: u.area, userIds: [] };
      supervisorMap[u.supervisor_name].userIds.push(u.user_id);
    });

    const result = [];
    for (const supName of Object.keys(supervisorMap)) {
      const supData = supervisorMap[supName];
      const userIds = supData.userIds;

      const [targetRows] = await pool.query(
        "SELECT SUM(target_deco + target_auto + target_ind) AS val FROM salesman_targets WHERE salesman_id IN (?) AND tahun = ? AND bulan_nama = ?",
        [userIds, tahun, bulan_nama]
      );
      const target = Number(targetRows[0].val || 0);

      let rQ = "SELECT COALESCE(SUM(f.netto), 0) AS val FROM sales_transactions f WHERE f.salesman_id IN (?)";
      let rP = [userIds];
      if (periodeAwal) { rQ += " AND DATE(f.tanggal) >= ?"; rP.push(periodeAwal); }
      if (periodeAkhir) { rQ += " AND DATE(f.tanggal) <= ?"; rP.push(periodeAkhir); }
      if (!periodeAwal && !periodeAkhir) { rQ += " AND MONTH(f.tanggal) = ? AND YEAR(f.tanggal) = ?"; rP.push(monthNum, tahun); }

      const [realRows] = await pool.query(rQ, rP);
      const realisasi = Number(realRows[0].val || 0);

      result.push({
        supervisor: supName,
        area: supData.area,
        target,
        realisasi,
        persentase: target > 0 ? (realisasi / target) * 100 : 0
      });
    }

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getTargets,
  updateTarget,
  getTargetKPIs,
  getPerformaArea,
  getPerformaSupervisor
};
"""

with open(controller_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated targetController.js")
