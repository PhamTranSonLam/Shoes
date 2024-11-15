<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h4 class="mb-0">Thêm voucher mới</h4>
          </div>
          <div class="card-body">
            <form @submit.prevent="createVoucher">
              <div class="form-group mb-3">
                <label for="code">Mã của voucher</label>
                <input v-model="newVoucher.code" type="text" placeholder="Mã của voucher" />
              </div>

              <div class="form-group mb-3">
                <label for="discountType">Cách thức giảm giá</label>
                <select v-model="newVoucher.discountType">
                  <option value="percent">Phần trăm</option>
                  <option value="amount">Số tiền cố định</option>
                </select>
              </div>

              <div class="form-group mb-3">
                <label for="discountValue">Giá trị giảm</label>
                <input v-model="newVoucher.discountValue" type="number" placeholder="Giá trị giảm" />
              </div>

              <div class="form-group mb-3">
                <label for="minOrderValue">Giá trị đơn hàng tối thiểu để áp dụng</label>
                <input v-model="newVoucher.minOrderValue" type="number" placeholder="Giá trị đơn hàng tối thiểu để áp dụng" />
              </div>

              <div class="form-group mb-3">
                <label for="startDate">Thời gian bắt đầu</label>
                <input v-model="newVoucher.startDate" type="date" placeholder="Thời gian bắt đầu" />
              </div>

              <div class="form-group mb-3">
                <label for="endDate">Thời gian kết thúc</label>
                <input v-model="newVoucher.endDate" type="date" placeholder="Thời gian kết thúc" />
              </div>

              <div class="form-group mb-3">
                <label for="usageLimit">Giới hạn lần sử dụng</label>
                <input v-model="newVoucher.usageLimit" type="number" placeholder="Giới hạn lần sử dụng" />
              </div>

              <div class="form-group text-center">
                <router-link to="/voucher" class="btn btn-secondary">
                  Quay lại
                </router-link>
                <button type="submit" class="btn btn-add" :disabled="isSubmitting">
                  <span v-if="isSubmitting">Đang xử lý...</span>
                  <span v-else>Thêm Voucher</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isSubmitting: false,
      newVoucher: {
        code: '',
        discountType: 'percent',
        discountValue: 0,
        minOrderValue: 0,
        startDate: '',
        endDate: '',
        usageLimit: '',
      },
      vouchers: [],
    };
  },
  methods: {
    formatDate(date) {
      return new Date(date).toISOString().split('T')[0];
    },
    validateForm() {
      if (!this.newVoucher.code.trim()) {
        alert('Vui lòng nhập mã voucher');
        return false;
      }
      if (!this.newVoucher.discountValue || this.newVoucher.discountValue <= 0) {
        alert('Vui lòng nhập giá trị giảm hợp lệ');
        return false;
      }
      if (!this.newVoucher.startDate || !this.newVoucher.endDate) {
        alert('Vui lòng nhập đầy đủ thời gian bắt đầu và kết thúc');
        return false;
      }
      if (!this.newVoucher.usageLimit || this.newVoucher.usageLimit <= 0) {
        alert('Vui lòng nhập giới hạn lần sử dụng hợp lệ');
        return false;
      }
      return true;
    },
    async createVoucher() {
      if (!this.validateForm()) return;

      this.isSubmitting = true;
      try {
        this.newVoucher.startDate = this.formatDate(this.newVoucher.startDate);
        this.newVoucher.endDate = this.formatDate(this.newVoucher.endDate);

        const response = await axios.post('http://localhost:5000/api/voucher/create', this.newVoucher);
        this.vouchers.push(response.data);
        alert('Voucher đã được tạo thành công');
        this.$router.push('/voucher'); // Redirect to voucher list after creation
      } catch (error) {
        console.error('Error creating voucher:', error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>


<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}

/* Card Styling */
.card {
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background-color: #f8f9fa;
  color: #333;
  padding: 15px;
  font-size: 1.25rem;
  border-bottom: 2px solid #28a745;
}

.card-body {
  padding: 20px;
}

/* Form Styling */
.form-group label {
  font-weight: bold;
}

input[type="text"], input[type="number"], input[type="date"], select {
  height: 45px;
  border-radius: 8px;
  border: 1px solid #ccc;
  padding-left: 15px;
  transition: border-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
}

input[type="text"]:hover, input[type="number"]:hover, input[type="date"]:hover, select:hover {
  border-color: #218838;
  box-shadow: 0 0 8px rgba(33, 136, 56, 0.25);
}

input[type="text"]:focus, input[type="number"]:focus, input[type="date"]:focus, select:focus {
  border-color: #28a745;
  box-shadow: 0 0 8px rgba(40, 167, 69, 0.25);
}

/* Buttons */
.btn-add {
  background-color: #28a745;
  border-color: #28a745;
  font-weight: bold;
  color: white;
}

.btn-add:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* Responsive Design */
@media (max-width: 768px) {
  .form-group {
    margin-bottom: 15px;
  }

  .btn {
    font-size: 0.85rem;
    padding: 10px 20px;
  }
}
</style>
