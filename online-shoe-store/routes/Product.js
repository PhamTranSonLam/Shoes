const express = require('express');
const ProductController = require('../controllers/ProductController');
const auth = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const upload = multer();

// Lấy danh sách tất cả các sản phẩm giày
router.get('/', ProductController.getProducts);

// Thêm sản phẩm giày mới
router.post('/', ProductController.createProduct); // Requires authentication

// Cập nhật sản phẩm giày theo ID
// router.put('/:id', auth, ProductController.updateProduct); // Requires authentication
router.put('/:id', ProductController.updateProduct);

router.get('/top-sold', ProductController.getTopProducts)
// Xóa sản phẩm giày theo ID
router.delete('/:id', ProductController.deleteProduct); // Requires authenticationzyy

// Lấy chi tiết sản phẩm giày theo ID (Product details)
router.get('/:id', ProductController.getProductById); // No auth for public access

// Lấy thông tin cart
router.post('/add',ProductController.addToCart);

module.exports = router;
