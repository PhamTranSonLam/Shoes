// routes/color.js
const express = require('express');
const ColorController = require('../controllers/ColorController');
const auth = require('../middleware/auth');
const router = express.Router();

// Lấy tất cả danh mục
router.get('/',  ColorController.getAllColor);

// Tạo danh mục mới
router.post('/', ColorController.createColor);

// Cập nhật danh mục theo ID
router.put('/:id',  ColorController.updateColor);

// Xóa danh mục theo ID
router.delete('/:id',  ColorController.deleteColor);

module.exports = router;
