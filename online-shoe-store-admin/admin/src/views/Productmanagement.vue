<template>
  <div class="mt-5 container">
    <!-- Search Input -->
    <div class="row mb-4">
      <div class="col-md-10">
        <input type="text" class="form-control search-input" placeholder="Tìm kiếm sản phẩm" v-model="searchTerm" />
      </div>
    </div>

    <!-- Product Management Table -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4>Quản lý sản phẩm</h4>
        <router-link to="/addproduct" class="btn btn-primary btn-add-product">Thêm sản phẩm</router-link>
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="loading" class="text-center">
          <p>Loading products...</p>
        </div>

        <table v-else class="table text-center">
          <thead class="table-warning">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Danh mục</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Kích thước</th>
              <th scope="col">Đơn giá</th>
              <th scope="col">Tổng Số lượng</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>

          <tbody v-if="paginatedProducts.length > 0">
            <tr v-for="(product, index) in paginatedProducts" :key="product._id">
              <th scope="row">{{ currentPage * itemsPerPage + index + 1 }}</th>
              <td>{{ product.name }}</td>
              <td>{{ product.category }}</td>
              <td>
                <!-- Main Product Image -->
                <div>
                  <img 
                    :src="`http://localhost:5000/${product.mainImage}`" 
                    alt="Main Product Image" 
                    class="img-fluid bg-light" 
                    style="width: 100px;" />
                </div>
                <!-- Small Images -->
                <div class="small-images mt-2">
                  <img 
                    v-for="(smallImage, idx) in product.smallImages" 
                    :key="idx" 
                    :src="`http://localhost:5000/${smallImage}`" 
                    alt="Small Product Image" 
                    class="img-thumbnail" 
                    style="width: 50px; height: 50px; margin-right: 5px;" />
                </div>
              </td>

              <!-- Size and Quantity -->
              <td>
                <span v-if="Array.isArray(product.sizes)">
                  <span v-for="(size, idx) in product.sizes" :key="idx" class="size-container">
                    <span class="size-value">Kích thước: {{ size.size }}</span>
                    <span class="quantity-badge">Số lượng: {{ size.quantity }}</span>
                    <span v-if="idx !== product.sizes.length - 1">, </span>
                  </span>
                </span>
                <span v-else>{{ product.sizes }}</span>
              </td>

              <td>{{ product.price }}</td>

              <!-- Total Quantity -->
              <td>{{ calculateTotalQuantity(product.sizes) }}</td>

              <td class="">
                <router-link :to="`/editproduct/${product._id}`" class="btn btn-success btn-sm">Chỉnh sửa</router-link>
                <button type="button" class="btn btn-danger btn-sm ml-2" @click="deleteProduct(product._id)">Xóa</button>
              </td>
            </tr>
          </tbody>

          <tbody v-else>
            <tr>
              <td colspan="8" class="text-center mt-3">Không tìm thấy sản phẩm nào.</td>
            </tr>
          </tbody>
        </table>
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
import axios from 'axios';

export default {
  data() {
    return {
      products: [],
      currentPage: 0,
      itemsPerPage: 5,
      searchTerm: '',
      loading: true,
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
    paginatedProducts() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/product');
        this.products = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.loading = false;
      }
    },

    calculateTotalQuantity(sizes) {
      if (Array.isArray(sizes)) {
        return sizes.reduce((total, size) => total + size.quantity, 0);
      }
      return 0;
    },

    async deleteProduct(productId) {
      if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
          const response = await axios.delete(`http://localhost:5000/api/product/${productId}`);
          if (response.status === 200) {
            alert('Sản phẩm đã được xóa thành công!');
            this.products = this.products.filter(product => product._id !== productId);
          }
        } catch (error) {
          console.log('Lỗi khi xóa sản phẩm:', error);
          alert('Đã xảy ra lỗi khi xóa sản phẩm.');
        }
      }
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
      if (page >= 0 && page < this.totalPages) {
        this.currentPage = page;
      }
    }
  },
  mounted() {
    this.fetchProducts();
  }
};
</script>





<style scoped>
/* Container styling */
.container {
  margin-top: 50px;
   max-width: 1200px;
  margin-left: auto;
  margin-right: auto; 
   padding: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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

/* Placeholder text color */
.search-input::placeholder {
  color: #999;
  font-style: italic;
}

/* Add product button styling */
.btn-add-product {
  float: left;
  margin-bottom: 20px;
  font-size: 16px ;
  padding: 15px 10px;
  background-color: #28a745;
  border-color: #28a745;
  border-radius: 30px;
  color: white;
  transition: background-color 0.3s ease;
}

.btn-add-product:hover {
  background-color: #218838;
}

/* Card component */
.card {
  border: none;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease-in-out;
  background-color: #ffffff;
}

.card:hover {
  transform: scale(1.02);
}

/* Card header */
.card-header {
  background-color: #00796b;
  color: #ffffff;
  padding: 18px 24px;
  border-radius: 10px 10px 0 0;
  font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Table styling */
.table {
  width: 100%;
  margin-top: 20px;
  border-collapse: separate;
  border-spacing: 0;
}

.table thead {
  background-color: #eeeeee;
  color: #333;
  font-weight: bold;
  text-transform: uppercase;
}

.table th,
.table td {
  padding: 14px;
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #ddd;
}

.table td {
  font-size: 16px;
  color: #555;
}

/* Image styling */
.img-fluid {
  width: 90px;
  height: 90px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
  transition: box-shadow 0.3s ease;
}

.img-fluid:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

/* Action buttons */
.btn-sm {
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 20px;
  background-color: #00796b;
  color: #fff;
  border: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-sm:hover {
  background-color: #004d40;
  transform: translateY(-3px);
}

.btn-danger {
  background-color: #f44336;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.btn-success {
  background-color: #4caf50;
}

.btn-success:hover {
  background-color: #388e3c;
}

/* Table empty state */
.no-products {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
  background-color: #f1f1f1;
  border-radius: 10px;
  margin-top: 10px;
}
/* Styling for size container */
.size-container {
  display: inline-block;
  margin-right: 10px; /* Space between size entries */
  margin-bottom: 5px;
  padding: 5px 10px;
  background-color: #f8f9fa; /* Light background for contrast */
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
/* Size display styling */
.size-info {
  font-size: 14px;
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 5px 10px;
  display: inline-block;
  margin-right: 5px;
  margin-bottom: 5px;
}

.size-value {
  font-weight: bold;
  color: #00796b;
}
.size-container {
  display: block;
  margin-bottom: 5px;
}
.size-value, .color-value, .quantity-badge {
  display: inline-block;
  margin-right: 8px;
}

.size-quantity {
  color: #666;
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
    display: block;
    width: 100%;
    overflow-x: auto;
  }

  .table thead {
    display: none;
  }

  .table tbody tr {
    display: block;
    margin-bottom: 15px;
    background-color: #ffffff;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .table td {
    display: block;
    text-align: right;
    font-size: 16px;
    padding: 10px;
    border: none;
  }

  .table td:before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }
}
</style>
