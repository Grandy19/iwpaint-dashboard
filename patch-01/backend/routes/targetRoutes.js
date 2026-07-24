const express = require("express");
const router = express.Router();
const controller = require("../controllers/targetController");

router.get("/", controller.getTargets);
router.post("/", controller.saveTarget);
router.get("/performance", controller.getTargetPerformance);
router.get("/history", controller.getTargetHistory);

module.exports = router;
