<template>
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

  }
};
</script>
