<template>
  <div class="chitietphieunhap mt-5">
    <!-- Search Input -->
    <div class="row mb-4">
      <div class="col-md-10">
        <input type="text" class="form-control search-input" placeholder="Tìm kiếm phiếu nhập" v-model="searchQuery" />
      </div>
    </div>

    <!-- Warehouse Management Table -->
    <div class="card custom-card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="card-title">Chi tiết phiếu nhập</h4>
        <select class="form-select custom-select" aria-label="Default select example" v-model="idSelected" @change="getOne">
          <option value="" selected>Chọn phiếu nhập</option>
          <option v-for="warehouse in warehouses" :key="warehouse._id" :value="warehouse._id">
            {{ warehouse.name }}
          </option>
        </select>

        <button class="btn btn-primary btn-add-product" @click="openAddModal">Thêm mới</button>
      </div>

      <div class="card-body">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center">
          <p class="loading-text">Đang tải dữ liệu...</p>
        </div>

        <!-- Table of Warehouses -->
        <table v-else class="table table-hover table-bordered">
          <thead class="table-light">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên mặt hàng</th>
              <th scope="col">Đơn vị tính</th>
              <th scope="col">Đơn giá</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Vị trí</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="newProduct.length > 0" v-for="(product, index) in paginatedWarehouses" :key="product.id">
              <td>{{ index + 1 + currentPage * itemsPerPage }}</td>
              <td>{{ product.productName }}</td>
              <td>{{ product.unit }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.location }}</td>
              <td>
                <button class="btn btn-success btn-sm" @click="openEditModal(product)">Chỉnh sửa</button>
                <button class="btn btn-danger btn-sm ml-2" @click="deleteWarehouse(product.id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Warehouse Modal -->
    <div v-if="showAddModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm phiếu nhập</h5>
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addWarehouse(newWarehouse)">
              <div class="mb-3">
                <label class="form-label">Tên mặt hàng</label>
                <input type="text" v-model="newWarehouse.productName" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Đơn vị tính</label>
                <input type="text" v-model="newWarehouse.unit" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Đơn giá</label>
                <input type="number" v-model="newWarehouse.price" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Số lượng</label>
                <input type="number" v-model="newWarehouse.quantity" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Vị trí</label>
                <input type="text" v-model="newWarehouse.location" class="form-control" required />
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Thêm mới</button>
                <button type="button" class="btn btn-secondary" @click="closeAddModal">Hủy</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Warehouse Modal -->
    <div v-if="showEditModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Chỉnh sửa phiếu nhập</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateWarehouse">
              <div class="mb-3">
                <label class="form-label">Tên mặt hàng</label>
                <input type="text" v-model="editWarehouse.productName" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Đơn vị tính</label>
                <input type="text" v-model="editWarehouse.unit" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Đơn giá</label>
                <input type="number" v-model="editWarehouse.price" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Số lượng</label>
                <input type="number" v-model="editWarehouse.quantity" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Vị trí</label>
                <input type="text" v-model="editWarehouse.location" class="form-control" required />
              </div>
              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Cập nhật</button>
                <button type="button" class="btn btn-secondary" @click="closeEditModal">Hủy</button>
              </div>
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
import axios from "axios";

export default {
  data() {
    return {
      newProduct: [],
      idSelected: '',
      isLoading: true,
      searchQuery: "",
      warehouses: [],
      currentPage: 0,
      itemsPerPage: 5,
      showAddModal: false,
      showEditModal: false,
      newWarehouse: {
        productName: "",
        unit: "",
        price: 0,
        quantity: 0,
        location: "",
      },
      editWarehouse: null,
    };
  },
  computed: {
    filteredWarehouses() {
      return this.newProduct?.filter((warehouse) =>
        warehouse.productName?.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedWarehouses() {
      const start = this.currentPage * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredWarehouses.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredWarehouses.length / this.itemsPerPage);
    },
  },
  methods: {
    // Hàm này sẽ lấy tất cả phiếu nhập từ API
    async getAllWarehouses() {
      try {
        const response = await axios.get("http://localhost:5000/api/warehouse/");
        this.warehouses = (response.data);
        this.isLoading = false; // Thay đổi trạng thái khi dữ liệu đã được tải xong
      } catch (error) {
        console.error("Có lỗi khi tải dữ liệu:", error);
      }
    },
    async getOne() {
      const response = await axios.get("http://localhost:5000/api/warehouse/"+this.idSelected);
      this.newProduct = response.data.products;
    },
    // async createdWarehouses() {
    //   try {
    //     const response = await axios.post("http://localhost:5000/api/warehouse");
    //     this.warehouses = response.data;
    //     this.isLoading = false; // Thay đổi trạng thái khi dữ liệu đã được tải xong
    //   } catch (error) {
    //     console.error("Có lỗi khi tải dữ liệu:", error);
    //   }
    // },
    async addWarehouse(data) {
      try {
        // const response = await axios.put("http://localhost:5000/api/warehouse", this.newWarehouse);
        // this.warehouses.push(response.data);
        this.newWarehouse = {
          name: "",
          category: "",
          unit: "",
          price: 0,
          quantity: 0,
          location: "",
        };
        this.newProduct.push(data);
        await this.updateWarehouse();
        this.showAddModal = false;
      } catch (error) {
        console.error("Có lỗi khi thêm phiếu nhập:", error);
      }
    },
    async updateWarehouse(id = '') {
      try {
        // let update = this.warehouses.filter((item) => item._id == this.idSelected);
        let update = {};
        if(this.editWarehouse) {
          const ind = this.newProduct.findIndex(product => product._id === this.editWarehouse._id);
          console.log(ind)
          this.newProduct.splice(ind, 1, this.editWarehouse);
        }
        update.products = this.newProduct;
        update.warehouseId = this.idSelected;
        const response = await axios.put(
          `http://localhost:5000/api/warehouse/update-products`,
          update
        );
        const index = this.warehouses.findIndex((warehouse) => warehouse.id === response.data.id);
        this.warehouses[index] = response.data;
        this.showEditModal = false;
      } catch (error) {
        console.error("Có lỗi khi cập nhật phiếu nhập:", error);
      }
    },
    async deleteWarehouse(id) {
      try {
        await axios.delete(`http://localhost:5000/api/warehouse/${id}`);
        this.warehouses = this.warehouses.filter((warehouse) => warehouse.id !== id);
      } catch (error) {
        console.error("Có lỗi khi xóa phiếu nhập:", error);
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
      this.currentPage = page;
    },
    openAddModal() {
      this.showAddModal = true;
    },
    closeAddModal() {
      this.showAddModal = false;
    },
    openEditModal(warehouse) {
      this.editWarehouse = { ...warehouse };
      this.showEditModal = true;
    },
    closeEditModal() {
      this.showEditModal = false;
    },
  },
  mounted() {
    this.getAllWarehouses(); // Gọi hàm này khi component được mount
  },
};
</script>

<style scoped>
.chitietphieunhap {
  margin: 2rem;
  font-family: 'Roboto', sans-serif;
  color: #333;
}

.search-input {
  border-radius: 8px;
   width: 30%;
  padding: 12px 18px;
  font-size: 1rem;
  border: 1px solid #ddd;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.25);
}

.custom-card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 1.5rem;
}

.card-header {
  background-color: rgba(222, 236, 241, 0.467);
  border-bottom: 1px solid #ddd;
  padding: 16px 24px;
}

.card-title {
  font-size: 1.25rem;
  color: #007bff;
}

.custom-select {
  width: 200px;
}

.loading-text {
  font-size: 1.1rem;
  color: #007bff;
}

.table {
  border-collapse: separate;
  border-spacing: 0 1rem;
}

.table th {
  background-color: #f0f0f0;
  font-weight: bold;
}

.table td, .table th {
  vertical-align: middle;
  padding: 12px 16px;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.btn-add-product {
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 8px;
}

.pagination {
  margin-top: 2rem;
}

.page-link {
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1rem;
  background-color: #007bff;
  color: #fff;
  border: none;
}

.page-link:hover {
  background-color: #0056b3;
}

.page-item.disabled .page-link {
  background-color: #ccc;
  color: #6c757d;
}

.page-item.active .page-link {
  background-color: #0056b3;
  color: #fff;
}
</style>