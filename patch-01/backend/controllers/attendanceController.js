const pool = require("../config/db");

async function pingActivity(req, res, next) {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const now = new Date();
    await pool.query("UPDATE users SET last_activity = ? WHERE user_id = ?", [now, userId]);
    res.json({ message: "Activity ping successful" });
  } catch (err) {
    next(err);
  }
}

async function getSalesAttendance(req, res, next) {
  try {
    const { supervisor_name, area } = req.query;

    let usersQuery = `
      SELECT u.user_id as id, u.name, sup.area, u.last_activity 
      FROM users u
      JOIN salesmen s ON u.user_id = s.salesman_id
      JOIN supervisors sup ON s.supervisor_id = sup.supervisor_id
      JOIN users sup_user ON sup.supervisor_id = sup_user.user_id
      WHERE u.role = 'sales'
    `;
    let usersParams = [];
    if (supervisor_name) {
      usersQuery += " AND sup_user.name = ?";
      usersParams.push(supervisor_name);
    }
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

    const [logs] = await pool.query(
      `SELECT 
         user_id, 
         COUNT(*) as login_count, 
         MAX(login_time) as last_login,
         SUM(CASE WHEN HOUR(login_time) < 12 THEN 1 ELSE 0 END) as login_pagi_count,
         SUM(CASE WHEN HOUR(login_time) >= 12 THEN 1 ELSE 0 END) as login_sore_count
       FROM attendance_logs 
       WHERE DATE(login_time) = CURDATE() 
       GROUP BY user_id`
    );

    const logsMap = {};
    logs.forEach(log => {
      logsMap[log.user_id] = {
        login_count: log.login_count,
        last_login: log.last_login,
        has_pagi: log.login_pagi_count > 0,
        has_sore: log.login_sore_count > 0
      };
    });

    const result = salesUsers.map(user => {
      const userLog = logsMap[user.id] || { login_count: 0, last_login: null, has_pagi: false, has_sore: false };
      
      let status = "Belum Absen";
      if (userLog.has_pagi && userLog.has_sore) status = "Lengkap";
      else if (userLog.has_pagi) status = "Absen Pagi";
      else if (userLog.has_sore) status = "Absen Sore";

      return {
        id: user.id,
        sales: user.name,
        area: user.area,
        login_count: userLog.login_count,
        last_login: userLog.last_login,
        last_activity: user.last_activity,
        status: status,
        has_pagi: userLog.has_pagi,
        has_sore: userLog.has_sore
      };
    });

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

async function getSupervisorAttendance(req, res, next) {
  try {
    const { area } = req.query;

    let usersQuery = `
      SELECT u.user_id as id, u.name, sup.area, u.last_activity 
      FROM users u
      JOIN supervisors sup ON u.user_id = sup.supervisor_id
      WHERE u.role = 'supervisor'
    `;
    let usersParams = [];
    
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
    
    const [supervisors] = await pool.query(usersQuery, usersParams);

    const [logs] = await pool.query(
      `SELECT 
         user_id, 
         COUNT(*) as login_count, 
         MAX(login_time) as last_login,
         SUM(CASE WHEN HOUR(login_time) < 12 THEN 1 ELSE 0 END) as login_pagi_count,
         SUM(CASE WHEN HOUR(login_time) >= 12 THEN 1 ELSE 0 END) as login_sore_count
       FROM attendance_logs 
       WHERE DATE(login_time) = CURDATE() 
       GROUP BY user_id`
    );

    const logsMap = {};
    logs.forEach(log => {
      logsMap[log.user_id] = {
        login_count: log.login_count,
        last_login: log.last_login,
        has_pagi: log.login_pagi_count > 0,
        has_sore: log.login_sore_count > 0
      };
    });

    const result = supervisors.map(user => {
      const userLog = logsMap[user.id] || { login_count: 0, last_login: null, has_pagi: false, has_sore: false };
      
      let status = "Belum Absen";
      if (userLog.has_pagi && userLog.has_sore) status = "Lengkap";
      else if (userLog.has_pagi) status = "Absen Pagi";
      else if (userLog.has_sore) status = "Absen Sore";

      return {
        id: user.id,
        supervisor: user.name,
        area: user.area,
        login_count: userLog.login_count,
        last_login: userLog.last_login,
        last_activity: user.last_activity,
        status: status,
        has_pagi: userLog.has_pagi,
        has_sore: userLog.has_sore
      };
    });

    res.json({ data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  pingActivity,
  getSalesAttendance,
  getSupervisorAttendance
};
