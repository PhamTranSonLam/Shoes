const Warehouse = require("../models/Warehouse");

// Lấy danh sách các phiếu nhập
const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.status(200).json(warehouses);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách phiếu nhập", error });
  }
};

// Lấy thông tin chi tiết một phiếu nhập
const getWarehouseById = async (req, res) => {
  try {
    const { id } = req.params;
    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({ message: "Phiếu nhập không tồn tại" });
    }
    res.status(200).json(warehouse);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin phiếu nhập", error });
  }
};

// Tạo mới một phiếu nhập
const createWarehouse = async (req, res) => {
  try {
    const {  name, warehouse } = req.body;

    // Kiểm tra mã phiếu nhập đã tồn tại
    const existingWarehouse = await Warehouse.findOne({ name });
    if (existingWarehouse) {
      return res.status(400).json({ message: "Mã phiếu nhập đã tồn tại" });
    }
    const newWarehouse = new Warehouse({  name, warehouse });
    await newWarehouse.save();
    res.status(201).json(newWarehouse);
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Lỗi khi tạo phiếu nhập", error });
  }
};

// Cập nhật thông tin phiếu nhập
const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, warehouse, products } = req.body;
    console.log(req.body)
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(
      id,
      { name, warehouse, products},
      { new: true }
    );

    if (!updatedWarehouse) {
      return res.status(404).json({ message: "Phiếu nhập không tồn tại" });
    }

    res.status(200).json(updatedWarehouse);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật phiếu nhập", error });
  }
};

// Xóa phiếu nhập
const deleteWarehouse = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWarehouse = await Warehouse.findByIdAndDelete(id);

    if (!deletedWarehouse) {
      return res.status(404).json({ message: "Phiếu nhập không tồn tại" });
    }

    res.status(200).json({ message: "Xóa phiếu nhập thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa phiếu nhập", error });
  }
};

module.exports = {
  getAllWarehouses,
  getWarehouseById,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
};
