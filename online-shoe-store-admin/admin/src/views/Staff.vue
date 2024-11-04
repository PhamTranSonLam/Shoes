<template>
  <div class="container mt-5">
    <!-- Search Input -->
    <div class="row mb-4">
      <div class="col-md-10">
        <input
          v-model="searchTerm"
          @input="filterUsers"
          type="text"
          class="form-control search-input"
          placeholder="Tìm kiếm nhân viên"
        />
      </div>
    </div>
    <!-- Staff Table -->
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Nhân viên</h4>
        <router-link to="/Addstaff" class="btn btn-add">
          Thêm nhân viên
        </router-link>
      </div>
      <div class="card-body p-0">
        <table class="table table-hover text-center">
          <thead class="table-header">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên</th>
              <th scope="col">Email</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(admin, index) in paginatedUsers" :key="admin._id">
              <td>{{ index + 1 + (currentPage - 1) * itemsPerPage }}</td>
              <td>{{ admin.username }}</td>
              <td>{{ admin.email }}</td>
              <td>{{ admin.address }}</td>
              <td>{{ admin.phone }}</td>
              <td>
                <router-link :to="`/editstaff/${admin._id}`" class="btn btn-edit btn-sm">Chỉnh sửa</router-link>
                <button @click="deleteUseradmin(admin._id)" class="btn btn-delete btn-sm">Xóa</button>
              </td>
            </tr>
            <tr v-if="paginatedUsers.length === 0">
              <td colspan="6" class="text-center">Không tìm thấy nhân viên nào.</td>
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
      users: [],
      searchTerm: '',
      filteredUsers: [],
      currentPage: 1,
      itemsPerPage: 5
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredUsers.slice(start, end);
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:5000/api/authadmin');
        this.users = response.data;
        this.filteredUsers = this.users;
      } catch (error) {
        console.error('Lỗi khi lấy danh sách nhân viên:', error);
      }
    },
    filterUsers() {
      if (this.searchTerm) {
        this.filteredUsers = this.users.filter(admin =>
          admin.username.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredUsers = this.users;
      }
      this.currentPage = 1; // Reset to page 1 after search
    },
    async deleteUseradmin(userId) {
      if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/authadmin/${userId}`);
          this.fetchUsers();  // Refresh the list after deletion
        } catch (error) {
          console.error('Lỗi khi xóa nhân viên:', error);
        }
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  },
  created() {
    this.fetchUsers();
  }
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
  width: 30%;
  border: 2px solid #ddd;
  border-radius: 30px; /* Rounded corners */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  transition: all 0.3s ease; /* Smooth transitions */
  background-color: #f8f9fa;
}

/* Search bar hover and focus effects */
.search-input:hover,
.search-input:focus {
  border-color: #00796b;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15); /* Deeper shadow */
  outline: none; /* Removes default outline */
  background-color: #ffffff; /* Subtle background change on focus */
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
  .table th,
  .table td {
    padding: 10px;
  }

  .btn {
    font-size: 0.75rem;
  }
}
</style>
