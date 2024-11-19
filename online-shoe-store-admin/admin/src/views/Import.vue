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
                <th>Ảnh hóa đơn</th>
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
                <td>
                  <img
                    src="https://via.placeholder.com/100"
                    alt="Ảnh hóa đơn"
                    class="img-thumbnail"
                  />
                </td>
                <td>{{ product.code }}</td>
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
                    @click="deleteProduct(product.id)"
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
  export default {
    data() {
      return {
        isLoading: false,
        searchQuery: "",
        currentPage: 0,
        totalPages: 3,
        products: [
          { id: 1, code: "PN001", name: "Phiếu nhập 1", date: "2024-11-19", warehouse: "Kho A" },
          { id: 2, code: "PN002", name: "Phiếu nhập 2", date: "2024-11-18", warehouse: "Kho B" },
        ],
        filteredProducts: [],
        newProduct: { warehouse: "", name: "" },
        selectedProduct: null,
        showAddModal: false,
        showEditModal: false,
      };
    },
    methods: {
      openAddModal() {
        this.showAddModal = true;
      },
      closeAddModal() {
        this.showAddModal = false;
      },
      addProduct() {
        this.products.push({
          id: Date.now(),
          ...this.newProduct,
          date: new Date().toISOString().split("T")[0],
        });
        this.newProduct = { warehouse: "", name: "" };
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
        const index = this.products.findIndex(
          (product) => product.id === this.selectedProduct.id
        );
        if (index !== -1) this.products.splice(index, 1, this.selectedProduct);
        this.closeEditModal();
      },
      deleteProduct(id) {
        this.products = this.products.filter((product) => product.id !== id);
      },
      prevPage() {
        if (this.currentPage > 0) this.currentPage -= 1;
      },
      nextPage() {
        if (this.currentPage < this.totalPages - 1) this.currentPage += 1;
      },
      goToPage(page) {
        this.currentPage = page;
      },
    },
    computed: {
      filteredProducts() {
        return this.products.filter((product) =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
    },
  };
  </script>
  
  <style scoped>
  /* CSS như trước */
  </style>
  