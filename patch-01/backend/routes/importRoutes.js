const express = require('express');
const multer = require('multer');
const path = require('path');

const importController = require('../controllers/importController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', 'uploads'),
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}_${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.xlsx', '.csv'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (!allowed.includes(ext)) {
      return cb(new Error('Format file tidak didukung. Gunakan .xlsx atau .csv')); 
    }

    cb(null, true);
  }
});

router.post('/import', upload.single('file'), importController.handleImportFile);
router.get('/import-history', importController.getImportHistory);

module.exports = router;
