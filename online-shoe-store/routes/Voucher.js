const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucherController");

// Tạo voucher mới
router.post("/create", voucherController.createVoucher);
router.delete("/delete/:id", voucherController.deleteVoucher);
router.put("/update/:id", voucherController.editVoucher);


// Áp dụng voucher
router.post("/apply", voucherController.applyVoucher);

// Lấy thông tin voucher theo mã
router.get("/:code", voucherController.getVoucher);
router.get("/", voucherController.getAllVoucher)
module.exports = router;
