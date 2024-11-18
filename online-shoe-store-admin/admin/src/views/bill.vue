<template>
    <div class="bill shadow">
      <div class="m-5">
        <h1 class="mb-3">Hóa đơn</h1>
        <table class="table">
          <thead>
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Ngày Tạo</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Giá giảm</th>
              <th scope="col">Tổng tiền sau giảm</th>
            </tr>
          </thead>
          <tbody>
            <!-- Hiển thị các hóa đơn cho trang hiện tại -->
            <tr v-for="(order, index) in paginatedOrders" :key="order._id">
              <th scope="row">{{ index + 1 + (currentPage - 1) * pageSize }}</th>
              <td>{{ new Date(order.createdAt).toLocaleDateString('vi-VN') }}</td>
              <td>{{ order.shippingInfo.username }}</td>
              <td>{{ order.totalAmount }} VND</td>
              <td>{{ order.discount || '0' }} VND</td>
              <td>{{ order.totaldiscount || order.totalAmount }} VND</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  
    <!-- Phần điều hướng phân trang -->
    <nav aria-label="Page navigation" class="mt-4" >
      <ul class="pagination justify-content-center" >
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Trước</button>
        </li>
        <li class="page-item" v-for="page in totalPages":key="page":class="{ active: currentPage === page }">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Sau</button>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        orders: [], // Lưu danh sách hóa đơn
        currentPage: 1, // Trang hiện tại
        pageSize: 5, // Số lượng hóa đơn trên mỗi trang
      };
    },
    computed: {
      // Tổng số trang
      totalPages() {
        return Math.ceil(this.orders.length / this.pageSize);
      },
      // Các hóa đơn trên trang hiện tại
      paginatedOrders() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.orders.slice(startIndex, startIndex + this.pageSize);
      },
    },
    methods: {
      // Hàm gọi API lấy danh sách hóa đơn
      async fetchOrders() {
        try {
          const response = await axios.get('http://localhost:5000/api/orders');
          this.orders = response.data;
        } catch (error) {
          console.error('Lỗi khi lấy danh sách hóa đơn:', error);
        }
      },
      // Điều hướng tới trang trước
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      // Điều hướng tới trang kế tiếp
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      // Điều hướng tới một trang cụ thể
      goToPage(page) {
        this.currentPage = page;
      },
    },
    mounted() {
      this.fetchOrders(); // Lấy dữ liệu khi component được mount
    },
  };
  </script>
  
  <style scoped>
.bill {
  background: #ffffff;
  margin: 20px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 20px;
}

.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.table th,
.table td {
  text-align: center;
  vertical-align: middle;
  padding: 15px;
  font-size: 1rem;
}

.table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 500;
  border-bottom: 2px solid #dee2e6;
}

.table td {
  background-color: #fdfdfd;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.3s ease;
}

.table td:hover {
  background-color: #f1f1f1;
}

.pagination {
  margin-top: 20px;
}


.page-link {
  color: green;
  border: 1px solid green;
  border-radius: 5px;
  padding: 8px 16px;
  font-size: 1rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.page-link:hover {
  background-color: green;
  color: #fff;
}

.page-item.disabled .page-link {
  color: #6c757d;
  border-color: #6c757d;
}

.page-item.active .page-link {
  background-color: green;
  color: #fff;
  border-color: green;
}

  </style>
  