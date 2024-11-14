<template>
  <div class="admin-voucher">
    <h1>Quản Lý Voucher Flash Sale</h1>
    
    <!-- Button to Add New Voucher -->
    <button class="add-voucher-btn" @click="showAddVoucherForm = !showAddVoucherForm">
      {{ showAddVoucherForm && newVoucher._id ? 'Cập nhật Voucher' : 'Thêm Voucher' }}
    </button>

    <!-- Add Voucher Form -->
    <div v-if="showAddVoucherForm" class="add-voucher-form">
      <input v-model="newVoucher.code" type="text" placeholder="Mã của voucher" />
      <select v-model="newVoucher.discountType">
        <option value="percent">Phần trăm</option>
        <option value="amount">Số tiền cố định</option>
      </select>
      <input v-model="newVoucher.discountValue" type="number" placeholder="Giá trị giảm" />
      <input v-model="newVoucher.minOrderValue" type="number" placeholder="Giá trị đơn hàng tối thiểu để áp dụng" />
      <input v-model="newVoucher.startDate" type="date" placeholder="Thời gian bắt đầu" />
      <input v-model="newVoucher.endDate" type="date" placeholder="Thời gian kết thúc" />
      <input v-model="newVoucher.usageLimit" type="number" placeholder="Giới hạn số lần sử dụng" />
      <button @click="createVoucher">Tạo</button>
      <button @click="resetForm">Hủy</button> <!-- To reset form -->
    </div>

    <!-- Voucher List -->
    <div v-if="vouchers.length > 0" class="voucher-list">
      <div v-for="(voucher, index) in vouchers" :key="voucher._id" class="voucher-item">
        <h2>{{ voucher.code }}</h2>
        <p>Giảm {{ voucher.discountValue }}% đơn hàng trên {{ voucher.minOrderValue }} VNĐ</p>
        <p>Mã voucher: <strong>{{ voucher.code }}</strong></p>
        <button @click="editVoucher(voucher)">Chỉnh Sửa</button>
        <button @click="deleteVoucher(voucher._id, index)">Xóa</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Import axios to call the API

export default {
  data() {
    return {
      showAddVoucherForm: false,
      newVoucher: {
        code: '',
        discountType: 0,
        discountValue: 0,
        minOrderValue: 0,
        startDate: '',
        endDate: '',
        usageLimit: 0,
      },
      vouchers: [] // List of vouchers will be fetched from the API
    };
  },
  mounted() {
    this.getAllVoucher(); // Fetch all vouchers when component is mounted
  },
  methods: {
    // Fetch all vouchers from API
    async getAllVoucher() {
      try {
        const response = await axios.get('http://localhost:5000/api/voucher'); // Replace with your actual API
        this.vouchers = response.data; // Store voucher list into vouchers
      } catch (error) {
        console.error('Error fetching voucher list:', error);
      }
    },

    // Create or update a voucher
      async createVoucher (){
        try {
          const response = await axios.post('http://localhost:5000/api/voucher/create', this.newVoucher);
          this.vouchers = response.data; 
          alert('Voucher đã create thành công');
        } catch (error) {
          console.error('Error deleting voucher:', error);
      }
    },

    // Edit an existing voucher

    // Delete a voucher
    async deleteVoucher(id, index) {
      if (confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/voucher/delete/${id}`); // Send delete request to API
          this.vouchers.splice(index, 1); // Remove voucher from the list in frontend
          alert('Voucher đã bị xóa thành công');
        } catch (error) {
          console.error('Error deleting voucher:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.admin-voucher {
  padding: 20px;
}

h1 {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.add-voucher-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
}

.add-voucher-btn:hover {
  background-color: #45a049;
}

.add-voucher-form {
  margin-bottom: 20px;
}

.add-voucher-form input,
.add-voucher-form select,
.add-voucher-form button {
  margin: 10px 0;
  padding: 10px;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.add-voucher-form input[type="checkbox"] {
  width: auto;
}

.add-voucher-form button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.add-voucher-form button:hover {
  background-color: #45a049;
}

.voucher-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.voucher-item {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.voucher-item h2 {
  margin: 0;
  font-size: 20px;
}

.voucher-item p {
  margin: 10px 0;
}

.voucher-item button {
  background-color: #ff5733;
  color: white;
  padding: 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-right: 10px;
}

.voucher-item button:hover {
  background-color: #e74c3c;
}

@media (max-width: 768px) {
  .voucher-list {
    flex-direction: column;
  }
  .voucher-item {
    width: 100%;
    padding: 15px;
  }
}
</style>
