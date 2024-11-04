<template>
  <div class="container mt-5">
    <!-- Thanh Tìm kiếm -->
    <div class="col-md-10 mb-4">
      <input
        type="text"
        class="form-control search-input"
        placeholder="Tìm kiếm đơn hàng"
        v-model="searchTerm"
        @input="filterOrders"
      />
    </div>

    <!-- Danh sách đơn hàng -->
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Danh sách Đơn hàng</h4>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center p-3">
          <p>Đang tải dữ liệu...</p>
        </div>
        <table v-else class="table table-hover text-center">
          <thead class="table-header">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Sản phẩm</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Hình thức thanh toán</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="8" class="text-center">Không có đơn hàng nào!</td>
            </tr>
            <tr v-for="(order, index) in filteredOrders" :key="order._id">
              <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
              <td>{{ order.shippingInfo.username }}</td>
              <td>{{ order.shippingInfo.phone }}</td>
              <td>
                <ul>
                  <li v-for="item in order.items" :key="item._id">{{ item.product.name }}</li>
                </ul>
              </td>
              <td>{{ order.totalAmount }} VND</td>
              <td>
                <select v-model="order.status" class="form-select" @change="updateOrderStatus(order)">
                  <option value="Đang xử lý">Đang xử lý</option>
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </td>
              <td>{{ order.paymentMethod }}</td>
              <td>
                <router-link :to="'/orderdetail/' + order._id" class="btn btn-success btn-sm">
                  Chi tiết
                </router-link>
                <button type="button" class="btn btn-danger btn-sm" @click="deleteOrder(order._id)">
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </div>
    </div>
    
    <!-- Điều hướng Phân trang -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Trước</button>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Sau</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      orders: [],
      filteredOrders: [],
      searchTerm: "",
      currentPage: 1,
      pageSize: 5,
      loading: true,
      errorMessage: "",
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.orders.length / this.pageSize);
    },
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      this.errorMessage = "";
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        this.orders = response.data.map(order => {
          // Gán trạng thái mặc định là "Đang xử lý" nếu không có trạng thái
          if (!order.status) {
            order.status = "Đang xử lý";
          }
          return order;
        });
        this.filteredOrders = this.paginate(this.orders, this.pageSize, this.currentPage);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        this.errorMessage = "Không thể tải danh sách đơn hàng";
      } finally {
        this.loading = false;
      }
    },
    filterOrders() {
      const filtered = this.orders.filter((order) =>
        order.shippingInfo.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.filteredOrders = this.paginate(filtered, this.pageSize, this.currentPage);
    },
    paginate(array, pageSize, pageNumber) {
      return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
    },
    goToPage(page) {
      this.currentPage = page;
      this.filterOrders();
    },
    async deleteOrder(orderId) {
      if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
        try {
          await axios.delete(`http://localhost:5000/api/orders/${orderId}`);
          this.fetchOrders();
        } catch (error) {
          console.error("Lỗi khi xóa đơn hàng:", error);
          this.errorMessage = "Không thể xóa đơn hàng";
        }
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.filterOrders();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.filterOrders();
      }
    },
    async updateOrderStatus(order) {
      try {
        await axios.put(`http://localhost:5000/api/orders/status/${order._id}`, {
          status: order.status,
        });
        alert("Cập nhật trạng thái đơn hàng thành công!");
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        this.errorMessage = "Không thể cập nhật trạng thái đơn hàng";
      }
    },
  },
  created() {
    this.fetchOrders();
  },
};
</script>



<style scoped>
/* Container Styling */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Search Bar */
.search-input {
  padding: 10px 20px;
  font-size: 16px;
  width: 30%; /* Full width on smaller devices */
  border: 2px solid #ddd;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

/* Search Bar Hover and Focus Effects */
.search-input:hover,
.search-input:focus {
  border-color: #00796b;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  outline: none;
  background-color: #ffffff;
}

/* Card Styling */
.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

/* Card Header */
.card-header {
  background-color: #f8f9fa;
  color: #333;
  padding: 15px;
  font-size: 1.25rem;
  border-bottom: 2px solid #28a745;
}

/* Table Styling */
.table {
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.table-header {
  background-color: #28a745;
  color: white;
}

.table-header th {
  text-transform: uppercase;
  font-size: 0.875rem;
  padding: 12px;
}

.table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

.table td,
.table th {
  padding: 12px 15px;
  font-size: 0.875rem;
}

.table td {
  color: #555;
}

/* Form Select Styling */
.form-select {
  border-radius: 5px;
  border: 1px solid #ddd;
}
/* Pagination Styling */
.pagination {
  margin-top: 20px;
}

.page-link {
  color: #28a745;
}

.page-item.active .page-link {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.page-item.disabled .page-link {
  color: #ddd;
}



/* Button Styling */
.btn {
  font-size: 0.875rem;
  padding: 8px 12px;
  border-radius: 8px;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  font-weight: bold;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .table th,
  .table td {
    padding: 10px;
  }

  .btn {
    font-size: 0.75rem;
  }
}
</style>


<style scoped>
/* Container Styling */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Search Bar */
.search-input {
  padding: 10px 20px;
  font-size: 16px;
  width: 30%; /* Full width on smaller devices */
  border: 2px solid #ddd;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

/* Search Bar Hover and Focus Effects */
.search-input:hover,
.search-input:focus {
  border-color: #00796b;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  outline: none;
  background-color: #ffffff;
}

/* Card Styling */
.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

/* Card Header */
.card-header {
  background-color: #f8f9fa;
  color: #333;
  padding: 15px;
  font-size: 1.25rem;
  border-bottom: 2px solid #28a745;
}

/* Table Styling */
.table {
  margin: 0;
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
}

.table-header {
  background-color: #28a745;
  color: white;
}

.table-header th {
  text-transform: uppercase;
  font-size: 0.875rem;
  padding: 12px;
}

.table tbody tr {
  border-bottom: 1px solid #eee;
  transition: background-color 0.3s ease;
}

.table tbody tr:hover {
  background-color: #f1f1f1;
}

.table td,
.table th {
  padding: 12px 15px;
  font-size: 0.875rem;
}

.table td {
  color: #555;
}

/* Form Select Styling */
.form-select {
  border-radius: 5px;
  border: 1px solid #ddd;
}
/* Pagination Styling */
.pagination {
  margin-top: 20px;
}

.page-link {
  color: #28a745;
}

.page-item.active .page-link {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.page-item.disabled .page-link {
  color: #ddd;
}



/* Button Styling */
.btn {
  font-size: 0.875rem;
  padding: 8px 12px;
  border-radius: 8px;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
  font-weight: bold;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

/* Responsive Design */
@media (max-width: 768px) {
  .table th,
  .table td {
    padding: 10px;
  }

  .btn {
    font-size: 0.75rem;
  }
}
</style>
