const pool = require("../config/db");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    const [rows] = await pool.query(
      `SELECT 
        u.*,
        sp_u.name AS supervisor_name,
        d.kode_distributor,
        COALESCE(sp.area, d.area) AS resolved_area,
        COALESCE(sp.alamat, d.alamat) AS resolved_alamat
       FROM users u
       LEFT JOIN salesmen s ON s.salesman_id = u.user_id
       LEFT JOIN supervisors sp ON sp.supervisor_id = s.supervisor_id
       LEFT JOIN users sp_u ON sp_u.user_id = sp.supervisor_id
       LEFT JOIN distributors d ON d.distributor_id = u.user_id
       WHERE u.email = ? OR u.username = ?
       LIMIT 1`,
      [email, email]
    );

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

    res.json({
      message: "Login berhasil",
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        nomor_hp: user.nomor_hp,
        alamat: user.resolved_alamat,
        area: user.resolved_area,
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
