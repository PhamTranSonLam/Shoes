<template>
  <div class="phieubnhap mt-5">
    <!-- Search Input -->
    <div class="row mb-4">
      <div class="col-md-10">
        <input
          type="text"
          class="form-control search-input"
          placeholder="Tìm kiếm phiếu nhập"
          v-model="searchQuery"
        />
      </div>
    </div>

    <!-- Product Management Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4>Danh sách phiếu nhập</h4>
        <button class="btn btn-primary btn-add-product" @click="openAddModal">
          Thêm mới
        </button>
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center">
          <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Table of Products -->
        <table v-else class="table text-center">
          <thead class="table-warning text-success">
            <tr>
              <th>STT</th>
              <th>Mã phiếu nhập</th>
              <th>Tên phiếu nhập</th>
              <th>Ngày nhập</th>
              <th>Kho</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in filteredProducts" :key="product._id">
              <td>{{ index + 1 }}</td>
              <td>{{ product._id }}</td>
              <td>{{ product.name }}</td>
              <td>{{ new Date(product.date).toLocaleDateString() }}</td>
              <td>{{ product.warehouse }}</td>
              <td>
                <button
                  type="button"
                  class="btn btn-success btn-sm"
                  @click="openEditModal(product)"
                >
                  Chỉnh sửa
                </button>
                <button
                  type="button"
                  class="btn btn-danger btn-sm ms-2"
                  @click="deleteProduct(product._id)"
                >
                  Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal for Editing -->
    <div
      v-if="showEditModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block;"
      aria-labelledby="editProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editProductModalLabel">Chỉnh sửa phiếu nhập</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="closeEditModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProduct">
              <div class="mb-3">
                <label for="editWarehouse" class="form-label">Kho</label>
                <input
                  type="text"
                  id="editWarehouse"
                  class="form-control"
                  v-model="selectedProduct.warehouse"
                />
              </div>
              <div class="mb-3">
                <label for="editName" class="form-label">Tên phiếu nhập</label>
                <input
                  type="text"
                  id="editName"
                  class="form-control"
                  v-model="selectedProduct.name"
                />
              </div>
              <button type="submit" class="btn btn-primary">Cập nhật</button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeEditModal"
              >
                Hủy
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Add New Product Modal -->
    <div
      v-if="showAddModal"
      class="modal fade show"
      tabindex="-1"
      style="display: block;"
      aria-labelledby="addProductModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="addProductModalLabel">Thêm phiếu nhập</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="closeAddModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addProduct">
              <div class="mb-3">
                <label for="newWarehouse" class="form-label">Kho</label>
                <input
                  type="text"
                  id="newWarehouse"
                  class="form-control"
                  v-model="newProduct.warehouse"
                />
              </div>
              <div class="mb-3">
                <label for="newName" class="form-label">Tên phiếu nhập</label>
                <input
                  type="text"
                  id="newName"
                  class="form-control"
                  v-model="newProduct.name"
                />
              </div>
              <button type="submit" class="btn btn-primary">Thêm mới</button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeAddModal"
              >
                Hủy
              </button>
            </form>
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
      products: [],
      searchQuery: '',
      isLoading: true,
      selectedProduct: {},
      newProduct: {
        name: '',
        warehouse: '',
      },
      showEditModal: false,
      showAddModal: false,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/warehouse');
        this.products = response.data;
        this.isLoading = false;
      } catch (error) {
        console.error('Error fetching warehouse data:', error);
      }
    },
    openEditModal(product) {
      this.selectedProduct = { ...product };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    async addProduct() {
      try {
        const response = await axios.post('http://localhost:5000/api/warehouse', {
          name: this.newProduct.name,
          warehouse: this.newProduct.warehouse,
        });
        this.products.push(response.data);
        this.closeAddModal();
      } catch (error) {
        console.error('Error adding warehouse:', error);
      }
    },
    async updateProduct() {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/warehouse/${this.selectedProduct._id}`,
          {
            name: this.selectedProduct.name,
            warehouse: this.selectedProduct.warehouse,
          }
        );
        const index = this.products.findIndex(
          product => product._id === this.selectedProduct._id
        );
        this.products.splice(index, 1, response.data);
        this.closeEditModal();
      } catch (error) {
        console.error('Error updating warehouse:', error);
      }
    },
    async deleteProduct(id) {
      try {
        await axios.delete(`http://localhost:5000/api/warehouse/${id}`);
        this.products = this.products.filter(product => product._id !== id);
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
/* Container Styling */
.phieubnhap {
  margin: 2rem;
  font-family: 'Roboto', sans-serif;
}

/* Search Input Styling */
.search-input {
  border: 2px solid #e0e0e0;
  width: 30%;
  border-radius: 50px;
  padding: 0.8rem;
  transition: border-color 0.3s;
  background-color: #f9f9f9;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

/* Card Styling */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Card Header */
.card-header {
  background-color: #28a745;
  color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 1.2rem;
  font-size: 1.2rem;
}

/* Card Body */
.card-body {
  padding: 1.5rem;
}

/* Table Styling */
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.table th,
.table td {
  padding: 1rem;
  border: 1px solid #ddd;
}

.table th {
  background-color: #f8f9fa;
}

.table-warning {
  background-color: #f1f1f1;
}

.table .btn {
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

.btn-add-product {
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
}

.btn-add-product:hover {
  background-color: #28a745;;
  transition: background-color 0.3s;
}

/* Modal Styling */
.modal-content {
  border-radius: 12px;
  padding: 1.5rem;
}

.modal-header {
  background-color: #28a745;;
  color: #fff;
  font-size: 1.5rem;
}

.modal-body {
  padding: 2rem;
}

.modal-body .form-label {
  font-weight: bold;
}

.form-control {
  border-radius: 8px;
  padding: 0.8rem;
  border: 2px solid #ddd;
  transition: border-color 0.3s;
}

.form-control:focus {
  background-color: #e6f0e8;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

.btn-secondary {
  background-color: #6c757d;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
