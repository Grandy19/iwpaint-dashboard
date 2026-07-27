require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const pool = require('./config/db');
const { ensureUploadLogColumns } = require('./config/initDb');
const dashboardRoutes = require('./routes/dashboardRoutes');
const importRoutes = require('./routes/importRoutes');
const salesRoutes = require('./routes/salesRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/health', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    res.json({ status: 'ok', db: rows[0].ok === 1 ? 'connected' : 'unknown' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', message: err.message });
  }
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/targets', require('./routes/targetRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/salesmen', require('./routes/salesmanRoutes'));
app.use('/api', importRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Terjadi kesalahan pada server.',
    detail: err.message
  });
});

ensureUploadLogColumns()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Gagal inisialisasi database:', err.message);
    process.exit(1);
  });
