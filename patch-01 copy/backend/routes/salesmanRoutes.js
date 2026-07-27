const express = require('express');
const router = express.Router();
const salesmanController = require('../controllers/salesmanController');

router.get('/', salesmanController.getAvailableSalesmen);

module.exports = router;
