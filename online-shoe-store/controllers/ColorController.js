// controllers/ColorController.js
const Color = require('../models/Color');

// Lấy tất cả danh mục
exports.getAllColor = async (req, res) => {
    try {
        const color = await Color.find();
        res.json(color);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Tạo danh mục mới
exports.createColor = async (req, res) => {
    const color = new Color(req.body);
    try {
        const newColor = await color.save();
        res.status(201).json(newColor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Cập nhật danh mục theo ID
exports.updateColor = async (req, res) => {
    try {
        const updatedColor = await Color.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedColor);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa danh mục theo ID
exports.deleteColor = async (req, res) => {
    try {
        await Color.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted color' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
