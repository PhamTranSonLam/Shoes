<template>
  <div class="container mt-5">
    <h2 class="text-center text-primary mb-4">Chi tiết Đơn hàng</h2>

    <div class="text-center" v-if="loading">
      <p>Đang tải thông tin đơn hàng...</p>
    </div>

    <div v-else>
      <div class="alert alert-danger" v-if="errorMessage">{{ errorMessage }}</div>

      <!-- Customer Info Card -->
      <div class="card shadow mb-4">
        <div class="card-header">
          <h4 class="mb-0">Thông tin khách hàng</h4>
        </div>
        <div class="card-body">
          <p><strong>Tên khách hàng:</strong> <span class="text-muted">{{ order.shippingInfo?.username }}</span></p>
          <p><strong>Số điện thoại:</strong> <span class="text-muted">{{ order.shippingInfo?.phone }}</span></p>
          <p><strong>Địa chỉ:</strong> <span class="text-muted">{{ order.shippingInfo?.address }}</span></p>
        </div>
      </div>

      <!-- Product Info Card -->
      <div class="card shadow mb-4">
        <div class="card-header">
          <h4 class="mb-0">Thông tin sản phẩm</h4>
        </div>
        <div class="card-body">
          <ul class="list-group">
            <li v-for="item in order.items" :key="item._id" class="list-group-item">
              <strong class="text-dark">Tên sản phẩm: {{ item.product.name }}</strong>
              <p class="mb-0"><strong>Số lượng:</strong> <span class="text-muted">{{ item.quantity }}</span></p>
              <p class="mb-0"><strong>Giá:</strong> <span class="text-muted">{{ parseInt(item.price) }} VND</span></p>
            </li>
          </ul>
        </div>
      </div>

      <!-- Total Amount Card -->
      <div class="card shadow mb-4">
        <div class="card-header">
          <h4 class="mb-0">Tổng tiền</h4>
        </div>
        <div class="card-body">
          <p><strong>Tổng cộng:</strong> <span class="text-dark h5">{{ order.totalAmount }} VND</span></p>
          <p><strong>Trạng thái đơn hàng:</strong> <span class="text-muted">{{ order.status }}</span></p>
          <p><strong>Ngày đặt:</strong> <span class="text-muted">{{ new Date(order.createdAt).toLocaleString() }}</span></p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="text-center mb-4">
        <router-link to="/order">
          <button class="btn btn-gradient">Exit</button>
        </router-link>
        <button class="btn btn-gradient" @click="showInvoiceModal" ref="invoiceButton">Xuất Hóa Đơn</button>
      </div>

      <!-- Invoice Modal -->
      <div v-if="showModal" class="modal fade show" style="display: block;" @click.self="closeInvoiceModal">
        <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="invoiceModalLabel">Hóa Đơn</h5>
              <button type="button" class="close" @click="closeInvoiceModal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <h2>Shoes</h2>
              <p>ĐC: 201T, Trần Hưng Đạo, Phường Lê Bình, Quận Cái Răng, Tp Cần Thơ</p>
              <p>Điện thoại: 03092375725</p>
              <h1 class="text-center">Hóa Đơn Bán Hàng</h1>
              <p class="text-center">{{ new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
              <p>Thu ngân: Lam</p>
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Tên Hàng</th>
                    <th scope="col">Số Lượng</th>
                    <th scope="col">Giá</th>
                    <th scope="col">Tổng Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in order.items" :key="item._id">
                    <td>{{ item.product.name }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>{{ item.product.price }} VND</td>
                    <td>{{ item.quantity * item.product.price }} VND</td>
                  </tr>
                </tbody>
              </table>
              <div class="d-flex justify-content-between">
                <p>Tổng Số Lượng:</p>
                <p>{{ order.items.reduce((sum, item) => sum + item.quantity, 0) }}</p>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <p class="fw-bold">Tổng:</p>
                <p class="fw-bold">{{ order.totalAmount }} VND</p>
              </div>
              <div class="d-flex justify-content-between">
                <p>Giảm giá HĐ</p>
                <p>0</p>
              </div>
              <h4 class="text-center">Xin Cảm Ơn Quý Khách / Thank You!</h4>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="closeInvoiceModal">Đóng</button>
              <button type="button" class="btn btn-gradient" @click="printInvoice">In hóa đơn</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      order: {},
      loading: true,
      errorMessage: '',
      showModal: false, // Add this line
    };
  },
  methods: {
    async fetchgetOrderById() {
      this.loading = true;
      this.errorMessage = '';
      try {
        const response = await axios.get(`http://localhost:5000/api/orders/${this.$route.params.id}`);
        this.order = response.data;
      } catch (error) {
        console.log('Lỗi khi lấy chi tiết đơn hàng:', error);
        this.errorMessage = 'Không thể tải thông tin đơn hàng';
      } finally {
        this.loading = false;
      }
    },
    async updateOrderStatus(newStatus) {
    try {
      await axios.put(`http://localhost:5000/api/orders/${this.order._id}`, { status: newStatus });
      this.order.status = newStatus; // Cập nhật trạng thái trong giao diện
    } catch (error) {
      console.log('Lỗi khi cập nhật trạng thái đơn hàng:', error);
      this.errorMessage = 'Không thể cập nhật trạng thái đơn hàng';
    }
  },

    showInvoiceModal() {
      this.showModal = true; // Change this line
    },
    closeInvoiceModal() {
      this.showModal = false; // Change this line
      this.$refs.invoiceButton.focus(); // Ensure focus returns to the button
    },
    printInvoice() {
      window.print();
    },
  },
  created() {
    this.fetchgetOrderById();
  },
};
</script>


<style scoped>
.container {
  max-width: 800px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin: auto;
}

.card {
  border: none;
  border-radius: 10px;
  background-color: #ffffff;
}

.btn-gradient {
  background: linear-gradient(45deg, #6a5acd, #00bfff);
  color: white;
}
</style>
