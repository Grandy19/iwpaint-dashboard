const db = require('../config/db');

exports.getAvailableSalesmen = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        s.kode_salesman, 
        u.name AS nama_salesman 
       FROM salesmen s
       JOIN users u ON u.user_id = s.salesman_id
       ORDER BY nama_salesman ASC`
    );
    res.json({
      success: true,
      data: rows
    });
  } catch (err) {
    console.error('Error fetching salesmen:', err);
    res.status(500).json({
      success: false,
      message: 'Server error fetching salesmen'
    });
  }
};
