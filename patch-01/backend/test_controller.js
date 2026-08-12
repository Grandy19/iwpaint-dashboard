require('dotenv').config();
const { getTargets, getTargetPerformance } = require('./controllers/targetController');

const req = {
  query: {
    salesman: 'FRANSISKUS',
    tahun: 2026,
    bulan_nama: 'Agustus'
  }
};

const res = {
  json: (data) => console.log('Response:', JSON.stringify(data, null, 2))
};

const next = (err) => console.error('Error:', err);

async function run() {
  console.log('--- getTargets ---');
  await getTargets(req, res, next);
  console.log('--- getTargetPerformance ---');
  await getTargetPerformance(req, res, next);
  process.exit();
}

run();
