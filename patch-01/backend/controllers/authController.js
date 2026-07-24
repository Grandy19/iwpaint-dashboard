const pool = require("../config/db");

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email dan password wajib diisi." });
    }

    const [rows] = await pool.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email]);

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
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        name: user.name,
        nomor_hp: user.nomor_hp,
        alamat: user.alamat,
        area: user.area,
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
