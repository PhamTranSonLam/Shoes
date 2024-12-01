<template>
  <div class="container mt-5">
    <!-- Thanh Tìm kiếm -->
    <div class="col-md-10 mb-4">
      <input type="text" class="form-control search-input" placeholder="Tìm kiếm đơn hàng" v-model="searchTerm" @input="filterOrders" />
    </div>

    <!-- Danh sách đơn hàng -->
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Danh sách Đơn hàng</h4>
        <div class="check" >
          <input type="date" id="date" name="date" v-model="selectedDate" @change="filterOrdersByDate" />
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Trạng thái</button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="#" @click.prevent="filterByStatus('Đang xử lý')">Đang xử lý</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="filterByStatus('Đã giao')">Đã giao</a></li>
              <li><a class="dropdown-item" href="#" @click.prevent="filterByStatus('Đã hủy')">Đã hủy</a></li>
            </ul>
          </div>
          <button class="btn btn-info btn-sm">
            <router-link to="/bill" class="text-decoration-none text-white">Hóa đơn</router-link>
          </button>
          <button class="btn btn-info btn-sm" @click="exportToCSV">Xuất File</button>
        </div>
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
              <th scope="col">Thanh toán</th>
              <th scope="col">Ngày đặt</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredOrders.length === 0">
              <td colspan="9" class="text-center">Không có đơn hàng nào!</td>
            </tr>
            <tr v-for="(order, index) in paginatedOrders" :key="order._id">
              <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
              <td>{{ order.shippingInfo.username }}</td>
              <td>{{ order.shippingInfo.phone }}</td>
              <td>
                <ul>
                  <li v-for="item in order.items" :key="item._id">
                    {{ item.product.name }} - Số lượng: {{ item.quantity }}
                  </li>
                </ul>
              </td>
              <td>{{ formatCurrency(order.totaldiscount || order.totalAmount) }} VNĐ</td>
              <td>
                <select v-model="order.status" class="form-select" @change="updateOrderStatus(order)">
                  <option value="Đang xử lý" :disabled="order.status === 'Đã giao' || order.status === 'Đã hủy'">Đang xử lý</option>
                  <option value="Đã giao" :disabled="order.status === 'Đã giao' || order.status === 'Đã hủy'">Đã giao</option>
                  <option value="Đã hủy" :disabled="order.status === 'Đã giao' || order.status === 'Đã hủy'">Đã hủy</option>
                </select>
              </td>
              <td>{{ order.paymentMethod }}</td>
              <td>{{ new Date(order.createdAt).toLocaleString() }}</td>
              <td class="d-flex">
                <router-link :to="'/orderdetail/' + order._id" class="btn btn-success btn-sm">Chi tiết</router-link>
                <button type="button" class="btn btn-danger btn-sm" @click="deleteOrder(order._id)">Xóa</button>
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
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
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
      searchTerm: "",
      selectedDate: "",
      currentPage: 1,
      pageSize: 5,
      loading: true,
      errorMessage: "",
      selectedStatus: "",
    };
  },
  computed: {
    filteredOrders() {
      let orders = this.orders;

      // Filter by customer name
      if (this.searchTerm) {
        orders = orders.filter((order) =>
          order.shippingInfo.username.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      }

      // Filter by selected date
      if (this.selectedDate) {
        const selectedDateFormatted = this.selectedDate;
        orders = orders.filter(order => {
          const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
          return orderDate === selectedDateFormatted;
        });
      }

      // Filter by status
      if (this.selectedStatus) {
        orders = orders.filter(order => order.status === this.selectedStatus);
      }

      return orders;
    },
    paginatedOrders() {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      return this.filteredOrders.slice(startIndex, startIndex + this.pageSize);
    },
    totalPages() {
      return Math.ceil(this.filteredOrders.length / this.pageSize);
    },
  },
  methods: {
    formatCurrency(amount) {
      return new Intl.NumberFormat('vi-VN', { style: 'decimal' }).format(amount);
    },
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:5000/api/orders");
        this.orders = response.data.map((order) => ({
          ...order,
          status: order.status || "Đang xử lý",
        }));
      } catch (error) {
        console.error("Lỗi khi lấy danh sách đơn hàng:", error);
        this.errorMessage = "Không thể tải danh sách đơn hàng";
      } finally {
        this.loading = false;
      }
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
    exportToCSV() {
      const headers = [
        "STT",
        "Tên khách hàng",
        "Số điện thoại",
        "Sản phẩm",
        "Tổng tiền",
        "Trạng thái",
        "Thanh toán",
        "Ngày đặt",
      ];

      const rows = this.orders.map((order, index) => {
        const products = order.items
          .map((item) => `${item.product.name} - Số lượng: ${item.quantity}`)
          .join("\n");

        return [
          index + 1,
          order.shippingInfo.username,
          order.shippingInfo.phone,
          `"${products}"`,
          order.totalAmount,
          order.status,
          order.paymentMethod,
          new Date(order.createdAt).toLocaleString(),
        ];
      });

      let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n";
      csvContent += rows.map((row) => row.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "orders.csv");
      document.body.appendChild(link);
      link.click();
    },
    filterOrders() {
      this.currentPage = 1;
    },
    filterByStatus(status) {
      this.selectedStatus = status;
      this.currentPage = 1;
    },
    filterOrdersByDate() {
      this.currentPage = 1;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage -= 1;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage += 1;
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
#date {
  width: 100%;
  max-width: 150px;
  padding: 10px 10px;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  background-color: #ffffff;

}

.check {
  display: flex;
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
