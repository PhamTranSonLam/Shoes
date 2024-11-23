// routes/auth.js
const express = require('express');
const AuthadminController = require('../controllers/AuthadminController');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename for each file
    },
  });
  
  // Initialize multer to handle multiple file uploads with field names 'image' and 'additionalImages'
  const upload = multer({ storage: storage });
// Đăng ký
router.post('/register', AuthadminController.register);

// Đăng nhập
router.post('/login', AuthadminController.login);
// Route đổi mật khẩu
router.post('/change-password', AuthadminController.changePassword);

router.get('/', AuthadminController.getAll);
// Route cập nhật thông tin tài khoản
router.put('/update/:id', upload.single('image'), (req, res, next) => {
    console.log('File upload:', req.file);
    console.log('Request body:', req.body);
    next();
  }, AuthadminController.updateUseradmin);

router.get('/:userId', AuthadminController.getByUser);


router.delete('/:id', AuthadminController.deleteUseradmin);



module.exports = router;
