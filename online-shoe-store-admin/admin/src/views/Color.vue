<template>
    <div class="color-management">
      <h1>Quản lý màu sắc</h1>
  
      <!-- Form thêm màu mới -->
      <form @submit.prevent="addNewColor">
        <input v-model="newColorName" placeholder="Tên màu mới" />
        <button type="submit">Thêm màu</button>
      </form>
  
      <!-- Danh sách màu sắc -->
      <ul v-if="colors.length">
        <li v-for="color in colors" :key="color._id">
          <span>{{ color.name }} - {{ color.code }}</span>
          <button @click="editColor(color)">Sửa</button>
          <button @click="deleteColor(color._id)">Xóa</button>
        </li>
      </ul>
      <div v-else>Không có màu sắc nào</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        colors: [],          // Danh sách các màu sắc
        newColorName: '',    // Tên màu mới để thêm vào danh sách
      };
    },
    methods: {
      // Lấy danh sách màu sắc từ API
      async fetchColors() {
        try {
          const response = await axios.get('http://localhost:5000/api/color');
          this.colors = response.data;
        } catch (error) {
          console.error('Error fetching colors:', error);
        }
      },
  
      // Thêm màu mới vào API
      async addNewColor() {
        if (this.newColorName.trim()) {
          try {
            const response = await axios.post('http://localhost:5000/api/color', {
              name: this.newColorName,
              code: '#000000' // Thay đổi mã màu nếu cần
            });
            this.colors.push(response.data);
            this.newColorName = '';
          } catch (error) {
            console.error('Error adding new color:', error);
          }
        }
      },
  
      // Chỉnh sửa màu sắc
      async editColor(color) {
        const updatedName = prompt('Cập nhật tên màu:', color.name);
        const updatedCode = prompt('Cập nhật mã màu:', color.code);
        if (updatedName && updatedCode) {
          try {
            await axios.put(`http://localhost:5000/api/color/${color._id}`, {
              name: updatedName,
              code: updatedCode
            });
            color.name = updatedName;
            color.code = updatedCode;
          } catch (error) {
            console.error('Error updating color:', error);
          }
        }
      },
  
      // Xóa màu sắc từ API
      async deleteColor(id) {
        try {
          await axios.delete(`http://localhost:5000/api/color/${id}`);
          this.colors = this.colors.filter(color => color._id !== id);
        } catch (error) {
          console.error('Error deleting color:', error);
        }
      }
    },
  
    mounted() {
      this.fetchColors();
    }
  };
  </script>
  
  <style scoped>
  .color-management {
    padding: 20px;
  }
  </style>
  