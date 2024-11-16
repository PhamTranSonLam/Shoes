// routes/auth.js
const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();

// Đăng ký
router.post('/register', AuthController.register);

// Đăng nhập
router.post('/login', AuthController.login);
// Route đổi mật khẩu
router.post('/change-password', AuthController.changePassword);

router.get('/:userId', AuthController.getByUser);

router.get('/',AuthController.getAll);
router.delete('/:id', AuthController.deleteUser);
// Route cập nhật thông tin tài khoản
router.put('/update/:id', AuthController.updateUser);

module.exports = router;
