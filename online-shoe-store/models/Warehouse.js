const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    // sku: { type: String, unique: true, required: true }, // Mã sản phẩm
    quantity: { type: Number, required: true, default: 0 }, // Số lượng trong kho
    price: { type: Number, required: true }, // Giá sản phẩm
    category: { type: String, required: true }, // Danh mục
    description: { type: String }, // Mô tả
    inStock: { type: Boolean, default: true }, // Trạng thái còn hàng
  },
  { timestamps: true }
);

module.exports = mongoose.model("Warehouse", warehouseSchema);
