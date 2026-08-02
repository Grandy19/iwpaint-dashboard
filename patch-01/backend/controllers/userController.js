const pool = require("../config/db");

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

async function getUsers(req, res, next) {
  try {
    const { role, area, supervisor_name, status } = req.query;

    let query = `
      SELECT 
        u.user_id AS id,
        u.username,
        u.email,
        u.nomor_hp AS nomor_hp,
        u.role,
        u.name,
        u.status,
        u.tanggal_bergabung,
        
        -- Supervisor fields
        sp.area AS supervisor_area,
        sp.alamat AS supervisor_alamat,
        
        -- Salesman fields
        s.kode_salesman,
        s.supervisor_id,
        sp_u.name AS supervisor_name,
        s_sp.area AS salesman_supervisor_area,
        s_sp.alamat AS salesman_supervisor_alamat,
        
        -- Distributor fields
        d.kode_distributor,
        d.alamat AS distributor_alamat,
        d.area AS distributor_area
      FROM users u
      LEFT JOIN supervisors sp ON sp.supervisor_id = u.user_id
      LEFT JOIN salesmen s ON s.salesman_id = u.user_id
      LEFT JOIN supervisors s_sp ON s_sp.supervisor_id = s.supervisor_id
      LEFT JOIN users sp_u ON sp_u.user_id = s_sp.supervisor_id
      LEFT JOIN distributors d ON d.distributor_id = u.user_id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      query += " AND u.role = ?";
      params.push(role);
    }
    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") {
        matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      } else if (area === "DKI Jakarta") {
        matchedAreas = ["Jakarta"];
      } else if (area === "Jawa Tengah") {
        matchedAreas = ["Semarang"];
      } else if (area === "Jawa Timur") {
        matchedAreas = ["Surabaya"];
      } else if (area === "Sumatera") {
        matchedAreas = ["Medan"];
      }
      query += " AND (sp.area IN (?) OR d.area = ?)";
      params.push(matchedAreas, area);
    }
    if (supervisor_name && supervisor_name !== "Semua Supervisor" && supervisor_name !== "Semua Sales") {
      query += " AND sp_u.name = ?";
      params.push(supervisor_name);
    }
    if (status && status !== "Semua Status") {
      query += " AND u.status = ?";
      params.push(status);
    }

    query += " ORDER BY u.user_id DESC";

    const [rows] = await pool.query(query, params);

    const resultData = [];

    for (const u of rows) {
      let salesList = [];
      if (u.role === "supervisor") {
        const [salesRows] = await pool.query(
          "SELECT name FROM users u JOIN salesmen s ON s.salesman_id = u.user_id WHERE s.supervisor_id = ?",
          [u.id]
        );
        salesList = salesRows.map(r => r.name);
      }

      resultData.push({
        id: u.id,
        username: u.username,
        email: u.email,
        nomorHp: u.nomor_hp,
        alamat: u.role === "supervisor" ? u.supervisor_alamat : (u.role === "distributor" ? u.distributor_alamat : (u.role === "sales" ? u.salesman_supervisor_alamat : null)),
        area: u.role === "supervisor" ? u.supervisor_area : (u.role === "distributor" ? u.distributor_area : (u.role === "sales" ? u.salesman_supervisor_area : null)),
        role: u.role,
        supervisor: u.supervisor_name,
        status: u.status,
        namaSales: u.name,
        namaSupervisor: u.name,
        namaKepalaDistributor: u.name,
        kodeSalesman: u.kode_salesman,
        salesList: salesList,
        jumlahSales: u.role === "supervisor" ? `${salesList.length} Sales` : null,
        tanggalBergabung: u.tanggal_bergabung ? new Date(u.tanggal_bergabung).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
        raw_tanggal_bergabung: u.tanggal_bergabung
      });
    }

    res.json({ data: resultData });
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const {
      username,
      email,
      password,
      role,
      name,
      namaSales,
      namaSupervisor,
      namaKepalaDistributor,
      nomorHp,
      alamat,
      area,
      supervisor,
      status,
      tanggalBergabung,
      salesList,
      kodeSalesman,
      kodeDistributor
    } = req.body;

    const finalName = name || namaSales || namaSupervisor || namaKepalaDistributor || "";
    const finalRole = role ? role.toLowerCase() : "sales";
    const finalStatus = status || "Aktif";
    const finalDate = tanggalBergabung ? new Date(tanggalBergabung) : new Date();

    // 1. Insert parent user record
    const [userResult] = await pool.query(
      `INSERT INTO users (username, email, password, role, name, nomor_hp, status, tanggal_bergabung) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username || (finalName.toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 100)),
        email,
        password || "password123",
        finalRole,
        finalName,
        nomorHp || null,
        finalStatus,
        finalDate
      ]
    );
    const newUserId = userResult.insertId;

    // 2. Insert child role record
    if (finalRole === "supervisor") {
      await pool.query(
        "INSERT INTO supervisors (supervisor_id, area, alamat) VALUES (?, ?, ?)",
        [newUserId, area || null, alamat || null]
      );

      // Link sales list if provided
      if (salesList && Array.isArray(salesList) && salesList.length > 0) {
        await pool.query(
          `UPDATE salesmen SET supervisor_id = ? 
           WHERE salesman_id IN (SELECT user_id FROM users WHERE name IN (?) AND role = 'sales')`,
          [newUserId, salesList]
        );
      }
    } else if (finalRole === "sales") {
      // Resolve supervisor_id from supervisor name
      let supervisorId = null;
      if (supervisor) {
        const [supRows] = await pool.query("SELECT user_id FROM users WHERE name = ? AND role = 'supervisor' LIMIT 1", [supervisor]);
        if (supRows.length > 0) {
          supervisorId = supRows[0].user_id;
        }
      }

      const cleanKode = kodeSalesman || slugCodeFromName(finalName, "SLS");
      await pool.query(
        "INSERT INTO salesmen (salesman_id, kode_salesman, supervisor_id) VALUES (?, ?, ?)",
        [newUserId, cleanKode, supervisorId]
      );
    } else if (finalRole === "distributor") {
      const cleanKode = kodeDistributor || slugCodeFromName(finalName, "DST");
      await pool.query(
        "INSERT INTO distributors (distributor_id, kode_distributor, alamat, area) VALUES (?, ?, ?, ?)",
        [newUserId, cleanKode, alamat || null, area || null]
      );
    }

    res.status(201).json({
      message: "User berhasil dibuat",
      id: newUserId
    });
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const {
      username,
      email,
      password,
      name,
      namaSales,
      namaSupervisor,
      namaKepalaDistributor,
      nomorHp,
      alamat,
      area,
      supervisor,
      status,
      salesList,
      kodeSalesman,
      kodeDistributor
    } = req.body;

    // Get previous user info
    const [prevUsers] = await pool.query("SELECT name, role FROM users WHERE user_id = ? LIMIT 1", [id]);
    if (prevUsers.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    const prevUser = prevUsers[0];
    const finalName = name || namaSales || namaSupervisor || namaKepalaDistributor || prevUser.name;

    // 1. Update parent user record
    const updates = [];
    const params = [];

    if (username) { updates.push("username = ?"); params.push(username); }
    if (email) { updates.push("email = ?"); params.push(email); }
    if (password && password !== "**********") { updates.push("password = ?"); params.push(password); }
    if (finalName) { updates.push("name = ?"); params.push(finalName); }
    if (nomorHp !== undefined) { updates.push("nomor_hp = ?"); params.push(nomorHp); }
    if (status) { updates.push("status = ?"); params.push(status); }

    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`, params);
    }

    // 2. Update subclass specific records
    if (prevUser.role === "supervisor") {
      await pool.query(
        "INSERT INTO supervisors (supervisor_id, area, alamat) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE area = VALUES(area), alamat = VALUES(alamat)",
        [id, area || null, alamat || null]
      );

      // Update sales assignments
      await pool.query(
        "UPDATE salesmen SET supervisor_id = NULL WHERE supervisor_id = ?",
        [id]
      );
      if (salesList && Array.isArray(salesList) && salesList.length > 0) {
        await pool.query(
          `UPDATE salesmen SET supervisor_id = ? 
           WHERE salesman_id IN (SELECT user_id FROM users WHERE name IN (?) AND role = 'sales')`,
          [id, salesList]
        );
      }
    } else if (prevUser.role === "sales") {
      let supervisorId = null;
      if (supervisor) {
        const [supRows] = await pool.query("SELECT user_id FROM users WHERE name = ? AND role = 'supervisor' LIMIT 1", [supervisor]);
        if (supRows.length > 0) {
          supervisorId = supRows[0].user_id;
        }
      }

      await pool.query(
        "INSERT INTO salesmen (salesman_id, kode_salesman, supervisor_id) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE kode_salesman = VALUES(kode_salesman), supervisor_id = VALUES(supervisor_id)",
        [id, kodeSalesman || slugCodeFromName(finalName, "SLS"), supervisorId]
      );
    } else if (prevUser.role === "distributor") {
      await pool.query(
        "INSERT INTO distributors (distributor_id, kode_distributor, alamat, area) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE kode_distributor = VALUES(kode_distributor), alamat = VALUES(alamat), area = VALUES(area)",
        [id, kodeDistributor || slugCodeFromName(finalName, "DST"), alamat || null, area || null]
      );
    }

    res.json({ message: "User berhasil diupdate" });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM users WHERE user_id = ?", [id]);
    res.json({ message: "User berhasil dihapus" });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
