const Voucher = require("../models/Voucher");

// Tạo mới một voucher
exports.createVoucher = async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, startDate, endDate, usageLimit } = req.body;
  try {
    const newVoucher = new Voucher({
      code,
      discountType,
      discountValue,
      minOrderValue,
      startDate,
      endDate,
      usageLimit,
    });
    await newVoucher.save();
    res.status(201).json({ message: "Voucher đã được tạo thành công", voucher: newVoucher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo voucher", error: error.message });
  }
};

// Áp dụng voucher
exports.applyVoucher = async (req, res) => {
  const { code, orderValue } = req.body;
  try {
    const voucher = await Voucher.findOne({ code, isActive: true });
    if (!voucher) return res.status(404).json({ message: "Voucher không tồn tại" });

    // Kiểm tra ngày hiệu lực
    const now = new Date();
    if (now < voucher.startDate || now > voucher.endDate)
      return res.status(400).json({ message: "Voucher đã hết hạn" });

    // Kiểm tra giá trị đơn hàng tối thiểu
    if (orderValue < voucher.minOrderValue)
      return res.status(400).json({ message: "Đơn hàng không đủ điều kiện" });

    // Kiểm tra số lần sử dụng
    if (voucher.usageLimit && voucher.timesUsed >= voucher.usageLimit)
      return res.status(400).json({ message: "Voucher đã hết lượt sử dụng" });

    // Tính giá trị giảm
    let discount = 0;
    if (voucher.discountType === "percent") {
      discount = (voucher.discountValue / 100) * orderValue;
    } else {
      discount = voucher.discountValue;
    }

    // Cập nhật số lần sử dụng
    voucher.timesUsed += 1;
    await voucher.save();

    res.json({ discount });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi áp dụng voucher", error: error.message });
  }
};

// Lấy thông tin voucher
exports.getVoucher = async (req, res) => {
  const { code } = req.params;
  try {
    const voucher = await Voucher.findOne({ code });
    if (!voucher) return res.status(404).json({ message: "Voucher không tồn tại" });
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy voucher", error: error.message });
  }
};
// lấy tất cả thông tin người dùng
exports.getAllVoucher = async (req, res) => {
  try {
    const voucher = await Voucher.find();
    if (!voucher) return res.status(404).json({ message: "Voucher tất cả không tồn tại" });
    res.json(voucher);
  } catch (error) {
    res.status(500).json({ message: "Lỗi tất cả khi lấy voucher", error: error.message });
  }
};
// Chỉnh sửa một voucher
exports.editVoucher = async (req, res) => {
  const { code, discountType, discountValue, minOrderValue, startDate, endDate, usageLimit, } = req.body;
  try {
    const voucher = await Voucher.findByIdAndUpdate(
      req.params.id, // Tìm theo ID trong URL
      {
        discountType,
        discountValue,
        minOrderValue,
        startDate,
        endDate,
        usageLimit
      },
      { new: true } // Trả về bản ghi đã cập nhật (thay vì bản ghi cũ)
    );

    if (!voucher) return res.status(404).json({ message: "Voucher không tồn tại" });
    res.status(200).json({ message: "Voucher đã được cập nhật thành công", voucher });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật voucher", error: error.message });
  }
};
//delete
exports.deleteVoucher = async (req, res) => {
  try {
    // Tìm và xóa voucher theo ID
    const voucher = await Voucher.findByIdAndDelete(req.params.id);

    // Nếu không tìm thấy voucher, trả về lỗi 404
    if (!voucher) {
      return res.status(404).json({ message: "Voucher không tồn tại" });
    }
    // Trả về thông báo thành công
    res.status(200).json({
      message: "Voucher đã được xóa thành công",
    });
  } catch (error) {
    // Xử lý lỗi server
    console.error("Lỗi khi xóa voucher:", error);
    res.status(500).json({ message: "Lỗi khi xóa voucher", error: error.message });
  }
};