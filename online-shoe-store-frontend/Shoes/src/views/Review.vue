<template>
  <div class="review-container">
    <h2>Đánh giá sản phẩm</h2>

    <!-- Danh sách đánh giá của người dùng -->
    <div v-if="reviews && reviews.length" v-for="review in reviews" :key="review.id" class="review">
      <div class="user-avatar">
        <img :src="`http://localhost:5000/uploads/${review.user.image}`" alt="User Avatar" />
      </div>
      <div class="review-content">
        <div class="review-header">
          <span class="user-name">{{ review.user.username }}</span>
          <span class="review-date">{{ review.date }}</span>
        </div>
        <div class="review-rating">
          <span v-for="n in 5" :key="n">
            <span v-if="n <= review.rating">⭐</span>
            <span v-else>☆</span>
          </span>
        </div>
        <p class="review-text">{{ review.comment }}</p>
        <button class="reply-button" @click="showReplyForm(review.id)">Feedback</button>
        <!-- Phản hồi từ nhân viên -->
        <div v-if="review.feedback" class="staff-feedback">
          <div class="staff-avatar">
            <img src="../assets/img/girl_dp1.jpg" alt="Staff Avatar" />
          </div>
          <div class="feedback-content">
            <span class="staff-name">{{ review.feedback.staff.username }}</span>
            <p class="feedback-text">{{ review.feedback.comment }}</p>
          </div>
        </div>  
      </div>
    </div>

    <div v-else class="text-danger">Không có đánh giá nào</div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/user';

export default {
  data() {
    return {
      reviews: [], // Mảng đánh giá
      newReviewText: '',
      newRating: 0,
      showReplyId: null, // ID đánh giá hiện đang hiển thị form phản hồi
      feedbackText: '' // Nội dung phản hồi từ nhân viên
    };
  },
  mounted() {
    this.fetchReviews(); // Gọi hàm fetchReviews khi component được mount
  },
  methods: {
    async fetchReviews() {

      try { 
        const userStore = useUserStore();
        const userId = userStore.user._id;
        const response = await axios.get(`http://localhost:5000/api/review/`);
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    },
    setRating(rating) {
      this.newRating = rating;
    },
    submitReview() {
      if (this.newReviewText && this.newRating > 0) {
        const newReview = {
          id: this.reviews.length + 1,
          userAvatar: 'user-avatar.jpg',
          username: 'Khách hàng mới',
          date: new Date().toLocaleDateString(),
          rating: this.newRating,
          comment: this.newReviewText,
          feedback: null
        };
        
        axios.post('http://localhost:5000/api/review', newReview)
          .then(() => {
            this.reviews.push(newReview);
            this.newReviewText = '';
            this.newRating = 0;
          })
          .catch(error => {
            console.error('Error submitting review:', error);
            alert('Có lỗi xảy ra khi gửi đánh giá.');
          });
      } else {
        alert('Vui lòng nhập nội dung và đánh giá sao');
      }
    },
    showReplyForm(reviewId) {
      this.showReplyId = this.showReplyId === reviewId ? null : reviewId;
      this.feedbackText = '';
    },
    async submitFeedback(reviewId) {
      if (this.feedbackText) {
        try {
          const response = await axios.put(`http://localhost:5000/api/review/${reviewId}/feedback`, {
            comment: this.feedbackText,
            staff: 'Admin',
            feedbackAt: new Date().toISOString()
          });
          
          const updatedReview = response.data;
          const index = this.reviews.findIndex(review => review.id === reviewId);
          if (index !== -1) {
            this.reviews.splice(index, 1, updatedReview);
          }
          this.showReplyId = null;
          this.feedbackText = '';
        } catch (error) {
          console.error('Error submitting feedback:', error);
          alert('Có lỗi xảy ra khi gửi phản hồi.');
        }
      } else {
        alert('Vui lòng nhập nội dung phản hồi');
      }
    }
  }
};
</script>
<style scoped>
.review-container {
  margin-top: 80px;

  width: 100%;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.review {
  display: flex;
  margin-bottom: 20px;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.user-avatar,
.staff-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar img,
.staff-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}



.review-content {
  width: 100%;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.user-name,
.staff-name {
  font-weight: bold;
}

.review-date {
  color: #888;
  font-size: 12px;
}

.review-rating {
  color: #f39c12;
  margin-bottom: 10px;
}

.review-text {
  margin-bottom: 10px;
}

.reply-button {
  background-color: transparent;
  color: #065fd4;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
}

.staff-feedback {
  display: flex;
  align-items: flex-start;
  margin-top: 10px;
  padding-left: 65px;
}

.feedback-content {
  background-color: #f0f2f5;
  padding: 10px;
  border-radius: 5px;
}

.feedback-text {
  font-size: 14px;
  color: #333;
}

.new-review-form {
  margin-top: 20px;
}

.new-review-form h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.new-review-form textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
}

.rating-stars {
  font-size: 20px;
  color: #f39c12;
  margin-bottom: 10px;
}

.filled-star {
  color: #f39c12;
}

.empty-star {
  color: #ccc;
}

.submit-button {
  background-color: #065fd4;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #054baf;
}
</style>
