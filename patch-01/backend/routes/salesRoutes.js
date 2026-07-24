const express = require("express");
const controller = require("../controllers/salesController");

const router = express.Router();

router.get("/list", controller.getSalesmenList);
router.get("/kpis", controller.getSalesKpis);
router.get("/contribution", controller.getSalesContribution);
router.get("/trend", controller.getSalesTrend);
router.get("/top-products", controller.getSalesTopProducts);
router.get("/top-salesmen", controller.getSalesTopSalesmen);
router.get("/transactions", controller.getSalesTransactions);

module.exports = router;
