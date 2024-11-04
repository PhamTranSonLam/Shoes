// routes/auth.js
const express = require('express');
const AuthadminController = require('../controllers/AuthadminController');
const router = express.Router();

// Đăng ký
router.post('/register', AuthadminController.register);

// Đăng nhập
router.post('/login', AuthadminController.login);

router.get('/', AuthadminController.getAll);
// Route cập nhật thông tin tài khoản
router.put('/update/:id', AuthadminController.updateUseradmin);

router.get('/:userId', AuthadminController.getByUser);


router.delete('/:id', AuthadminController.deleteUseradmin);



module.exports = router;
