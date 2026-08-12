const pool = require("../config/db");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    const query = `
      SELECT u.*, 
             s.kode_salesman, s.supervisor_id,
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
      WHERE u.email = ? OR u.username = ? LIMIT 1
    `;
    const [rows] = await pool.query(query, [email, email]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Akun tidak terdaftar dalam sistem." });
    }

    const user = rows[0];

    // For simplicity, checking password in plain text as seeded
    if (user.password !== password) {
      return res.status(401).json({ message: "Kredensial tidak valid. Silakan coba lagi." });
    }

    if (user.status !== "Aktif") {
      return res.status(403).json({ message: "Akun Anda dinonaktifkan. Silakan hubungi admin." });
    }

    // Determine area and alamat based on role
    let area = null;
    let alamat = null;
    if (user.role === 'distributor') {
      area = user.dist_area;
      alamat = user.dist_alamat;
    } else if (user.role === 'supervisor') {
      area = user.sup_area;
      alamat = user.sup_alamat;
    } else if (user.role === 'sales') {
      area = user.sup_area; // Sales area is derived from supervisor
      alamat = user.sup_alamat; // Or maybe sales has no alamat?
    }

    // Update last_activity and insert into attendance_logs
    const now = new Date();
    await pool.query("UPDATE users SET last_activity = ? WHERE user_id = ?", [now, user.user_id]);
    await pool.query("INSERT INTO attendance_logs (user_id, login_time) VALUES (?, ?)", [user.user_id, now]);

    res.json({
      message: "Login berhasil",
      user: {
        id: user.user_id, // Map user_id to id for frontend compatibility
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        nomor_hp: user.nomor_hp,
        alamat: alamat,
        area: area,
        status: user.status,
        supervisor_name: user.supervisor_name,
        tanggal_bergabung: user.tanggal_bergabung
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  login
};
