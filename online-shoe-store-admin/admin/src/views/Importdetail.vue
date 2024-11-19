<template>
    <div class="container mt-5">
      <!-- Search Input -->
      <div class="row mb-4">
        <div class="col-md-10">
          <input
            type="text"
            class="form-control search-input"
            placeholder="Tìm kiếm sản phẩm"
            v-model="searchQuery"
          />
        </div>
      </div>
  
      <!-- Product Management Table -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4>Chi tiết phiếu nhập</h4>
          <button class="btn btn-primary btn-add-product" @click="openAddModal">Thêm mới</button>
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
                <th scope="col">STT</th>
                <th scope="col">Mã chi tiết</th>
                <th scope="col">Mã phiếu nhập kho</th>
                <th scope="col">Tên phiếu nhập</th>
                <th scope="col">Tên mặt hàng</th>
                <th scope="col">Đơn vị tính</th>
                <th scope="col">Ngày nhập</th>
                <th scope="col">Đơn giá</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Vị trí</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in paginatedProducts" :key="product.id">
                <td>{{ index + 1 + currentPage * itemsPerPage }}</td>
                <td>{{ product.id }}</td>
                <td>{{ product.code }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.category }}</td>
                <td>{{ product.unit }}</td>
                <td>{{ product.supplier }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.quantity }}</td>
                <td>{{ product.location }}</td>
                <td>
                  <button class="btn btn-success btn-sm" @click="openEditModal(product)">Chỉnh sửa</button>
                  <button class="btn btn-danger btn-sm ml-2" @click="deleteProduct(product.id)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Add Product Modal -->
      <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Thêm phiếu nhập</h5>
              <button type="button" class="btn-close" @click="closeAddModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addProduct">
                <div class="mb-3">
                  <label class="form-label">Tên phiếu nhập</label>
                  <input type="text" v-model="newProduct.name" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Mã phiếu nhập</label>
                  <input type="text" v-model="newProduct.code" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Tên mặt hàng</label>
                  <input type="text" v-model="newProduct.category" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Đơn vị tính</label>
                  <input type="text" v-model="newProduct.unit" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Đơn giá</label>
                  <input type="number" v-model="newProduct.price" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Số lượng</label>
                  <input type="number" v-model="newProduct.quantity" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Vị trí</label>
                  <input type="text" v-model="newProduct.location" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary">Thêm mới</button>
                <button type="button" class="btn btn-secondary" @click="closeAddModal">Hủy</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Edit Product Modal -->
      <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa phiếu nhập</h5>
              <button type="button" class="btn-close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateProduct">
                <div class="mb-3">
                  <label class="form-label">Tên phiếu nhập</label>
                  <input type="text" v-model="editProduct.name" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Mã phiếu nhập</label>
                  <input type="text" v-model="editProduct.code" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Tên mặt hàng</label>
                  <input type="text" v-model="editProduct.category" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Đơn vị tính</label>
                  <input type="text" v-model="editProduct.unit" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Đơn giá</label>
                  <input type="number" v-model="editProduct.price" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Số lượng</label>
                  <input type="number" v-model="editProduct.quantity" class="form-control" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Vị trí</label>
                  <input type="text" v-model="editProduct.location" class="form-control" required />
                </div>
                <button type="submit" class="btn btn-primary">Cập nhật</button>
                <button type="button" class="btn btn-secondary" @click="closeEditModal">Hủy</button>
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
            <button class="page-link" @click="goToPage(page - 1)">{{ page }}</button>
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
        products: [
          { id: 1, code: "001", name: "Phiếu nhập A", category: "Sản phẩm 1", unit: "Cái", supplier: "Nhà cung cấp 1", price: 100000, quantity: 50, location: "Kho A" },
          { id: 2, code: "002", name: "Phiếu nhập B", category: "Sản phẩm 2", unit: "Cái", supplier: "Nhà cung cấp 2", price: 200000, quantity: 30, location: "Kho B" },
          { id: 3, code: "003", name: "Phiếu nhập C", category: "Sản phẩm 3", unit: "Cái", supplier: "Nhà cung cấp 3", price: 150000, quantity: 20, location: "Kho C" },
        ],
        searchQuery: "",
        currentPage: 0,
        itemsPerPage: 5,
        totalPages: 1,
        showAddModal: false,
        newProduct: {
          name: "",
          code: "",
          category: "",
          unit: "",
          price: "",
          quantity: "",
          location: "",
        },
        showEditModal: false,
        editProduct: {},
      };
    },
    computed: {
      filteredProducts() {
        return this.products.filter(product => product.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
      },
      paginatedProducts() {
        const startIndex = this.currentPage * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredProducts.slice(startIndex, endIndex);
      },
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      },
    },
    methods: {
      openAddModal() {
        this.showAddModal = true;
      },
      closeAddModal() {
        this.showAddModal = false;
        this.newProduct = {
          name: "",
          code: "",
          category: "",
          unit: "",
          price: "",
          quantity: "",
          location: "",
        };
      },
      addProduct() {
        // Here, you can add the logic to simulate adding the product to the products list
        const newProduct = { ...this.newProduct, id: this.products.length + 1 };
        this.products.push(newProduct);
        this.closeAddModal();
      },
      openEditModal(product) {
        this.editProduct = { ...product };
        this.showEditModal = true;
      },
      closeEditModal() {
        this.showEditModal = false;
        this.editProduct = {};
      },
      updateProduct() {
        // Here, you can add the logic to simulate updating the product
        const index = this.products.findIndex(product => product.id === this.editProduct.id);
        if (index !== -1) {
          this.products.splice(index, 1, this.editProduct);
        }
        this.closeEditModal();
      },
      deleteProduct(productId) {
        // Here, you can add the logic to simulate deleting the product
        this.products = this.products.filter(product => product.id !== productId);
      },
      prevPage() {
        if (this.currentPage > 0) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages - 1) this.currentPage++;
      },
      goToPage(page) {
        this.currentPage = page;
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  
  .search-input {
    border-radius: 50px;
  }
  
  .btn-add-product {
    border-radius: 50px;
  }
  
  .modal-content {
    border-radius: 15px;
  }
  
  .pagination .page-link {
    border-radius: 50px;
  }
  </style>
  