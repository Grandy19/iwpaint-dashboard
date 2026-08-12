const pool = require("../config/db");

async function getUsers(req, res, next) {
  try {
    const { role, area, supervisor_name, status } = req.query;

    let query = `
      SELECT u.user_id as id, u.*, 
             s.kode_salesman, s.supervisor_id as s_sup_id,
             sup.area as sup_area, sup.alamat as sup_alamat, sup.distributor_id,
             d.area as dist_area, d.alamat as dist_alamat,
             sup_user.name as supervisor_name
      FROM users u
      LEFT JOIN salesmen s ON u.user_id = s.salesman_id AND u.role = 'sales'
      LEFT JOIN supervisors sup ON 
          (u.user_id = sup.supervisor_id AND u.role = 'supervisor') OR 
          (s.supervisor_id = sup.supervisor_id AND u.role = 'sales')
      LEFT JOIN distributors d ON 
          (u.user_id = d.distributor_id AND u.role = 'distributor') OR 
          (sup.distributor_id = d.distributor_id AND u.role IN ('sales', 'supervisor'))
      LEFT JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      WHERE 1=1
    `;
    const params = [];

    if (role) {
      query += " AND u.role = ?";
      params.push(role);
    }
    if (status && status !== "Semua Status") {
      query += " AND u.status = ?";
      params.push(status);
    }

    // Filtering by area or supervisor requires HAVING because of aliases, or subqueries
    // We will filter in javascript for simplicity since dataset is small

    query += " ORDER BY u.user_id DESC";

    const [rows] = await pool.query(query, params);

    let resultData = [];

    for (const u of rows) {
      let resolvedArea = null;
      let resolvedAlamat = u.alamat;
      if (u.role === 'distributor') {
        resolvedArea = u.dist_area;
        resolvedAlamat = u.dist_alamat;
      } else if (u.role === 'supervisor') {
        resolvedArea = u.sup_area;
        resolvedAlamat = u.sup_alamat;
      } else if (u.role === 'sales') {
        resolvedArea = u.sup_area;
        resolvedAlamat = u.sup_alamat;
      }

      // Manual filtering for area and supervisor_name
      if (area && area !== "Semua Area" && resolvedArea !== area) {
        continue;
      }
      if (supervisor_name && supervisor_name !== "Semua Supervisor" && supervisor_name !== "Semua Sales" && u.supervisor_name !== supervisor_name) {
        continue;
      }

      let salesList = [];
      if (u.role === "supervisor") {
        const [salesRows] = await pool.query(
          "SELECT u.name FROM users u JOIN salesmen s ON u.user_id = s.salesman_id WHERE s.supervisor_id = ?",
          [u.user_id]
        );
        salesList = salesRows.map(r => r.name);
      }

      resultData.push({
        id: u.user_id,
        username: u.username,
        email: u.email,
        nomorHp: u.nomor_hp,
        alamat: resolvedAlamat,
        area: resolvedArea,
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
        raw_tanggal_bergabung: u.tanggal_bergabung,
        last_activity: u.last_activity
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
      namaSales,
      namaSupervisor,
      namaKepalaDistributor,
      nomorHp,
      alamat,
      area,
      status,
      supervisor,
      kodeSalesman
    } = req.body;

    const finalName = namaSales || namaSupervisor || namaKepalaDistributor || username;

    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, role, name, nomor_hp, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, email, password, role, finalName, nomorHp || null, status || 'Aktif']
    );

    const newUserId = result.insertId;

    if (role === 'sales') {
      let supId = null;
      if (supervisor && supervisor !== '-') {
        const [supRows] = await pool.query("SELECT user_id FROM users WHERE name = ? AND role = 'supervisor' LIMIT 1", [supervisor]);
        if (supRows.length > 0) supId = supRows[0].user_id;
      }
      await pool.query("INSERT INTO salesmen (salesman_id, kode_salesman, supervisor_id) VALUES (?, ?, ?)", [newUserId, kodeSalesman || null, supId]);
    } else if (role === 'supervisor') {
      await pool.query("INSERT INTO supervisors (supervisor_id, area, alamat) VALUES (?, ?, ?)", [newUserId, area || null, alamat || null]);
    } else if (role === 'distributor') {
      await pool.query("INSERT INTO distributors (distributor_id, area, alamat) VALUES (?, ?, ?)", [newUserId, area || null, alamat || null]);
    }

    res.status(201).json({ message: "User created successfully", id: newUserId });
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
      namaSales,
      namaSupervisor,
      namaKepalaDistributor,
      nomorHp,
      alamat,
      area,
      status,
      supervisor,
      kodeSalesman
    } = req.body;

    const [check] = await pool.query("SELECT name, role FROM users WHERE user_id = ? LIMIT 1", [id]);
    if (check.length === 0) return res.status(404).json({ message: "User not found" });
    const oldUser = check[0];

    const finalName = namaSales || namaSupervisor || namaKepalaDistributor;

    const updates = [];
    const params = [];
    if (username !== undefined) { updates.push("username = ?"); params.push(username); }
    if (email !== undefined) { updates.push("email = ?"); params.push(email); }
    if (password !== undefined) { updates.push("password = ?"); params.push(password); }
    if (finalName !== undefined) { updates.push("name = ?"); params.push(finalName); }
    if (nomorHp !== undefined) { updates.push("nomor_hp = ?"); params.push(nomorHp); }
    if (status !== undefined) { updates.push("status = ?"); params.push(status); }

    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE user_id = ?`, params);
    }

    if (oldUser.role === 'sales') {
      let supId = null;
      if (supervisor && supervisor !== '-') {
        const [supRows] = await pool.query("SELECT user_id FROM users WHERE name = ? AND role = 'supervisor' LIMIT 1", [supervisor]);
        if (supRows.length > 0) supId = supRows[0].user_id;
      }
      await pool.query("UPDATE salesmen SET kode_salesman = ?, supervisor_id = ? WHERE salesman_id = ?", [kodeSalesman || null, supId, id]);
    } else if (oldUser.role === 'supervisor') {
      await pool.query("UPDATE supervisors SET area = ?, alamat = ? WHERE supervisor_id = ?", [area || null, alamat || null, id]);
    } else if (oldUser.role === 'distributor') {
      await pool.query("UPDATE distributors SET area = ?, alamat = ? WHERE distributor_id = ?", [area || null, alamat || null, id]);
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    
    // Dependent rows should ideally delete via ON DELETE CASCADE in db
    // Since we are not sure, we manually delete them first
    await pool.query("DELETE FROM attendance_logs WHERE user_id = ?", [id]);
    await pool.query("DELETE FROM salesmen WHERE salesman_id = ?", [id]);
    await pool.query("DELETE FROM supervisors WHERE supervisor_id = ?", [id]);
    await pool.query("DELETE FROM distributors WHERE distributor_id = ?", [id]);
    await pool.query("DELETE FROM users WHERE user_id = ?", [id]);
    
    res.json({ message: "User deleted successfully" });
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
