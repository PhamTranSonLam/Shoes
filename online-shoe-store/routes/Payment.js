const express = require('express'); // Sử dụng cú pháp CommonJS
const router = express.Router();
const PaymentController = require('../controllers/PaymentController'); // Đảm bảo đường dẫn chính xác

// Sử dụng các hàm trong PaymentController
router.post('/vnpay/create_payment_url', PaymentController.createPaymentVnpayUrl);
router.get('/vnpay/return', PaymentController.vnpayReturn);
router.get('/vnpay/ipn', PaymentController.vnpayIpn);
module.exports = router; // Xuất router
