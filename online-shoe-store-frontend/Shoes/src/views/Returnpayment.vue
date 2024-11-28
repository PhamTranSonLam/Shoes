<template>
  <div class="container text-center">
    <h1>Kết quả thanh toán</h1>
    <div v-if="loading">Đang yêu cầu xử lý</div>
    <div v-else-if="success">
      <p class="text-success fw-bold fs-4">Chúc mừng bạn đã đăng ký thành công</p>
      <p>Mã code đơn hàng của bạn : {{ orderId }}</p>
    </div>
    <div v-else>
      <p class="text-danger fw-bold fs-4">Thanh toán thất bại, xin vui lòng thanh toán lại</p>
      <p v-if="errorMessage" class="text-muted">{{ errorMessage }}</p>
    </div>
    <router-link to="/" class="btn btn-primary mt-4">Quay lại sản phẩm</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      success: false,
      loading: true,
      orderId: null,
      errorMessage: null,
    };
  },
  async created() {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const response = await axios.get(`http://localhost:5000/api/payment/vnpay/return?${queryParams.toString()}`);

      if (response.data.statusCode === 200) {
        this.success = true;
        this.orderId = response.data.data._id;
      } else {
        this.success = false;
        this.errorMessage = response.data.msg || "Có lỗi xảy ra trong quá trình thanh toán.";
      }
    } catch (error) {
      console.error("Error handling payment return:", error);
      this.success = false;
      this.errorMessage = error.response?.data?.msg || "Không thể kết nối với máy chủ. Vui lòng thử lại sau.";
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style scoped>
.container {
  margin-top: 7rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: fadeIn 0.8s ease-in-out;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #34495e;
  margin-bottom: 1.5rem;
}

.text-success {
  color: #28a745;
  font-size: 1.8rem;
  font-weight: 600;
}

.text-danger {
  color: #dc3545;
  font-size: 1.8rem;
  font-weight: 600;
}

.text-muted {
  color: #6c757d;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.btn {
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  text-transform: uppercase;
}

.btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

