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
          <h4>Danh sách hàng hóa</h4>
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
                <th scope="col">Hình ảnh</th>
                <th scope="col">Mã mặt hàng</th>
                <th scope="col">Loại mặt hàng</th>
                <th scope="col">Tên mặt hàng</th>
                <th scope="col">Đơn vị tính</th>
                <th scope="col">Đơn giá</th>
                <th scope="col">Nhà cung cấp</th>
                <th scope="col">Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in paginatedProducts" :key="product.id">
                <td>{{ index + 1 }}</td>
                <td><img :src="product.imageUrl" alt="Product Image" width="50" /></td>
                <td>{{ product.code }}</td>
                <td>{{ product.category }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.unit }}</td>
                <td>{{ product.price | currency }}</td>
                <td>{{ product.supplier }}</td>
                <td>
                  <button type="button" class="btn btn-success btn-sm" @click="openEditModal(product)">Chỉnh sửa</button>
                  <button type="button" class="btn btn-danger btn-sm ml-2" @click="deleteProduct(product.id)">Xóa</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Add Product Modal -->
      <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;" aria-labelledby="addProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="addProductModalLabel">Thêm mới mặt hàng</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeAddModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addProduct">
                <div class="mb-3">
                  <label for="newProductName" class="form-label">Tên loại hàng</label>
                  <input type="text" class="form-control" id="newProductName" v-model="newProduct.name" required />
                </div>
                <div class="mb-3">
                  <label for="newProductCode" class="form-label">Mã mặt hàng</label>
                  <input type="text" class="form-control" id="newProductCode" v-model="newProduct.code" required />
                </div>
                <div class="mb-3">
                  <label for="newProductCategory" class="form-label">Loại mặt hàng</label>
                  <input type="text" class="form-control" id="newProductCategory" v-model="newProduct.category" required />
                </div>
                <div class="mb-3">
                  <label for="newProductSupplier" class="form-label">Nhà cung cấp</label>
                  <input type="text" class="form-control" id="newProductSupplier" v-model="newProduct.supplier" required />
                </div>
                <div class="mb-3">
                  <label for="newProductPrice" class="form-label">Đơn giá</label>
                  <input type="number" class="form-control" id="newProductPrice" v-model="newProduct.price" required />
                </div>
                <div class="mb-3">
                  <label for="newProductUnit" class="form-label">Đơn vị tính</label>
                  <input type="text" class="form-control" id="newProductUnit" v-model="newProduct.unit" required />
                </div>
                <div class="mb-3">
                  <label for="newProductImage" class="form-label">Ảnh sản phẩm</label>
                  <input type="file" class="form-control" id="newProductImage" @change="handleImageUpload" />
                </div>
                <button type="submit" class="btn btn-primary">Thêm mới</button>
                <button type="button" class="btn btn-secondary" @click="closeAddModal">Hủy</button>
              </form>
            </div>
          </div>
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
                  <label for="editProductName" class="form-label">Tên loại hàng</label>
                  <input type="text" class="form-control" id="editProductName" v-model="editProduct.name" required />
                </div>
                <div class="mb-3">
                  <label for="editProductCode" class="form-label">Mã mặt hàng</label>
                  <input type="text" class="form-control" id="editProductCode" v-model="editProduct.code" required />
                </div>
                <div class="mb-3">
                  <label for="editProductCategory" class="form-label">Loại mặt hàng</label>
                  <input type="text" class="form-control" id="editProductCategory" v-model="editProduct.category" required />
                </div>
                <div class="mb-3">
                  <label for="editProductSupplier" class="form-label">Nhà cung cấp</label>
                  <input type="text" class="form-control" id="editProductSupplier" v-model="editProduct.supplier" required />
                </div>
                <div class="mb-3">
                  <label for="editProductPrice" class="form-label">Đơn giá</label>
                  <input type="number" class="form-control" id="editProductPrice" v-model="editProduct.price" required />
                </div>
                <div class="mb-3">
                  <label for="editProductUnit" class="form-label">Đơn vị tính</label>
                  <input type="text" class="form-control" id="editProductUnit" v-model="editProduct.unit" required />
                </div>
                <div class="mb-3">
                  <label for="editProductImage" class="form-label">Ảnh sản phẩm</label>
                  <input type="file" class="form-control" id="editProductImage" @change="handleImageUploadForEdit" />
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
        isLoading: false,
        products: [],
        currentPage: 0,
        itemsPerPage: 5,
        searchQuery: "",
        showAddModal: false,
        showEditModal: false,
        newProduct: {
          name: "",
          code: "",
          category: "",
          supplier: "",
          price: "",
          unit: "",
          imageUrl: ""
        },
        editProduct: {
          id: "",
          name: "",
          code: "",
          category: "",
          supplier: "",
          price: "",
          unit: "",
          imageUrl: ""
        }
      };
    },
    computed: {
      filteredProducts() {
        return this.products.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      },
      paginatedProducts() {
        const start = this.currentPage * this.itemsPerPage;
        return this.filteredProducts.slice(start, start + this.itemsPerPage);
      },
      totalPages() {
        return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
      }
    },
    methods: {
      fetchProducts() {
        this.isLoading = true;
        setTimeout(() => {
          this.products = [
            { id: 1, name: 'Shoe A', code: '001', category: 'Men', supplier: 'Supplier 1', price: 100, unit: 'Pair', imageUrl: 'https://via.placeholder.com/50' },
            { id: 2, name: 'Shoe B', code: '002', category: 'Women', supplier: 'Supplier 2', price: 150, unit: 'Pair', imageUrl: 'https://via.placeholder.com/50' },
            { id: 3, name: 'Shoe C', code: '003', category: 'Kids', supplier: 'Supplier 3', price: 80, unit: 'Pair', imageUrl: 'https://via.placeholder.com/50' },
            // Add more products here
          ];
          this.isLoading = false;
        }, 1000);
      },
      addProduct() {
        // Logic to add new product
        console.log('Adding product', this.newProduct);
        this.products.push({
          id: this.products.length + 1,
          ...this.newProduct,
        });
        this.closeAddModal();
      },
      openAddModal() {
        this.newProduct = {
          name: "",
          code: "",
          category: "",
          supplier: "",
          price: "",
          unit: "",
          imageUrl: ""
        };
        this.showAddModal = true;
      },
      closeAddModal() {
        this.showAddModal = false;
      },
      openEditModal(product) {
        this.editProduct = { ...product };
        this.showEditModal = true;
      },
      closeEditModal() {
        this.showEditModal = false;
      },
      updateProduct() {
        // Logic to update product
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
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.newProduct.imageUrl = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      handleImageUploadForEdit(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.editProduct.imageUrl = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      },
      prevPage() {
        if (this.currentPage > 0) this.currentPage--;
      },
      nextPage() {
        if (this.currentPage < this.totalPages - 1) this.currentPage++;
      },
      goToPage(page) {
        this.currentPage = page;
      }
    },
    mounted() {
      this.fetchProducts();
    }
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  .search-input {
    padding: 10px;
  }
  .btn-add-product {
    margin-left: 20px;
  }
  .pagination {
    margin-top: 20px;
  }
  .pagination .page-item .page-link {
    padding: 8px 16px;
  }
  </style>
  