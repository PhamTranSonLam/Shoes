const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    feedback:{
        staff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin"
        },
        comment: {
            type: String,
            trim: true,
        }
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
// Index for faster queries on customer, booking, or staff fields
reviewSchema.index({ user: 1, order: 1, "feedback.staff": 1 });
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
