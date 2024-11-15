<template>
  <div class="category-manager">
    <h1>Quản Lý Danh Mục</h1>
    <form @submit.prevent="submitCategory" class="category-form">
      <input type="text" v-model="categoryName" placeholder="Nhập tên danh mục" required />
      <button type="submit">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
    </form>
    <table class="category-table">
      <thead>
        <tr>
          <th>Tên Danh Mục</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category._id">
          <td>{{ category.name }}</td>
          <td>
            <button @click="editCategory(category)" class="edit-button">Sửa</button>
            <button @click="deleteCategory(category._id)" class="delete-button">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      categories: [],
      categoryName: '',
      isEditing: false,
      editingId: null,
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async submitCategory() {
      if (this.isEditing) {
        await this.updateCategory();
      } else {
        await this.createCategory();
      }
      this.resetForm();
      this.fetchCategories();
    },
    async createCategory() {
      try {
        await axios.post('http://localhost:5000/api/categories', { name: this.categoryName });
      } catch (error) {
        console.error('Error creating category:', error);
      }
    },
    async updateCategory() {
      try {
        await axios.put(`http://localhost:5000/api/categories/${this.editingId}`, { name: this.categoryName });
      } catch (error) {
        console.error('Error updating category:', error);
      }
    },
    async deleteCategory(id) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        this.fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    },
    editCategory(category) {
      this.categoryName = category.name;
      this.editingId = category._id;
      this.isEditing = true;
    },
    resetForm() {
      this.categoryName = '';
      this.isEditing = false;
      this.editingId = null;
    },
  },
  mounted() {
    this.fetchCategories();
  },
};
</script>
<style scoped>
.category-manager {
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #f9f9f9;
}
h1 {
  text-align: center;
  color: #333;
  font-size: 1.5rem; /* Sử dụng rem cho kích thước chữ */
}
.category-form {
  display: flex;
  flex-direction: column; /* Thay đổi hướng để phù hợp với màn hình nhỏ */
  gap: 10px; /* Tạo khoảng cách giữa các phần tử */
  margin-bottom: 20px;
}
input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%; /* Chiều rộng 100% để ô nhập đầy đủ */
  box-sizing: border-box; /* Đảm bảo padding không làm tăng kích thước */
}
button {
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%; /* Chiều rộng 100% cho nút */
}
button:hover {
  background-color: #218838;
}
.category-table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 10px;
  text-align: left;
  border: 1px solid #ddd;
}
.edit-button {
  background-color: #007bff;
  padding: 5px 10px; /* Thay đổi padding để nút nhỏ hơn */
}
.delete-button {
  background-color: #dc3545;
  padding: 5px 10px; /* Thay đổi padding để nút nhỏ hơn */
}
.edit-button:hover {
  background-color: #0056b3;
}
.delete-button:hover {
  background-color: #c82333;
}
/* Media Queries */
@media (min-width: 768px) {
  .category-form {
    flex-direction: row; /* Chuyển lại thành hàng trên màn hình lớn hơn */
  }
  input {
    flex: 1; /* Chiếm không gian còn lại */
    margin-right: 10px; /* Khoảng cách giữa ô nhập và nút */
  }
  button {
    width: auto; /* Đặt chiều rộng tự động cho nút trên màn hình lớn */
  }
}
@media (max-width: 600px) {
  h1 {
    font-size: 1.25rem; /* Giảm kích thước chữ trên màn hình nhỏ */
  }
  button {
    padding: 10px; /* Đảm bảo nút không quá lớn trên màn hình nhỏ */
  }
  th, td {
    font-size: 0.9rem; /* Giảm kích thước chữ trong bảng */
  }
}
</style>