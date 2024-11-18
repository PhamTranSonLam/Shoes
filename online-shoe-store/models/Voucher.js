const mongoose = require("mongoose");

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },         // Mã của voucher
  discountType: { type: String, enum: ["percent", "amount"], required: true }, // Loại giảm giá: phần trăm hoặc số tiền cố định
  discountValue: { type: Number, required: true },              // Giá trị giảm
  minOrderValue: { type: Number, default: 0 },                  // Giá trị đơn hàng tối thiểu để áp dụng
  startDate: { type: Date, required: true },                    // Ngày bắt đầu
  endDate: { type: Date, required: true },                      // Ngày kết thúc
  usageLimit: { type: Number, default: null },                  // Giới hạn số lần sử dụng               
  timesUsed: { type: Number, default: 0 },                      // Số lần đã sử dụng
  isActive: { type: Boolean, default: true }                    // Trạng thái hoạt động
});

module.exports = mongoose.model("Voucher", voucherSchema);
