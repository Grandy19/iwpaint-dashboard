const db = require('../config/db');

exports.getAvailableSalesmen = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT kode_salesman, nama_salesman FROM dim_salesman ORDER BY nama_salesman ASC');
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
