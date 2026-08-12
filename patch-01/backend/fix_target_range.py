import os
import re

file_path = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\targetController.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add the buildTargetFilter function
helper_func = """function monthNameToNum(name) {
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
}"""

content = re.sub(r'function monthNameToNum\(name\) \{.*?\n\}', helper_func, content, flags=re.DOTALL)

# Replace getTargets
get_targets_target = """      // Find target for this salesman
      const [targetRows] = await pool.query(
        "SELECT target_deco, target_auto, target_ind FROM salesman_targets WHERE salesman_id = ? AND tahun = ? AND bulan_nama = ? LIMIT 1",
        [user.salesman_id, tahun, bulan_nama]
      );"""

get_targets_replacement = """      // Find target for this salesman
      const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
      const [targetRows] = await pool.query(
        `SELECT SUM(target_deco) as target_deco, SUM(target_auto) as target_auto, SUM(target_ind) as target_ind FROM salesman_targets WHERE salesman_id = ? ${targetFilter.queryPart}`,
        [user.salesman_id, ...targetFilter.params]
      );"""
content = content.replace(get_targets_target, get_targets_replacement)

# Replace getTargetKPIs
kpi_target = """    // Sum targets
    const [targetRows] = await pool.query(
      "SELECT SUM(target_deco + target_auto + target_ind) AS total_target FROM salesman_targets WHERE salesman_id IN (?) AND tahun = ? AND bulan_nama = ?",
      [userIds, tahun, bulan_nama]
    );"""

kpi_replacement = """    // Sum targets
    const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
    const [targetRows] = await pool.query(
      `SELECT SUM(target_deco + target_auto + target_ind) AS total_target FROM salesman_targets WHERE salesman_id IN (?) ${targetFilter.queryPart}`,
      [userIds, ...targetFilter.params]
    );"""
content = content.replace(kpi_target, kpi_replacement)

# Replace getPerformaArea
area_target = """        const [targetRows] = await pool.query(
          "SELECT SUM(target_deco + target_auto + target_ind) AS val FROM salesman_targets WHERE salesman_id IN (?) AND tahun = ? AND bulan_nama = ?",
          [regionUserIds, tahun, bulan_nama]
        );"""

area_replacement = """        const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
        const [targetRows] = await pool.query(
          `SELECT SUM(target_deco + target_auto + target_ind) AS val FROM salesman_targets WHERE salesman_id IN (?) ${targetFilter.queryPart}`,
          [regionUserIds, ...targetFilter.params]
        );"""
content = content.replace(area_target, area_replacement)

# Replace getPerformaSupervisor
sup_target = """      const [targetRows] = await pool.query(
        "SELECT SUM(target_deco + target_auto + target_ind) AS val FROM salesman_targets WHERE salesman_id IN (?) AND tahun = ? AND bulan_nama = ?",
        [userIds, tahun, bulan_nama]
      );"""

sup_replacement = """      const targetFilter = buildTargetFilter(periodeAwal, periodeAkhir, tahun, bulan_nama);
      const [targetRows] = await pool.query(
        `SELECT SUM(target_deco + target_auto + target_ind) AS val FROM salesman_targets WHERE salesman_id IN (?) ${targetFilter.queryPart}`,
        [userIds, ...targetFilter.params]
      );"""
content = content.replace(sup_target, sup_replacement)

# Fix getTargetPerformance
perf_func_target = """async function getTargetPerformance(req, res, next) {
  try { res.json({ data: [] }); } catch(err) { next(err); }
}"""

perf_func_replacement = """async function getTargetPerformance(req, res, next) {
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
      selisih: (selisih > 0 ? '+' : '') + formatRp(selisih)
    });
  } catch(err) {
    next(err);
  }
}"""
content = content.replace(perf_func_target, perf_func_replacement)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated targetController.js")
