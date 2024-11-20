<template>
    <div class="container mt-5">
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
            <thead class="table-warning">
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