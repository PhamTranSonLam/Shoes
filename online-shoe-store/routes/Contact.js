const express = require('express');
const ContactController = require('../controllers/ContactController');
const auth = require('../middleware/auth'); // Optional: If you want to restrict access to certain routes
const router = express.Router();

// Route to submit contact form
router.post('/submit', ContactController.submitContactForm);

// Route to get all contact forms (admin only)
router.get('/', auth, ContactController.getContactForms);

// Route to get a specific contact form by ID (admin only)
router.get('/:id', auth, ContactController.getContactFormById);

// Route to delete a contact form by ID (admin only)
router.delete('/:id', auth, ContactController.deleteContactForm);
//POST /api/orders
router.post('/orders', async (req, res) => {
    const { items, shippingInfo, paymentMethod, totalAmount } = req.body;
  
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
  
    try {
      const newOrder = new Order({
        user: req.user._id, // Assuming user authentication
        items,
        shippingInfo,
        paymentMethod,
        totalAmount,
      });s
  
      await newOrder.save();
      res.status(200).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
      res.status(500).json({ message: 'Failed to place order', error });
    }
  });

module.exports = router;
