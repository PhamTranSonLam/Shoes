<!-- <template>
    <div class="voucher-container">
      <h3>Nhập mã voucher</h3>
      <input
        v-model="voucherCode"
        type="text"
        placeholder="Nhập mã voucher"
        class="voucher-input"
      />
      <button @click="applyVoucher" class="apply-button">Áp dụng</button>
      <p v-if="discount" class="discount-message">
        Giảm giá: {{ discount | currencyFormat }}
      </p>
      <p v-if="error" class="error-message">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        voucherCode: "",       // Mã voucher người dùng nhập
        discount: null,        // Giá trị giảm giá
        error: null,           // Thông báo lỗi
        orderValue: 600000     // Giá trị đơn hàng giả định
      };
    },
    methods: {
      async applyVoucher() {
        try {
          // Gửi request để áp dụng voucher
          const response = await axios.post("http://localhost:5000/api/voucher/apply", {
            code: this.voucherCode,
            orderValue: this.orderValue
          });
  
          // Lưu giá trị giảm giá từ phản hồi
          this.discount = response.data.discount;
          this.error = null; // Xóa thông báo lỗi nếu thành công
        } catch (error) {
          this.discount = null; // Reset giá trị giảm giá
          this.error = error.response.data.message || "Có lỗi xảy ra"; // Hiển thị lỗi
        }
      }
    },
    filters: {
    currencyFormat(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(value);
    }
  },
  };
  </script>
  
  <style scoped>
  .voucher-container {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 10px;
  }
  .voucher-input {
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  .apply-button {
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  .apply-button:hover {
    background-color: #0056b3;
  }
  .discount-message {
    color: green;
    font-weight: bold;
  }
  .error-message {
    color: red;
    font-weight: bold;
  }
  </style>
   -->