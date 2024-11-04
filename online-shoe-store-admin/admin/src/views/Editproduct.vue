<template>
  <div class="bg-light">
    <div class="row">
      <div class="col-lg-4 mt-3 bg-white m-auto rounded shadow-sm p-4">
        <h2 class="text-center mb-4">Cập nhật sản phẩm</h2>
        <form @submit.prevent="updateProduct">
          <div class="mb-3">
            <label class="form-label">Tên sản phẩm</label>
            <input
              type="text" class="form-control" v-model="newProduct.name" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Danh mục</label>
            <select class="form-control" v-model="newProduct.category" required>
              <option value="" disabled>Chọn danh mục</option>
              <option v-for="category in categories" :key="category._id" :value="category.name">{{ category.name }}</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Thông tin</label>
            <textarea
              class="form-control" v-model="newProduct.description" rows="3" required>
            </textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">Đơn giá</label>
            <input type="number" class="form-control" v-model.number="newProduct.price" required min="0"/>
          </div>

          <div class="mb-3">
            <label class="form-label">Kích thước và Màu sắc</label>
            <div v-for="(item, index) in sizes" :key="index" class="d-flex align-items-center mb-2">
              <select class="form-select" v-model="item.size" required>
                <option value="" disabled>Chọn kích thước</option>
                <option v-for="sizeOption in sizeOptions" :key="sizeOption" :value="sizeOption">{{ sizeOption }}</option>
              </select>
              <select class="form-select ms-2" v-model="item.color" required>
                <option value="" disabled>Chọn màu sắc</option>
                <option v-for="colorOption in colorOptions" :key="colorOption.name" :value="colorOption.name">{{ colorOption.name }}</option>
              </select>
              <input type="number" class="form-control ms-2" v-model="item.quantity" min="0" placeholder="Số lượng" required />
              <button type="button" class="btn btn-danger ms-2" @click="removeSize(index)">Xóa</button>
            </div>
            <button type="button" class="btn btn-secondary" @click="addSize">Thêm kích thước và màu sắc</button>
          </div>

          <img 
            :src="newProduct.imageUrl ? `http://localhost:5000/${newProduct.imageUrl}` : ''" 
            alt="Product Image" class="img-fluid bg-light mb-2" v-if="newProduct.imageUrl"/>
          <div class="mb-3">
            <label class="form-label">Tải ảnh sản phẩm</label>
            <input type="file" class="form-control" @change="onImageSelected"/>
            <img v-if="image" :src="URL.createObjectURL(image)" alt="Image Preview" class="img-fluid mt-2"/>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <router-link to="/productmanagement" class="btn btn-secondary">Exit</router-link>
            <button type="submit" class="btn btn-primary">Cập nhật</button>
          </div>

          <!-- Thêm thông báo thành công hoặc lỗi ở đây -->
          <div v-if="updateSuccess" class="alert alert-success mt-3">Cập nhật sản phẩm thành công!</div>
          <div v-if="updateError" class="alert alert-danger mt-3">Đã xảy ra lỗi. Vui lòng thử lại.</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      newProduct: {
        name: "",
        category: "",
        description: "",
        price: 0,
        color: "",
        imageUrl: "",
      },
      image: null,
      sizes: [],
      sizeOptions: [38, 39, 40, 41, 42, 43],
      colorOptions: ["Đen", "Trắng", "Đỏ", "Xanh", "Vàng"],
      categories: [], // Thêm thuộc tính categories
      updateSuccess: false, // Trạng thái cập nhật thành công
      updateError: false, // Trạng thái lỗi cập nhật
    };
  },
  mounted() {
    this.getProduct();
    this.fetchColors();
    this.fetchCategories();
  },
  methods: {
    onImageSelected(event) {
      this.image = event.target.files[0];
    },
    addSize() {
      this.sizes.push({ size: "", color: "", quantity: 0 }); // Đảm bảo rằng kích thước có đúng thuộc tính
    },
    removeSize(index) {
      this.sizes.splice(index, 1);
    },
    async fetchColors() {
      try {
        const response = await axios.get('http://localhost:5000/api/color');
        this.colorOptions = response.data;
      } catch (error) {
        console.error('Error fetching colors:', error);
      }
    },
    async getProduct() {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${this.$route.params.id}`);
        if (response.data) {
          this.newProduct = response.data;
          this.sizes = response.data.sizes || [{ size: "", color: "", quantity: 0 }];
        } else {
          console.error('Dữ liệu không hợp lệ:', response.data);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
        alert("Lỗi khi tải thông tin sản phẩm.");
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async updateProduct() {
      try {
        const formData = new FormData();
        formData.append("name", this.newProduct.name);
        formData.append("category", this.newProduct.category);
        formData.append("description", this.newProduct.description);
        formData.append("price", this.newProduct.price.toString());
        formData.append("sizes", JSON.stringify(this.sizes));

        if (this.image) formData.append("image", this.image);

        const response = await axios.put(`http://localhost:5000/api/product/${this.newProduct._id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response) {
          this.updateSuccess = true; // Đặt trạng thái thành công
          this.$router.push("/productmanagement");
        } else {
          this.updateError = true; // Đặt trạng thái lỗi
        }
      } catch (error) {
        console.log("Lỗi:", error);
        this.updateError = true; // Đặt trạng thái lỗi
      }
    },
  },
};
</script>



<style scoped>
.bg-light {
  background-image: url("../assets/img/loging_bg.png");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important;
}

h2 {
  color: #343a40;
  font-family: "Arial", sans-serif;
}

.form-control,
.form-select {
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  box-shadow: none;
  transition: border-color 0.2s;
}

.form-control:focus,
.form-select:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-label {
  font-weight: bold;
  color: #495057;
}

.btn {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  text-transform: uppercase;
  transition: background-color 0.3s, transform 0.2s;
}

.btn-primary {
  background-color: #007bff;
  border: none;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #6c757d;
  border: none;
}

.btn-secondary:hover {
  background-color: #5a6268;
  transform: translateY(-1px);
}
</style>
