const express = require("express");
const router = express.Router();
const warehouseController = require("../controllers/WarehouseController");

// Các route
router.get("/", warehouseController.getProducts); // Lấy danh sách sản phẩm
router.post("/", warehouseController.addProduct); // Thêm sản phẩm
router.put("/:id", warehouseController.updateProduct); // Cập nhật sản phẩm
router.delete("/:id", warehouseController.deleteProduct); // Xóa sản phẩm

module.exports = router;
