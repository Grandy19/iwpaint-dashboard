const pool = require("../config/db");

async function getUsers(req, res, next) {
  try {
    const { role, area, supervisor_name, status } = req.query;

    let query = "SELECT * FROM users WHERE 1=1";
    const params = [];

    if (role) {
      query += " AND role = ?";
      params.push(role);
    }
    if (area && area !== "Semua Area") {
      query += " AND area = ?";
      params.push(area);
    }
    if (supervisor_name && supervisor_name !== "Semua Supervisor" && supervisor_name !== "Semua Sales") {
      query += " AND supervisor_name = ?";
      params.push(supervisor_name);
    }
    if (status && status !== "Semua Status") {
      query += " AND status = ?";
      params.push(status);
    }

    query += " ORDER BY id DESC";

    const [rows] = await pool.query(query, params);

    const resultData = [];

    for (const u of rows) {
      let salesList = [];
      if (u.role === "supervisor") {
        // Fetch sales names assigned to this supervisor
        const [salesRows] = await pool.query(
          "SELECT name FROM users WHERE supervisor_name = ? AND role = 'sales'",
          [u.name]
        );
        salesList = salesRows.map(r => r.name);
      }

      resultData.push({
        id: u.id,
        username: u.username,
        email: u.email,
        nomorHp: u.nomor_hp,
        alamat: u.alamat,
        area: u.area,
        role: u.role,
        supervisor: u.supervisor_name,
        status: u.status,
        namaSales: u.name,
        namaSupervisor: u.name,
        namaKepalaDistributor: u.name,
        kodeSalesman: u.kode_salesman,
        salesList: salesList, // for supervisor
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
      kodeSalesman
    } = req.body;

    const finalName = name || namaSales || namaSupervisor || namaKepalaDistributor || "";
    const finalRole = role ? role.toLowerCase() : "sales";
    const finalStatus = status || "Aktif";
    const finalDate = tanggalBergabung ? new Date(tanggalBergabung) : new Date();

    const [result] = await pool.query(
      `INSERT INTO users (username, email, password, role, name, nomor_hp, alamat, area, status, supervisor_name, tanggal_bergabung, kode_salesman) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        username || (finalName.toLowerCase().replace(/\s/g, "") + Math.floor(Math.random() * 100)),
        email,
        password || "password123",
        finalRole,
        finalName,
        nomorHp || null,
        alamat || null,
        area || null,
        finalStatus,
        supervisor || null,
        finalDate,
        kodeSalesman || null
      ]
    );

    // Update sales assignment if supervisor is created
    if (finalRole === "supervisor" && salesList && Array.isArray(salesList) && salesList.length > 0) {
      await pool.query(
        "UPDATE users SET supervisor_name = ? WHERE name IN (?) AND role = 'sales'",
        [finalName, salesList]
      );
    }

    res.status(201).json({
      message: "User berhasil dibuat",
      id: result.insertId
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
      kodeSalesman
    } = req.body;

    // Get previous user info
    const [prevUsers] = await pool.query("SELECT name, role FROM users WHERE id = ? LIMIT 1", [id]);
    if (prevUsers.length === 0) {
      return res.status(404).json({ message: "User tidak ditemukan." });
    }
    const prevUser = prevUsers[0];
    const finalName = name || namaSales || namaSupervisor || namaKepalaDistributor || prevUser.name;

    const updates = [];
    const params = [];

    if (username) { updates.push("username = ?"); params.push(username); }
    if (email) { updates.push("email = ?"); params.push(email); }
    if (password && password !== "**********") { updates.push("password = ?"); params.push(password); }
    if (finalName) { updates.push("name = ?"); params.push(finalName); }
    if (nomorHp !== undefined) { updates.push("nomor_hp = ?"); params.push(nomorHp); }
    if (alamat !== undefined) { updates.push("alamat = ?"); params.push(alamat); }
    if (area !== undefined) { updates.push("area = ?"); params.push(area); }
    if (supervisor !== undefined) { updates.push("supervisor_name = ?"); params.push(supervisor); }
    if (status) { updates.push("status = ?"); params.push(status); }
    if (kodeSalesman !== undefined) { updates.push("kode_salesman = ?"); params.push(kodeSalesman || null); }

    if (updates.length > 0) {
      params.push(id);
      await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
    }

    // Update sales assignments if supervisor is updated
    if (prevUser.role === "supervisor") {
      // Clear old sales for this supervisor
      await pool.query(
        "UPDATE users SET supervisor_name = NULL WHERE supervisor_name = ? AND role = 'sales'",
        [prevUser.name]
      );
      // Set new sales for this supervisor
      if (salesList && Array.isArray(salesList) && salesList.length > 0) {
        await pool.query(
          "UPDATE users SET supervisor_name = ? WHERE name IN (?) AND role = 'sales'",
          [finalName, salesList]
        );
      }
    }

    res.json({ message: "User berhasil diupdate" });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    // Get user info to clear assignments
    const [users] = await pool.query("SELECT name, role FROM users WHERE id = ? LIMIT 1", [id]);
    if (users.length > 0) {
      const u = users[0];
      if (u.role === "supervisor") {
        await pool.query("UPDATE users SET supervisor_name = NULL WHERE supervisor_name = ? AND role = 'sales'", [u.name]);
      }
    }
    await pool.query("DELETE FROM users WHERE id = ?", [id]);
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
