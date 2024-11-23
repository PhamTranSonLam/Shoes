// routes/auth.js
const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
const multer = require('multer');

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
router.post('/register', AuthController.register);

// Đăng nhập
router.post('/login', AuthController.login);
// Route đổi mật khẩu
router.post('/change-password', AuthController.changePassword);

router.get('/:userId', AuthController.getByUser);

router.get('/',AuthController.getAll);
router.delete('/:id', AuthController.deleteUser);
// Route cập nhật thông tin tài khoản
// router.put('/update/:id',upload.single('image'), AuthController.updateUser);
router.put('/update/:id', upload.single('image'), (req, res, next) => {
    console.log('File upload:', req.file);
    console.log('Request body:', req.body);
    next();
  }, AuthController.updateUser);
  

module.exports = router;
