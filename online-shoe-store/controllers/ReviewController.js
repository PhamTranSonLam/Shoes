const mongoose = require ('mongoose');
const Review = require('../models/Review');
const Order = require('../models/Order');



// Tạo đơn hàng và liên kết với booking
const createReview = async (req, res) => {
    try {
        // Extract data from the request body
        const {order, user, rating, comment, feedback } = req.body;
        // Validate required fields
        // if (!order || !user || rating === undefined) {
        //     return res.status(400).json({
        //         message: "Booking, Customer, and Rating are required fields.",
        //     });
        // }
        // Create the review
        const review = await Review.create({
            order,
            user,
            rating,
            comment,
            feedback,
        });

        // Respond with the created review
        res.status(201).json(review);
    } catch (error) {
        console.error("Error creating review:", error.message || error);
        res.status(500).json({
            message: "Failed to create review",
            error: error.message || error,
        });
    }
};

const getReviewByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const review = await Review.find({ user: userId }).populate('user').populate('feedback.staff');
        res.status(200).json(review);
    } catch (error) {
        console.error("Error creating review:", error.message || error);
        res.status(500).json({
            message: "Failed to create review",
            error: error.message || error,
        });
        
    }
}

const getReviewById = async (req, res) => {
    try {
        const { userId } = req.params;
        const review = await Review.find({ user: userId}).populate('user');
        res.status(200).json(review);
    } catch (error) {
        console.error("Error creating review:", error.message || error);
        res.status(500).json({
            message: "Failed to create review",
            error: error.message || error,
        });
        
    }
}

const getAllReview = async (req, res) => {
    try {
        const review = await Review.find().populate('user').populate('feedback.staff');
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({
            message: "Failed to get review",
            error: error.message || error,
        });
    }
}

const feedbackUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, staff, feedbackAt } = req.body;

        // Kiểm tra xem tất cả các trường có được cung cấp hay không
        if (!comment || !staff || !feedbackAt) {
            return res.status(400).json({ message: 'Thiếu thông tin cần thiết để gửi phản hồi.' });
        }

        const review = await Review.findByIdAndUpdate(
            id,
            { feedback: { comment, staff, feedbackAt } },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
        }

        res.status(200).json({
            message: 'Phản hồi đã được gửi thành công.',
            review,
        });
    } catch (error) {
        console.error(error); // Ghi lại lỗi để phục vụ cho việc gỡ lỗi
        res.status(500).json({ message: 'Lỗi khi gửi phản hồi' });
    }
};


const deleteById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);

        res.status(200).json({ message: 'Xóa thành công'})
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi gửi xóa' });
    }
}



module.exports = {
  createReview,
  getReviewByUser,
  getAllReview,
  getReviewById,
  feedbackUser,
  deleteById
};