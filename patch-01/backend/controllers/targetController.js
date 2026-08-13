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

function buildTargetFilter(periodeAwal, periodeAkhir, fallbackTahun, fallbackBulanNama) {
  let queryPart = "";
  let params = [];
  if (periodeAwal && periodeAkhir) {
    const start = new Date(periodeAwal);
    const end = new Date(periodeAkhir);
    const indMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    
    let curr = new Date(start.getFullYear(), start.getMonth(), 1);
    const endLimit = new Date(end.getFullYear(), end.getMonth(), 1);
    const conditions = [];
    
    while (curr <= endLimit) {
      conditions.push("(tahun = ? AND bulan_nama = ?)");
      params.push(curr.getFullYear(), indMonths[curr.getMonth()]);
      curr.setMonth(curr.getMonth() + 1);
    }
    
    if (conditions.length > 0) {
      queryPart = ` AND (${conditions.join(" OR ")})`;
    } else {
      queryPart = " AND 1=0";
    }
  } else {
    queryPart = " AND tahun = ? AND bulan_nama = ?";
    params = [fallbackTahun, fallbackBulanNama];
  }
  return { queryPart, params };
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
      const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
      const [targetRows] = await pool.query(
        `SELECT SUM(target_deco) as target_deco, SUM(target_auto) as target_auto, SUM(target_ind) as target_ind FROM salesman_targets WHERE salesman_id = ? ${targetFilter.queryPart}`,
        [user.salesman_id, ...targetFilter.params]
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

      const formatRp = (num) => `Rp ${Number(num / 1e6).toFixed(1)} Jt`.replace('.', ',');

      resultData.push({
        id: user.user_id,
        sales: user.name,
        supervisor: user.supervisor_name,
        area: user.area,
        decorative: formatRp(targetDeco),
        automotive: formatRp(targetAuto),
        industri: formatRp(targetInd),
        totalTarget: formatRp(totalTarget),
        status: totalTarget > 0 ? 'Sudah Input' : 'Belum Input',
        
        raw_target_deco: targetDeco,
        realisasi_deco: realDeco,
        raw_target_auto: targetAuto,
        realisasi_auto: realAuto,
        raw_target_ind: targetInd,
        realisasi_ind: realInd,
        totalRealisasi: totalRealisasi,
        percentage: totalTarget > 0 ? Math.min(Math.round((totalRealisasi / totalTarget) * 100), 100) : 0,

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
    const { sales, bulan_nama, tahun } = req.body;
    const target_deco = req.body.decorative ?? req.body.target_deco ?? 0;
    const target_auto = req.body.automotive ?? req.body.target_auto ?? 0;
    const target_ind = req.body.industri ?? req.body.target_ind ?? 0;

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
    const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
    const [targetRows] = await pool.query(
      `SELECT SUM(target_deco + target_auto + target_ind) AS total_target FROM salesman_targets WHERE salesman_id IN (?) ${targetFilter.queryPart}`,
      [userIds, ...targetFilter.params]
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
        const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
        const [targetRows] = await pool.query(
          `SELECT SUM(target_deco + target_auto + target_ind) AS val FROM salesman_targets WHERE salesman_id IN (?) ${targetFilter.queryPart}`,
          [regionUserIds, ...targetFilter.params]
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

      const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
      const [targetRows] = await pool.query(
        `SELECT SUM(target_deco + target_auto + target_ind) AS val FROM salesman_targets WHERE salesman_id IN (?) ${targetFilter.queryPart}`,
        [userIds, ...targetFilter.params]
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

async function getTargetPerformance(req, res, next) {
  try {
    const { tahun = 2026, bulan_nama = "Juli", salesman, area, periodeAwal, periodeAkhir } = req.query;
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
    if (salesUsers.length === 0) return res.json({ percentage: 0, targetGlobal: 'Rp 0 Jt', realisasi: 'Rp 0 Jt', selisih: 'Rp 0 Jt' });

    const userIds = salesUsers.map(u => u.user_id);

    const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
    const [targetRows] = await pool.query(
      `SELECT SUM(target_deco + target_auto + target_ind) AS total_target FROM salesman_targets WHERE salesman_id IN (?) ${targetFilter.queryPart}`,
      [userIds, ...targetFilter.params]
    );
    const totalTarget = Number(targetRows[0].total_target || 0);

    let realQuery = "SELECT COALESCE(SUM(f.netto), 0) AS total_realisasi FROM sales_transactions f WHERE f.salesman_id IN (?)";
    let realParams = [userIds];
    if (periodeAwal) { realQuery += " AND DATE(f.tanggal) >= ?"; realParams.push(periodeAwal); }
    if (periodeAkhir) { realQuery += " AND DATE(f.tanggal) <= ?"; realParams.push(periodeAkhir); }
    if (!periodeAwal && !periodeAkhir) { realQuery += " AND MONTH(f.tanggal) = ? AND YEAR(f.tanggal) = ?"; realParams.push(monthNum, tahun); }

    const [realRows] = await pool.query(realQuery, realParams);
    const totalRealisasi = Number(realRows[0].total_realisasi || 0);

    const formatRp = (num) => `Rp ${Number(num / 1e6).toFixed(1)} Jt`.replace('.', ',');
    const selisih = totalRealisasi - totalTarget;

    res.json({
      percentage: totalTarget > 0 ? Math.min(Math.round((totalRealisasi / totalTarget) * 100), 100) : 0,
      targetGlobal: formatRp(totalTarget),
      realisasi: formatRp(totalRealisasi),
      selisih: (selisih > 0 ? '+' : '') + formatRp(selisih),
      raw_target: totalTarget,
      raw_realisasi: totalRealisasi
    });
  } catch(err) {
    next(err);
  }
}

async function getTargetHistory(req, res, next) {
  try {
    const { salesman, supervisor, tahun = 2026 } = req.query;
    const indMonths = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const result = [];

    if (salesman && salesman !== "Semua Sales") {
      // Single salesman history
      const [uRows] = await pool.query(
        "SELECT s.salesman_id FROM users u JOIN salesmen s ON u.user_id = s.salesman_id WHERE u.name = ?",
        [salesman]
      );
      if (uRows.length === 0) return res.json({ data: [] });
      const salesmanId = uRows[0].salesman_id;
      
      const [targetRows] = await pool.query(
        "SELECT bulan_nama, tahun, (target_deco + target_auto + target_ind) as total_target FROM salesman_targets WHERE salesman_id = ? AND tahun = ? ORDER BY target_id DESC",
        [salesmanId, tahun]
      );
      
      for (const t of targetRows) {
        const monthNum = indMonths.indexOf(t.bulan_nama) + 1;
        let total_realisasi = 0;
        
        if (monthNum > 0) {
          const [realRows] = await pool.query(
            "SELECT COALESCE(SUM(netto), 0) as total FROM sales_transactions WHERE salesman_id = ? AND MONTH(tanggal) = ? AND YEAR(tanggal) = ?",
            [salesmanId, monthNum, t.tahun || tahun]
          );
          total_realisasi = Number(realRows[0].total || 0);
        }
        
        const total_target = Number(t.total_target || 0);
        const pencapaian = total_target > 0 ? (total_realisasi / total_target) * 100 : 0;
        
        result.push({
          bulan_nama: t.bulan_nama,
          tahun: t.tahun || Number(tahun),
          periode: `${t.bulan_nama} ${t.tahun || tahun}`,
          target: total_target,
          realisasi: total_realisasi,
          pencapaian: pencapaian.toFixed(1) + '%',
          status: pencapaian >= 100 ? 'Tercapai' : 'Belum Tercapai'
        });
      }
    } else {
      // All sales under supervisor (or overall)
      let userIds = [];
      if (supervisor && supervisor !== "Semua Supervisor") {
        const [uRows] = await pool.query(
          `SELECT u.user_id 
           FROM users u 
           JOIN salesmen s ON u.user_id = s.salesman_id 
           JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id 
           JOIN users sup_user ON sup.supervisor_id = sup_user.user_id 
           WHERE u.role = 'sales' AND sup_user.name = ?`,
          [supervisor]
        );
        userIds = uRows.map(r => r.user_id);
      } else {
        const [uRows] = await pool.query("SELECT user_id FROM users WHERE role = 'sales'");
        userIds = uRows.map(r => r.user_id);
      }

      if (userIds.length === 0) return res.json({ data: [] });

      const [targetRows] = await pool.query(
        `SELECT bulan_nama, tahun, SUM(target_deco + target_auto + target_ind) as total_target 
         FROM salesman_targets 
         WHERE salesman_id IN (?) AND tahun = ? 
         GROUP BY bulan_nama, tahun 
         ORDER BY MIN(target_id) DESC`,
        [userIds, tahun]
      );

      for (const t of targetRows) {
        const monthNum = indMonths.indexOf(t.bulan_nama) + 1;
        let total_realisasi = 0;

        if (monthNum > 0) {
          const [realRows] = await pool.query(
            "SELECT COALESCE(SUM(netto), 0) as total FROM sales_transactions WHERE salesman_id IN (?) AND MONTH(tanggal) = ? AND YEAR(tanggal) = ?",
            [userIds, monthNum, t.tahun || tahun]
          );
          total_realisasi = Number(realRows[0].total || 0);
        }

        const total_target = Number(t.total_target || 0);
        const pencapaian = total_target > 0 ? (total_realisasi / total_target) * 100 : 0;

        result.push({
          bulan_nama: t.bulan_nama,
          tahun: t.tahun || Number(tahun),
          periode: `${t.bulan_nama} ${t.tahun || tahun}`,
          target: total_target,
          realisasi: total_realisasi,
          pencapaian: pencapaian.toFixed(1) + '%',
          status: pencapaian >= 100 ? 'Tercapai' : 'Belum Tercapai'
        });
      }
    }
    
    res.json({ data: result });
  } catch(err) {
    next(err);
  }
}

module.exports = {
  getTargets,
  updateTarget,
  saveTarget: updateTarget,
  getTargetKPIs,
  getPerformaArea,
  getPerformaSupervisor,
  getTargetPerformance,
  getTargetHistory
};
