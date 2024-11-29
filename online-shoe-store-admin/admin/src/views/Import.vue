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
              <tr v-for="(product, index) in filteredProducts" :key="product.id">
                <td>{{ index + 1 }}</td>
                <td>{{ product._id }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.date }}</td>
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
  
      <!-- Edit Product Modal -->
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
              <h5 class="modal-title" id="editProductModalLabel">
                Chỉnh sửa phiếu nhập
              </h5>
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
  
      <!-- Add Product Modal -->
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
import axios from "axios";

export default {
  data() {
    return {
      isLoading: false,
      searchQuery: "",
      currentPage: 0,
      totalPages: 3,
      products: [],
      filteredProducts: [],
      newProduct: { warehouse: "", name: "" },
      selectedProduct: null,
      showAddModal: false,
      showEditModal: false,
    };
  },
  methods: {
    fetchWarehouses() {
      this.isLoading = true;
      axios
        .get("http://localhost:5000/api/warehouse")
        .then((response) => {
          this.products = response.data;
          this.filteredProducts = this.products;
        })
        .catch((error) => console.error("Lỗi khi tải phiếu nhập:", error))
        .finally(() => (this.isLoading = false));
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    addProduct() {
      axios
        .post("http://localhost:5000/api/warehouse", this.newProduct)
        .then(() => this.fetchWarehouses())
        .catch((error) => console.error("Lỗi khi thêm phiếu nhập:", error));
      this.closeAddModal();
    },
    openEditModal(product) {
      this.selectedProduct = { ...product };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
    updateProduct() {
      axios
        .put(`http://localhost:5000/api/warehouse/${this.selectedProduct._id}`, this.selectedProduct)
        .then(() => this.fetchWarehouses())
        .catch((error) => console.error("Lỗi khi cập nhật phiếu nhập:", error));
      this.closeEditModal();
    },
    deleteProduct(id) {
      axios
        .delete(`http://localhost:5000/api/warehouse/${id}`)
        .then(() => this.fetchWarehouses())
        .catch((error) => console.error("Lỗi khi xóa phiếu nhập:", error));
    },
  },
  mounted() {
    this.fetchWarehouses();
  },
};
</script>
<style>
/* Container styling */
.phieubnhap {
  margin: 2rem;
  font-family: 'Roboto', sans-serif;
}

/* Search input styling */
.search-input {
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

/* Card styling */
.card {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #007bff;
  color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 1rem;
}

.card-body {
  padding: 1.5rem;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
}

table thead {
  background-color: #f8f9fa;
}

table th,
table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

table tbody tr:hover {
  background-color: #f1f1f1;
}

.table-warning th {
  color: #856404;
  background-color: #fff3cd;
}

/* Button styling */
button {
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: #fff;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}

.btn-success {
  background-color: #28a745;
  color: #fff;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: #fff;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* Pagination styling */
.pagination .page-link {
  color: #007bff;
  border: 1px solid #dee2e6;
  transition: background-color 0.3s, color 0.3s;
}

.pagination .page-link:hover {
  background-color: #007bff;
  color: #fff;
}

.pagination .active .page-link {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
}

/* Modal styling */
.modal-content {
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background-color: #007bff;
  color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.modal-header .btn-close {
  color: #fff;
}

.modal-body input {
  border: 2px solid #ccc;
  border-radius: 8px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  transition: border-color 0.3s;
}

.modal-body input:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
}

</style>