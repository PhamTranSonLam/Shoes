const Warehouse = require("../models/Warehouse");

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Warehouse.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Thêm sản phẩm
exports.addProduct = async (req, res) => {
  const { name, sku, quantity, price, category, description } = req.body;
  try {
    const newProduct = new Warehouse({ name, sku, quantity, price, category, description });
    await newProduct.save();
    res.status(201).json({ message: "Thêm sản phẩm thành công", product: newProduct });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi thêm sản phẩm", error });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const updatedProduct = await Warehouse.findByIdAndUpdate(id, updates, { new: true });
    res.status(200).json({ message: "Cập nhật thành công", product: updatedProduct });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi cập nhật sản phẩm", error });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await Warehouse.findByIdAndDelete(id);
    res.status(200).json({ message: "Xóa sản phẩm thành công" });
  } catch (error) {
    res.status(400).json({ message: "Lỗi khi xóa sản phẩm", error });
  }
};
