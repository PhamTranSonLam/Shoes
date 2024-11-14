<template>
  <div class="bg-light">
    <div class="row">
      <div class="col-lg-4 mt-3 bg-white m-auto rounded shadow-sm p-4">
        <h2 class="text-center mb-4">Thêm sản phẩm</h2>
        <form @submit.prevent="addProduct">
          <div class="mb-3">
            <label class="form-label">Tên sản phẩm</label>
            <input type="text" class="form-control" v-model="newProduct.name" required />
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
            <textarea class="form-control" v-model="newProduct.description" rows="3" required></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">Đơn giá</label>
            <input type="number" class="form-control" v-model="newProduct.price" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Kích thước </label>
            <div v-for="(item, index) in sizes" :key="index" class="d-flex align-items-center mb-2">
              <select class="form-select" v-model="item.size" required>
                <option value="" disabled>Chọn kích thước</option>
                <option v-for="sizeOption in sizeOptions" :key="sizeOption" :value="sizeOption">{{ sizeOption }}</option>
              </select>
              <input type="number" class="form-control ms-2" v-model="item.quantity" min="0" placeholder="Số lượng" required />
              <button type="button" class="btn btn-danger ms-2" @click="removeSize(index)">Xóa</button>
            </div>
            <button type="button" class="btn btn-secondary" @click="addSize">Thêm kích thước</button>
          </div>

          <div class="mb-3">
            <label class="form-label">Tải ảnh chính</label>
            <input type="file" class="form-control" @change="onMainImageSelected" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Tải lên 4 ảnh nhỏ</label>
            <input type="file" class="form-control" @change="onAdditionalImagesSelected" multiple required />
            <input type="file" class="form-control" @change="onAdditionalImagesSelected" multiple required />
            <input type="file" class="form-control" @change="onAdditionalImagesSelected" multiple required />
            <input type="file" class="form-control" @change="onAdditionalImagesSelected" multiple required />
            <small class="form-text text-muted">Chọn tối đa 4 ảnh nhỏ.</small>
          </div>

          <div class="d-flex justify-content-between mt-4">
            <router-link to="/productmanagement" class="btn btn-secondary">Quay lại</router-link>
            <button type="submit" class="btn btn-primary">Thêm sản phẩm</button>
          </div>
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
      },
      sizes: [{ size: "", quantity: 0 }],
      sizeOptions: [38, 39, 40, 41, 42, 43],
      categories: [],
      mainImage: null,
      additionalImages: [],
    };
  },
  mounted() {
   
    this.fetchCategories();
  },
  methods: {
    onMainImageSelected(event) {
      this.mainImage = event.target.files[0];
    },
    onAdditionalImagesSelected(event) {
      const files = event.target.files;
      if (this.additionalImages.length + files.length > 4) {
        alert("Chỉ được chọn tối đa 4 ảnh nhỏ.");
        return;
      }
      this.additionalImages = [...this.additionalImages, ...Array.from(files)];
    },
    addSize() {
      this.sizes.push({ size: "",  quantity: 0 });
    },
    removeSize(index) {
      this.sizes.splice(index, 1);
    },
    
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    validateForm() {
      if (!this.newProduct.name || !this.newProduct.category || !this.newProduct.description || !this.newProduct.price || this.sizes.some(item => !item.size || item.quantity <= 0)) {
        alert("Vui lòng điền đầy đủ thông tin sản phẩm.");
        return false;
      }
      return true;
    },
    async addProduct() {
      if (!this.validateForm()) return;

      try {
        const formData = new FormData();
        formData.append("name", this.newProduct.name);
        formData.append("category", this.newProduct.category);
        formData.append("description", this.newProduct.description);
        formData.append("price", this.newProduct.price.toString());
        formData.append("sizes", JSON.stringify(this.sizes));
        formData.append("image", this.mainImage);

        // Append each additional image
        this.additionalImages.forEach((image) => {
          formData.append("additionalImages", image);
        });

        const response = await axios.post("http://localhost:5000/api/product", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status === 201) {
          alert("Sản phẩm đã được thêm thành công!");
          this.$router.push("/productmanagement");
        } else {
          alert("Đã xảy ra lỗi khi thêm sản phẩm. Hãy thử lại.");
        }
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        alert("Đã xảy ra lỗi khi thêm sản phẩm.");
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
