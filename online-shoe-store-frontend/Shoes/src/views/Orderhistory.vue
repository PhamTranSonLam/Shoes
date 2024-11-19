<template>
  <section id="page-header">
    <h2>Lịch sử đặt hàng của bạn</h2>
    <p>Kiểm tra các lần mua hàng trước và chi tiết đơn hàng bên dưới.</p>
  </section>

  <section id="order-history">
    <h2> Lịch sử đặt hàng của {{ user.username }}</h2>
    <div v-if="orders.length > 0" class="order-list">
      <div v-for="order in orders" :key="order._id" class="order-item">
        <div class="order-header">
          <h3>Mã đơn hàng #{{ order._id }}</h3>
          <div class="order-actions">
            <button class="review-button" @click="openReviewModal(order)">Review</button>
            <button class="edit-button" @click="updateOrderStatus(order)">Edit</button>
          </div>
        </div>
        <p><strong>Ngày:</strong> {{ new Date(order.createdAt).toLocaleString() }}</p>
        <p><strong>Tổng cộng:</strong> {{ formatPrice(order.totalAmount) }}</p>

        <h4>Sản phẩm đã đặt:</h4>
        <div v-for="item in order.items" :key="item.product._id" class="order-item-details">
          <img :src="`${item.mainImage}`" alt="Product Image" class="img-fluid bg-light" />
          <div class="item-info">
            <span class="product-name">{{ item.product.name }}</span>
            <span><strong>Số lượng:</strong> {{ item.quantity }}</span>
            <span><strong>Kích thước:</strong> {{ item.sizes }}</span>
            <span><strong>Giá:</strong> {{ formatPrice(item.product.price) }}</span>
            <span><strong>Trạng thái:</strong> {{ order.status }}</span>
            <p>Dự kiến giao hàng từ 3 đến 5 ngày</p>
          </div>
        </div>
        <div v-if="order.review" class="order-review">
          <p><strong>Đánh giá của bạn:</strong> {{ order.review.text }}</p>
          <p><strong>Đánh giá:</strong> {{ order.review.rating }} ⭐</p>
        </div>
      </div>
    </div>
    <div v-else>
      <p>No order history found.</p>
    </div>

    <!-- Review Modal -->
    <div v-if="isReviewModalOpen" class="review-modal" @click="closeReviewModal">
      <div class="modal-content" @click.stop>
        <span class="close" @click="closeReviewModal">&times;</span>
        <h2>Để lại đánh giá đơn hàng của bạn #{{ selectedOrder?._id }}</h2>
        <textarea v-model="reviewText" placeholder="Enter your review..."></textarea>
        <div class="button-group mb-4" id="rating-buttons">
          <button 
            v-for="n in 5" :key="n" :value="n" class="btn border me-2" :class="{ 'button-active': newRating === n }" @click.prevent="newRating = n">{{ n }}
          </button>
          <i class="fa-solid fa-star text-warning"></i> Ngôi sao
        </div>

        <button class="submit-button" @click="submitReview">Gửi đánh giá</button>
        <p v-if="submissionMessage" class="submission-message">{{ submissionMessage }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/user';

export default {
  data() {
    return {
      orders: [],
      isReviewModalOpen: false,
      selectedOrder: null,
      reviewText: '',
      newRating: 0,
      submissionMessage: ''
    };
  },
  computed: {
    user() {
      return this.UserStore.user;
    }
  },
  mounted() {
    this.fetchOrderHistory();
  },
  methods: {
    async fetchOrderHistory() {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/history', {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`
          }
        });
        this.orders = response.data.orders;
      } catch (error) {
        console.log('Error fetching order history:', error);
      }
    },
    formatPrice(value) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    },
    openReviewModal(order) {
      this.selectedOrder = order;
      this.isReviewModalOpen = true;
      this.reviewText = '';
      this.newRating = 0;
      this.submissionMessage = '';
    },
    closeReviewModal() {
      this.isReviewModalOpen = false;
      this.reviewText = '';
      this.newRating = 0;
      this.submissionMessage = '';
    },
    async submitReview() {
      if (this.reviewText.trim() && this.newRating > 0) {
        try {
          await axios.post(`http://localhost:5000/api/review`, {
            user: this.user._id,
            order: this.selectedOrder._id,
            rating: this.newRating,
            comment: this.reviewText
          }, {
            headers: {
              Authorization: `Bearer ${this.UserStore.token}`
            }
          });
          this.submissionMessage = 'Đánh giá của bạn đã được gửi!';
          this.closeReviewModal();
          this.fetchOrderHistory(); // Cập nhật danh sách đơn hàng
        } catch (error) {
          console.error('Error submitting review:', error);
          this.submissionMessage = 'Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại sau.';
        }
      } else {
        this.submissionMessage = "Vui lòng nhập đánh giá và chọn sao trước khi gửi.";
      }
    },
    async updateOrderStatus(order) {
      try {
        const newStatus = prompt("Nhập trạng thái mới cho đơn hàng (ví dụ: 'Đang xử lý', 'Đã giao', v.v.):");
        if (newStatus) {
          await axios.put(`http://localhost:5000/api/orders/status/${order._id}`, {
            status: newStatus,
          }, {
            headers: {
              Authorization: `Bearer ${this.UserStore.token}`
            }
          });
          alert("Cập nhật trạng thái đơn hàng thành công!");
          this.fetchOrderHistory(); // Cập nhật danh sách đơn hàng
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        alert("Không thể cập nhật trạng thái đơn hàng");
      }
    },
  },
  setup() {
    const UserStore = useUserStore();
    return {
      UserStore
    };
  }
};
</script>


<style scoped>
#page-header {
  background-image: url('../assets/img/backgradmin1.jpg');
  width: 100%;
  height: 40vh;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
#page-header h2 {
  color: white;
  font-size: 2.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

#page-header p {
  color: #f1f1f1;
  font-size: 1.4rem;
  margin-top: 0.5rem;
  font-style: italic;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

#order-history {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

#order-history h2 {
  font-size: 2.2rem;
  color: #333;
  margin-bottom: 25px;
  text-align: center;
  text-transform: capitalize;
  border-bottom: 2px solid #c72092;
  padding-bottom: 10px;
}

.order-list {
  margin-top: 30px;
}

.order-item {
  padding: 25px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  transition: all 0.3s ease;
  border-left: 5px solid #6c14d0;
}

.order-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-item h3 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 12px;
}

.order-actions {
  display: flex;
  gap: 10px;
}

.review-button,
.edit-button {
  padding: 8px 12px;
  font-size: 0.9rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
}

.review-button {
  background-color: #28a745;
  color: #fff;
}

.edit-button {
  background-color: #007bff;
  color: #fff;
}

.review-button:hover {
  background-color: #218838;
  transform: scale(1.05);
}

.edit-button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.order-item p {
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;
}

.order-item h4 {
  font-size: 1.3rem;
  color: #444;
  margin-top: 15px;
}

.order-item-details {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.order-item-details img {
  width: 70px;
  height: 70px;
  margin-right: 10px;
}

.item-info {
  display: flex;
  flex-direction: column;
}

.review-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8); /* Màu nền tối hơn để làm nổi bật modal */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease; /* Hiệu ứng chuyển động mượt mà */
}

.modal-content {
  background: #fefefe; /* Màu nền sáng cho nội dung modal */
  padding: 30px 40px; /* Thêm padding cho nội dung modal */
  border-radius: 15px; /* Bo tròn góc */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); /* Hiệu ứng đổ bóng */
  max-width: 500px; /* Giới hạn chiều rộng */
  width: 90%; /* Đảm bảo modal không quá lớn trên các màn hình nhỏ */
  position: relative; /* Để điều chỉnh vị trí close button */
}

.close {
  position: absolute; /* Đặt vị trí của nút đóng */
  top: 20px; /* Khoảng cách từ trên cùng */
  right: 25px; /* Khoảng cách từ bên phải */
  font-size: 1.6rem;
  cursor: pointer;
  color: #333; /* Màu sắc nút đóng */
  transition: color 0.2s;
}

.submit-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #218838;
}

.button-group {
  display: flex;
  margin-top: 10px;
}

.button-active {
  background-color: #ffc107; /* Màu vàng cho ngôi sao đã chọn */
  color: white;
}

.submission-message {
  margin-top: 10px;
  color: red;
  font-weight: bold;
}
textarea {
  width: 100%;
  height: 100px; /* Tăng chiều cao cho textarea */
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none; /* Tắt khả năng thay đổi kích thước */
  font-size: 1rem; /* Kích thước chữ */
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1); /* Đổ bóng bên trong */
}

</style>
