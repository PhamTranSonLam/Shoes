// routes/categories.js
const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const auth = require('../middleware/auth');
const router = express.Router();

// Lấy tất cả danh mục
router.get('/',  CategoryController.getAllCategories);

// Tạo danh mục mới
router.post('/', CategoryController.createCategory);

// Cập nhật danh mục theo ID
router.put('/:id',  CategoryController.updateCategory);

// Xóa danh mục theo ID
router.delete('/:id',  CategoryController.deleteCategory);

module.exports = router;
