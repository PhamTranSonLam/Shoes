<template>
  <div class="container text-center">
    <h1>Kết quả thanh toán</h1>
    <div v-if="loading">Đang xử lý...</div>
    <div v-else-if="success">
      <p class="text-success fw-bold fs-4">Thanh toán thành công!</p>
      <p>Mã đơn đặt phòng: {{ orderId }}</p>
    </div>
    <div v-else>
      <p class="text-danger fw-bold fs-4">Thanh toán thất bại. Vui lòng thử lại.</p>
      <p v-if="errorMessage" class="text-muted">{{ errorMessage }}</p>
    </div>
    <router-link to="/" class="btn btn-primary mt-4">Quay lại trang chủ</router-link>
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
}
</style>
