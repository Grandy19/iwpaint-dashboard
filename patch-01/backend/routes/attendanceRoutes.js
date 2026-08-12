const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/ping', attendanceController.pingActivity);
router.get('/', attendanceController.getSalesAttendance);
router.get('/supervisors', attendanceController.getSupervisorAttendance);

module.exports = router;
