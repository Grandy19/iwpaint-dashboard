const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerController");

router.get("/", controller.getCustomers);
router.get("/transactions", controller.getCustomerTransactions);

module.exports = router;
