const express = require("express");
const controller = require("../controllers/dashboardController");

const router = express.Router();

router.get("/total-sales", controller.getTotalSales);
router.get("/total-transactions", controller.getTotalTransactions);
router.get("/total-qty", controller.getTotalQtyWeight);
router.get("/best-seller-products", controller.getBestSellerProducts);
router.get("/contribution-by-distributor", controller.getContributionByDistributor);
router.get("/sales-by-value", controller.getSalesByValue);
router.get("/sales-per-sales", controller.getSalesPerSales);

module.exports = router;

