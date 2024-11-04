// routes/cart.js
const express = require('express');
const CartController = require('../controllers/CartController'); // This should be an object
const auth = require('../middleware/auth'); // Middleware for authentication
const router = express.Router();

// Define routes with appropriate callbacks
// Example route setup in your Express app
router.get('/:userId',auth, CartController.getCart);
router.post('/add', auth, CartController.addToCart);
router.put('/update/:id',auth, CartController.updateCartItem);
router.delete('/remove/:itemId',auth,CartController.removeFromCart);
// router.delete('/clear', auth, CartController.clearCart);

module.exports = router;
