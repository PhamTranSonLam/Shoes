<template>
    <div class="container mt-5">
      <!-- Search Input -->
      <div class="row mb-4">
        <div class="col-md-10">
          <input type="text" class="form-control search-input" placeholder="Tìm kiếm sản phẩm" v-model="searchQuery" />
        </div>
      </div>
  
      <!-- Product Management Table -->
      <div class="card">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h4>Danh sách loại hàng</h4>
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
                <th scope="col">Tên loại hàng</th>
                <th scope="col">Mô tả</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in paginatedProducts" :key="product.id">
                <td>{{ index + 1 }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.description }}</td>
                <td>
                  <button type="button" class="btn btn-success btn-sm" @click="openEditModal(product)">Chỉnh sửa</button>
                  <button type="button" class="btn btn-danger btn-sm ml-2" @click="deleteProduct(product.id)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Edit Product Modal -->
      <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="editProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="editProductModalLabel">Chỉnh sửa sản phẩm</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeEditModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="updateProduct">
                <div class="mb-3">
                  <label for="productName" class="form-label">Tên loại hàng</label>
                  <input type="text" class="form-control" id="productName" v-model="editProduct.name" required />
                </div>
                <div class="mb-3">
                  <label for="productDescription" class="form-label">Mô tả</label>
                  <textarea class="form-control" id="productDescription" v-model="editProduct.description" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Cập nhật</button>
                <button type="button" class="btn btn-secondary" @click="closeEditModal">Hủy</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Add Product Modal -->
      <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addProductModalLabel">Thêm mới sản phẩm</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeAddModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addProduct">
                <div class="mb-3">
                  <label for="newProductName" class="form-label">Tên loại hàng</label>
                  <input type="text" class="form-control" id="newProductName" v-model="newProduct.name" required />
                </div>
                <div class="mb-3">
                  <label for="newProductDescription" class="form-label">Mô tả</label>
                  <textarea class="form-control" id="newProductDescription" v-model="newProduct.description" rows="3" required></textarea>
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
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page - 1 }">
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
        products: [],
        isLoading: false,
        searchQuery: '',
        currentPage: 0,
        pageSize: 5,
        showEditModal: false,
        showAddModal: false,
        editProduct: { name: '', description: '' },
        newProduct: { name: '', description: '' } // Dữ liệu cho sản phẩm mới
      };
    },
    computed: {
      filteredProducts() {
        return this.products.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.pageSize);
      },
      paginatedProducts() {
        const start = this.currentPage * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredProducts.slice(start, end);
      }
    },
    methods: {
      fetchProducts() {
        this.isLoading = true;
        setTimeout(() => {
          this.products = [
            { id: 1, name: 'Sản phẩm 1', description: 'Mô tả sản phẩm 1' },
            { id: 2, name: 'Sản phẩm 2', description: 'Mô tả sản phẩm 2' },
            { id: 3, name: 'Sản phẩm 3', description: 'Mô tả sản phẩm 3' },
            { id: 4, name: 'Sản phẩm 4', description: 'Mô tả sản phẩm 4' },
            { id: 5, name: 'Sản phẩm 5', description: 'Mô tả sản phẩm 5' }
          ];
          this.isLoading = false;
        }, 1000);
      },
      prevPage() {
        if (this.currentPage > 0) {
          this.currentPage--;
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages - 1) {
          this.currentPage++;
        }
      },
      goToPage(page) {
        this.currentPage = page;
      },
      openEditModal(product) {
        this.editProduct = { ...product };
        this.showEditModal = true;
      },
      closeEditModal() {
        this.showEditModal = false;
        this.editProduct = { name: '', description: '' };
      },
      updateProduct() {
        const index = this.products.findIndex(product => product.id === this.editProduct.id);
        if (index !== -1) {
          this.products[index] = { ...this.editProduct };
        }
        this.closeEditModal();
      },
      deleteProduct(id) {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
          this.products.splice(index, 1);
        }
      },
      openAddModal() {
        this.showAddModal = true;
      },
      closeAddModal() {
        this.showAddModal = false;
        this.newProduct = { name: '', description: '' };
      },
      addProduct() {
        const newProduct = { ...this.newProduct, id: this.products.length + 1 };
        this.products.push(newProduct);
        this.closeAddModal();
      }
    },
    mounted() {
      this.fetchProducts();
    }
  };
  </script>
  
  <style scoped>
  .search-input {
    width: 100%;
  }
  
  .card {
    border-radius: 10px;
  }
  
  .card-header {
    background-color: #f8f9fa;
  }
  
  .card-body {
    background-color: #ffffff;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
  }
  
  .pagination .page-link {
    padding: 8px 16px;
    font-size: 14px;
    background-color: #ffffff;
  }
  
  .modal-dialog {
    max-width: 500px;
  }
  
  .modal-header {
    background-color: #f8f9fa;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-footer {
    padding: 10px;
  }
  </style>
  