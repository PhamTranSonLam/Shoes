const mongoose = require("mongoose");

const WarehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Tên phiếu nhập
    warehouse: { type: String }, // Kho
    date: { type: Date, default: Date.now }, // Ngày nhập
    products: [
      {
        productName: { type: String}, // Tên mặt hàng
        unit: { type: String}, // Đơn vị tính
        price: { type: Number }, // Đơn giá
        quantity: { type: Number }, // Số lượng
        location: { type: String }, // Vị trí
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", WarehouseSchema);
