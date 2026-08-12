import re

filepath = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\controllers\attendanceController.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

replacement1 = """    const { supervisor_name, area } = req.query;

    // Get all sales for this supervisor
    let usersQuery = "SELECT id, name, area, last_activity FROM users WHERE role = 'sales'";
    let usersParams = [];
    if (supervisor_name) {
      usersQuery += " AND supervisor_name = ?";
      usersParams.push(supervisor_name);
    }
    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      usersQuery += " AND area IN (?)";
      usersParams.push(matchedAreas);
    }"""

content = content.replace("""    const { supervisor_name } = req.query;

    // Get all sales for this supervisor
    let usersQuery = "SELECT id, name, area, last_activity FROM users WHERE role = 'sales'";
    let usersParams = [];
    if (supervisor_name) {
      usersQuery += " AND supervisor_name = ?";
      usersParams.push(supervisor_name);
    }""", replacement1)


replacement2 = """module.exports = {
  pingActivity,
  getSalesAttendance,
  getSupervisorAttendance
};

async function getSupervisorAttendance(req, res, next) {
  try {
    const { area } = req.query;

    let usersQuery = "SELECT id, name, area, last_activity FROM users WHERE role = 'supervisor'";
    let usersParams = [];
    
    if (area && area !== "Semua Area") {
      let matchedAreas = [area];
      if (area === "Jawa Barat") matchedAreas = ["Bandung", "Cirebon", "Kuningan", "Tasikmalaya", "Garut", "Bogor"];
      else if (area === "DKI Jakarta") matchedAreas = ["Jakarta"];
      else if (area === "Jawa Tengah") matchedAreas = ["Semarang"];
      else if (area === "Jawa Timur") matchedAreas = ["Surabaya"];
      else if (area === "Sumatera") matchedAreas = ["Medan"];
      usersQuery += " AND area IN (?)";
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
"""

content = content.replace("""module.exports = {
  pingActivity,
  getSalesAttendance
};""", replacement2)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated attendanceController.js")
