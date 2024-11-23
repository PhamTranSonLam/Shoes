const express = require("express");
const router = express.Router();

const WarehouseController = require("../controllers/WarehouseController");
// Lấy danh sách phiếu nhập
router.get("/",  WarehouseController.getAllWarehouses);

// Lấy thông tin chi tiết một phiếu nhập
router.get("/:id",  WarehouseController.getWarehouseById);

// Tạo mới một phiếu nhập
router.post("/", WarehouseController.createWarehouse);
router.put('/update-products', WarehouseController.updateProducts)
// Cập nhật thông tin phiếu nhập
router.put("/:id", WarehouseController.updateWarehouse);



// Xóa phiếu nhập
router.delete("/:id", WarehouseController.deleteWarehouse);

module.exports = router;
