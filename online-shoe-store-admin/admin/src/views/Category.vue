<template>
  <div class="voucher-manager">
    <h1>Quản Lý Voucher Flash Sale</h1>
    
    <!-- Button to toggle form visibility -->
    <button @click="toggleForm" class="add-voucher-button">
      {{ isFormVisible ? 'Hủy' : 'Thêm Voucher' }}
    </button>
    
    <!-- Add/Edit Voucher Form -->
    <form v-if="isFormVisible" @submit.prevent="submitVoucher" class="voucher-form">
      <input type="text" v-model="voucher.name" placeholder="Tên Voucher" required />
      <input type="number" v-model="voucher.discount" placeholder="Giảm (%)" required />
      <input type="number" v-model="voucher.minOrder" placeholder="Giá trị tối thiểu (VNĐ)" required />
      <input type="text" v-model="voucher.code" placeholder="Mã Voucher" required />
      <button type="submit">{{ isEditing ? 'Cập nhật' : 'Thêm' }}</button>
    </form>

    <!-- Voucher Table -->
    <table class="voucher-table">
      <thead>
        <tr>
          <th>Tên Voucher</th>
          <th>Giảm (%)</th>
          <th>Giá trị tối thiểu (VNĐ)</th>
          <th>Mã Voucher</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="voucher in vouchers" :key="voucher.id">
          <td>{{ voucher.name }}</td>
          <td>{{ voucher.discount }}%</td>
          <td>{{ voucher.minOrder }} VNĐ</td>
          <td>{{ voucher.code }}</td>
          <td>
            <button @click="editVoucher(voucher)" class="edit-button">Sửa</button>
            <button @click="deleteVoucher(voucher.id)" class="delete-button">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isEditing: false,
      isFormVisible: false,  // Điều khiển việc ẩn/hiện form
      voucher: {
        name: '',
        discount: 0,
        minOrder: 0,
        code: ''
      },
      vouchers: [
        { id: 1, name: 'Voucher 1', discount: 10, minOrder: 200000, code: 'NJF909' },
        { id: 2, name: 'Voucher 2', discount: 20, minOrder: 250000, code: 'NJF910' },
        { id: 3, name: 'Voucher 3', discount: 30, minOrder: 300000, code: 'NJF911' }
      ]
    };
  },
  methods: {
    // Thêm mới hoặc cập nhật voucher
    submitVoucher() {
      if (this.isEditing) {
        // Cập nhật voucher
        const index = this.vouchers.findIndex(v => v.id === this.voucher.id);
        if (index !== -1) {
          this.vouchers[index] = { ...this.voucher };
        }
      } else {
        // Thêm mới voucher
        const newId = this.vouchers.length + 1;
        this.vouchers.push({ id: newId, ...this.voucher });
      }
      this.resetForm();
    },
    
    // Reset form khi thêm hoặc cập nhật
    resetForm() {
      this.voucher = { name: '', discount: 0, minOrder: 0, code: '' };
      this.isEditing = false;
      this.isFormVisible = false;  // Ẩn form sau khi thêm/xóa
    },

    // Sửa voucher
    editVoucher(voucher) {
      this.voucher = { ...voucher };
      this.isEditing = true;
      this.isFormVisible = true;  // Hiện form khi đang sửa
    },

    // Xóa voucher
    deleteVoucher(id) {
      if (confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
        this.vouchers = this.vouchers.filter(v => v.id !== id);
      }
    },

    // Toggle form visibility
    toggleForm() {
      this.isFormVisible = !this.isFormVisible;  // Chuyển đổi trạng thái hiển thị form
      if (!this.isFormVisible) {
        this.resetForm();  // Reset form nếu ẩn đi
      }
    }
  }
};
</script>
<style scoped>
.voucher-manager {
  padding: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.add-voucher-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.add-voucher-button:hover {
  background-color: #45a049;
}

.voucher-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.voucher-form input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
}

.voucher-form button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  width: 100%;
}

.voucher-form button:hover {
  background-color: #45a049;
}

.voucher-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.voucher-table th, .voucher-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: center;
}

.voucher-table th {
  background-color: #f4f4f4;
}

.edit-button, .delete-button {
  background-color: #4CAF50;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
}

.edit-button:hover {
  background-color: #45a049;
}

.delete-button {
  background-color: #ff5733;
}

.delete-button:hover {
  background-color: #e74c3c;
}
</style>
