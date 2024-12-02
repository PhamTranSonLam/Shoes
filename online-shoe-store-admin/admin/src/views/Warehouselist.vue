<template>
  <div class="danhsachkho mt-5">
    <!-- Search Input -->
    <div class="row mb-4">
      <div class="col-md-10">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Tìm kiếm kho"
          v-model="searchQuery"
        />
      </div>
    </div>

    <!-- Warehouse Management Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="text-white">Danh sách kho</h4>
        <button class="btn btn-primary btn-add-product" @click="openAddModal">
          Thêm mới
        </button>
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center">
          <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Table of Warehouses -->
        <table v-else class="table text-center">
          <thead class="table-header">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên kho</th>
              <th scope="col">Tên phiếu nhập</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(warehouse, index) in paginatedWarehouses" :key="warehouse._id">
              <td>{{ index + 1 }}</td>
              <td>{{ warehouse.warehouse }}</td>
              <td>{{ warehouse.name }}</td>
              <td>
                <button
                  type="button"
                  class="btn btn-success btn-sm"
                  @click="openEditModal(warehouse)"
                >
                  Chỉnh sửa
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm ms-2"
                  @click="deleteWarehouse(warehouse._id)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal components for Edit and Add -->
    <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="editWarehouseModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editWarehouseModalLabel">Chỉnh sửa kho</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateWarehouse">
              <div class="mb-3">
                <label for="editWarehouseName" class="form-label">Tên kho</label>
                <input
                  type="text"
                  id="editWarehouseName"
                  class="form-control"
                  v-model="selectedWarehouse.warehouse"
                />
              </div>
              <div class="mb-3">
                <label for="editWarehouseDescription" class="form-label">Tên phiếu nhập</label>
                <input
                  type="text"
                  id="editWarehouseDescription"
                  class="form-control"
                  v-model="selectedWarehouse.name"
                />
              </div>
              <button type="submit" class="btn btn-primary">Cập nhật</button>
              <button type="button" class="btn btn-secondary" @click="closeEditModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="addWarehouseModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addWarehouseModalLabel">Thêm kho</h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addWarehouse">
              <div class="mb-3">
                <label for="newWarehouseName" class="form-label">Tên kho</label>
                <input
                  type="text"
                  id="newWarehouseName"
                  class="form-control"
                  v-model="newWarehouse.warehouse"
                />
              </div>
              <div class="mb-3">
                <label for="newWarehouseDescription" class="form-label">Tên phiếu nhập</label>
                <input
                  type="text"
                  id="newWarehouseDescription"
                  class="form-control"
                  v-model="newWarehouse.name"
                />
              </div>
              <button type="submit" class="btn btn-primary">Thêm mới</button>
              <button type="button" class="btn btn-secondary" @click="closeAddModal">Hủy</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 0 }">
          <button class="page-link" @click="prevPage">Trước</button>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page - 1 }"
        >
          <button class="page-link" @click="goToPage(page - 1)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages - 1 }">
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
      isLoading: false,
      searchQuery: '',
      currentPage: 0,
      totalPages: 1,
      warehouses: [],
      paginatedWarehouses: [],
      newWarehouse: { warehouse: '', name: '' },
      selectedWarehouse: null,
      showAddModal: false,
      showEditModal: false,
    };
  },
  methods: {
    fetchWarehouses() {
      this.isLoading = true;
      axios
        .get('http://localhost:5000/api/warehouse')
        .then((response) => {
          this.warehouses = response.data;
          this.filteredWarehouses = this.warehouses;
          this.calculateTotalPages();
        })
        .catch((error) => console.error('Lỗi khi tải kho:', error))
        .finally(() => (this.isLoading = false));
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    addWarehouse() {
      axios
        .post('http://localhost:5000/api/warehouse', this.newWarehouse)
        .then(() => this.fetchWarehouses())
        .catch((error) => console.error('Lỗi khi thêm kho:', error));
      this.closeAddModal();
    },
    openEditModal(warehouse) {
      this.selectedWarehouse = { ...warehouse };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    updateWarehouse() {
      axios
        .put(`http://localhost:5000/api/warehouse/${this.selectedWarehouse._id}`, this.selectedWarehouse)
        .then(() => this.fetchWarehouses())
        .catch((error) => console.error('Lỗi khi cập nhật kho:', error));
      this.closeEditModal();
    },
    deleteWarehouse(id) {
      axios
        .delete(`http://localhost:5000/api/warehouse/${id}`)
        .then(() => this.fetchWarehouses())
        .catch((error) => console.error('Lỗi khi xóa kho:', error));
    },
    calculateTotalPages() {
      this.totalPages = Math.ceil(this.filteredWarehouses.length / 10);
      this.paginateWarehouses();
    },
    paginateWarehouses() {
      const startIndex = this.currentPage * 10;
      const endIndex = startIndex + 10;
      this.paginatedWarehouses = this.filteredWarehouses.slice(startIndex, endIndex);
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage -= 1;
        this.paginateWarehouses();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) {
        this.currentPage += 1;
        this.paginateWarehouses();
      }
    },
    goToPage(page) {
      this.currentPage = page;
      this.paginateWarehouses();
    },
  },
  watch: {
    searchQuery(newQuery) {
      this.filteredWarehouses = this.warehouses.filter((warehouse) => {
        return warehouse.warehouse.toLowerCase().includes(newQuery.toLowerCase()) || 
               warehouse.name.toLowerCase().includes(newQuery.toLowerCase());
      });
      this.calculateTotalPages();
    },
  },
  mounted() {
    this.fetchWarehouses();
  },
};
</script>

<style scoped>
.danhsachkho {
  max-width: 1200px;
  margin: 0 auto;
}

.search-input {
  border-radius: 50px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  width: 30%;
}

.card-header {
  background-color: #28a745;;
  color: white;
}

.btn-add-product {
  border-radius: 50px;
}

.table-header {
  background-color: #f0f0f0;
  font-weight: bold;
}

.table th,
.table td {
  vertical-align: middle;
}

.pagination .page-item .page-link {
  border-radius: 25px;
}

.modal-content {
  border-radius: 8px;
}

.form-control {
  border-radius: 10px;
}

.card-body {
  background-color: #f9f9f9;
}

.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.page-link {
  background-color: #f0f0f0;
  color: #333;
}

.page-item.active .page-link {
  background-color: #1a73e8;
  color: white;
}

.page-item.disabled .page-link {
  background-color: #ddd;
  cursor: not-allowed;
}

.btn-close {
  background: transparent;
  border: none;
}

@media (max-width: 768px) {
  .pagination {
    font-size: 14px;
  }
}
</style>
