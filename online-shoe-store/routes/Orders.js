const express = require('express');
const OrderController = require('../controllers/OrderController');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


// Place an order
router.post('/place', OrderController.placeOrder);

router.get('/', OrderController.getAllOrders);
// Get orders by user
router.get('/history',auth, OrderController.getOrderHistory);
// thong ke
router.get('/weekly-revenue',  OrderController.getWeeklyRevenue);
// router.get('/', OrderController.getOrdersByUser);
router.delete('/:id', OrderController.deleteOrders);
// lấy đơn hàng 
router.get('/:id', OrderController.getOrderById);
// get order data
router.put('/:id', OrderController.updatebookingstatus);
// Update order status
router.put('/status/:id', OrderController.updateOrderStatus);





module.exports = router;

