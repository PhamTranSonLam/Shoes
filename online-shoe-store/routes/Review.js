// routes/categories.js
const express = require('express');
const ReviewController = require('../controllers/ReviewController');
// const auth = require('../middleware/auth');
const router = express.Router();

// GET route for adding a menu
router.get('/', ReviewController.getAllReview);
// router.get('/', ReviewController.getReviewByUser);
router.get('/:userId', ReviewController.getReviewById);
router.post('/', ReviewController.createReview);

router.post('/:id/comment', ReviewController.feedbackUser);

router.delete('/:id', ReviewController.deleteById);

module.exports = router;