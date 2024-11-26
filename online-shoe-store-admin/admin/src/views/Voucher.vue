<template>
  <div class="container mt-5">
    <!-- Search Input -->
    <div class="row mb-4">
      <div class="col-md-10">
        <input v-model="searchTerm" @input="filterVouchers" type="text" class="form-control search-input" placeholder="Tìm kiếm voucher" />
      </div>
    </div>

    <!-- Voucher Table -->
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Phiếu Voucher</h4>
        <router-link to="/AddVoucher" class="btn btn-add">Thêm Voucher</router-link>
      </div>
      <div class="card-body p-0">
        <table class="table table-hover text-center">
          <thead class="table-header">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Mã</th>
              <th scope="col">Cách thức giảm giá</th>
              <th scope="col">Giá trị giảm</th>
              <th scope="col">Giá trị đơn hàng tối thiểu</th>
              <th scope="col">Thời gian bắt đầu</th>
              <th scope="col">Thời gian kết thúc</th>
              <th scope="col">Giới hạn lần sử dụng</th>
              <th scope="col">Số lần đã sử dụng</th> <!-- New column for usage count -->
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredVouchers.length > 0" v-for="(voucher, index) in paginatedVouchers" :key="voucher._id">
              <td>{{ index + 1 + (currentPage - 1) * vouchersPerPage }}</td>
              <td>{{ voucher.code }}</td>
              <td>{{ voucher.discountType === 'percent' ? 'Phần trăm' : 'Số tiền cố định' }}</td>
              <td>{{ voucher.discountValue }}{{ voucher.discountType === 'percent' ? '%' : ' VNĐ' }}</td>
              <td>{{ voucher.minOrderValue }} VNĐ</td>
              <td>{{ formatDate(voucher.startDate) }}</td>
              <td>{{ formatDate(voucher.endDate) }}</td>
              <td>{{ voucher.usageLimit }}</td>
              <td>{{ voucher.timesUsed }}</td> <!-- Display times used -->
              <td class="d-flex">
                <router-link :to="`/editvoucher/${voucher.code}`" class="btn btn-edit btn-sm">Chỉnh sửa</router-link>
                <button @click="deleteVoucher(voucher._id, index)" class="btn btn-delete btn-sm">Xóa</button>
              </td>
            </tr>
            <tr v-else>
              <td colspan="10" class="text-center">Không tìm thấy voucher nào!</td> <!-- Updated colspan to 10 -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination Controls -->
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
import axios from 'axios';

export default {
  data() {
    return {
      searchTerm: '',
      vouchers: [],
      currentPage: 1,
      vouchersPerPage: 10,
    };
  },
  computed: {
    filteredVouchers() {
      return this.vouchers.filter((voucher) =>
        voucher.code.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredVouchers.length / this.vouchersPerPage);
    },
    paginatedVouchers() {
      const start = (this.currentPage - 1) * this.vouchersPerPage;
      const end = start + this.vouchersPerPage;
      return this.filteredVouchers.slice(start, end);
    },
  },
  mounted() {
    this.getAllVoucher();
  },
  methods: {
    async getAllVoucher() {
      try {
        const response = await axios.get('http://localhost:5000/api/voucher');
        this.vouchers = response.data;
      } catch (error) {
        console.error('Error fetching voucher list:', error);
      }
    },
    async deleteVoucher(id, index) {
      if (confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/voucher/delete/${id}`);
          this.vouchers.splice(index, 1);
          alert('Voucher đã bị xóa thành công');
        } catch (error) {
          console.error('Error deleting voucher:', error);
          alert('Đã có lỗi xảy ra khi xóa voucher');
        }
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('vi-VN', options);
    },
    filterVouchers() {
      this.currentPage = 1; // Reset page to 1 when filtering
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
};
</script>
<style scoped>
/* Container Styling */
.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Search bar container */
.search-input {
  padding: 10px 20px;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  border: 2px solid #ddd;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background-color: #f8f9fa;
}

/* Search bar hover and focus effects */
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

.card-header {
  background-color: #f8f9fa;
  color: #333;
  padding: 15px;
  font-size: 1.25rem;
  border-bottom: 2px solid #28a745;
}

.card-body {
  padding: 0;
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

/* Buttons */
.btn {
  font-size: 0.875rem;
  padding: 8px 12px;
  border-radius: 8px;
}

.btn-add {
  background-color: #28a745;
  border-color: #28a745;
  font-weight: bold;
  color: white;
}

.btn-add:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-edit {
  background-color: #ffc107;
  border-color: #ffc107;
  color: #fff;
}

.btn-edit:hover {
  background-color: #e0a800;
  border-color: #d39e00;
}

.btn-delete {
  background-color: #dc3545;
  border-color: #dc3545;
  color: #fff;
}

.btn-delete:hover {
  background-color: #c82333;
  border-color: #bd2130;
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

/* Responsive Design */
@media (max-width: 768px) {
  .table {
    font-size: 0.75rem;
  }

  .btn {
    font-size: 0.75rem;
    padding: 6px 8px;
  }
}
</style>
