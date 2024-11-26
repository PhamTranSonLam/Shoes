<template>
  <section id="page-headers">
    <h2>Thanh toán của bạn, {{ user.username }}</h2>
    <p>Tất cả sản phẩm đều được giảm giá từ giá gốc</p>
  </section>

  <section id="checkout">
    <div class="checkout-container">
      <!-- Left Section: Shipping Info and Payment -->
      <div class="checkout-left">
        <h2>Thanh toán</h2>

        <!-- Shipping Details Form -->
        <div class="shipping-info">
          <h3>Thông tin giao hàng</h3>
          <form @submit.prevent="submitOrder" v-if="userInfo">
            <input type="text" v-model="userInfo.username" placeholder="Full Name" required />
            <input type="text" v-model="userInfo.address" placeholder="Address" required />
            <input type="email" v-model="userInfo.email" placeholder="Email" required />
            <input type="text" v-model="userInfo.phone" placeholder="Phone Number" required />
          </form>
          <p>Bạn có thể chỉnh sửa thông tin tại đây</p>
        </div>

        <!-- Payment Section -->
        <div class="payment-method">
          <h3>Phương thức thanh toán</h3>
          <select v-model="paymentMethod">
            <option value="offline">Thanh toán khi nhận hàng</option>
            <option value="vnpay">VNPay</option>
          </select>
        </div>
      </div>

      <!-- Right Section: Cart Summary -->
      <div class="checkout-right">
        <div class="cart-summary">
          <h3>Tóm tắc đơn hàng</h3>
          <div v-for="item in cartItems" :key="item.product._id" class="cart-item">
            <div class="cart-item-image">
              <img :src="`${item.mainImage}`" alt="Product Image" class="img-fluid bg-light" />
            </div>
            <div class="cart-item-details">
              <span class="product-name">{{ item.product.name }}</span>
              <div class="quantity-control">
                <input type="number" v-model.number="item.quantity" @change="updateQuantity(item.product._id, item.quantity)" min="1" />
              </div>
              <span class="product-price">{{ formatPrice(item.product.priceAfterDiscount || item.product.price) }}</span>
            </div>
          </div>

          <!-- Voucher Section -->
          <div id="coupon">
            <div class="voucher-container">
              <h3>Nhập mã giảm giá</h3>
              <input
                v-model="voucherCode"type="text" placeholder="Nhập mã voucher" class="voucher-input"/>
              <button @click="applyVoucher" class="apply-button">Áp dụng</button>
              <p v-if="discount" class="discount-message">
                Giảm giá: {{ formatPrice(discount) }}
              </p>
              <p v-if="error" class="error-message">{{ error }}</p>
            </div>
          </div>

          <p v-if="cartTotal === 0" class="error-message">
            Giỏ hàng của bạn hiện trống. Vui lòng thêm sản phẩm trước khi thanh toán.
          </p>
          <h4 v-else>Total: {{ formatPrice(cartTotal - discount) }}</h4>
        </div>

        <!-- Order Button -->
        <button @click="submitOrder" :disabled="cartTotal === 0 || !isFormValid">Thanh toán</button>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/user';

export default {
  data() {
    return {
      userInfo: {},
      user: this.UserStore.user,
      cartItems: [],
      paymentMethod: 'vnpay', // Default payment method
      discount: 0, // Discount from voucher
      voucherCode: "", // Voucher code entered by the user
      error: null, // Error message for voucher
      orderValue: 0, // Default order value for discount calculation
    };
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => {
        const priceAfterDiscount = item.product.priceAfterDiscount || item.product.price;
        return total + (priceAfterDiscount * item.quantity);
      }, 0);
    },
    isFormValid() {
      return this.userInfo.username && this.userInfo.address && this.userInfo.email && this.userInfo.phone;
    },
  },
  mounted() {
    this.fetchCartItems();
    this.getUser();
  },
  methods: {
    async fetchCartItems() {
      try {
        const userId = this.UserStore.user._id;
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`
          }
        });
        this.cartItems = response.data.items;
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    async updateQuantity(productId, newQuantity) {
      if (newQuantity < 1) return;
      try {
        await axios.put(`http://localhost:5000/api/cart/update/${productId}`, { quantity: newQuantity }, {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`
          }
        });
        this.fetchCartItems();
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    async applyVoucher() {
      try {
        this.orderValue = this.cartTotal;

        if (this.orderValue === 0) {
          this.error = "Giỏ hàng của bạn trống. Vui lòng thêm sản phẩm trước khi áp dụng mã giảm giá.";
          this.discount = 0;
          return;
        }

        const response = await axios.post("http://localhost:5000/api/voucher/apply", {
          code: this.voucherCode,
          orderValue: this.orderValue
        });

        this.discount = response.data.discount || 0;
        this.error = null; // Clear error message on success
      } catch (error) {
        this.discount = 0; // Reset discount value
        this.error = error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.";
      }
    },
    formatPrice(value) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    },
    async submitOrder() {
      if (this.cartTotal === 0) {
        alert("Giỏ hàng của bạn hiện trống. Không thể đặt hàng.");
        return;
      }

      const orderDetails = {
        user: this.user._id,
        items: this.cartItems,
        shippingInfo: {
          username: this.userInfo.username,
          address: this.userInfo.address,
          email: this.userInfo.email,
          phone: this.userInfo.phone,
        },
        paymentMethod: this.paymentMethod,
        totalAmount: this.cartTotal, // Apply discount to the total
        voucher: this.voucherCode,
        discount:this.discount,
        totaldiscount:this.cartTotal - this.discount,
        status: "Đang xử lý", // Default status
      };

      try {
        const response = await axios.post('http://localhost:5000/api/orders/place', orderDetails);

        if (this.paymentMethod === "vnpay") {
          const paymentResponse = await axios.post('http://localhost:5000/api/payment/vnpay/create_payment_url', response);
          if (paymentResponse.status === 200) {
            window.location.href = paymentResponse.data.data?.url;
          }
        } else {
          this.$router.push('/Products');
          alert("Đặt hàng thành công. Bạn sẽ thanh toán khi nhận hàng.");
        }
      } catch (error) {
        console.error('Error placing order:', error);
        alert('Đã xảy ra lỗi khi đặt hàng.');
      }
    },
    async getUser() {
      try {
        const userId = this.UserStore.user._id;
        const response = await axios.get(`http://localhost:5000/api/auth/${userId}`, {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`
          }
        });
        this.userInfo = response.data;
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
  },
  setup() {
    const UserStore = useUserStore();
    return {
      UserStore,
    };
  },
};
</script>








<style scoped>
/* Header Section */
#page-headers {
  background-image: url(../assets/img/checkout.jpg);
  width: 100%;
  height: 40vh;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 14px;
}

#page-headers h2 {
  color: white;
  font-size: 3rem;
  font-weight: 600;
  margin-bottom: 10px;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

#page-headers p {
  color: white;
  font-size: 1.3rem;
  font-style: italic;
  margin: 0;
  letter-spacing: 1px;
}

/* Checkout Section */
#checkout {
  padding: 40px 20px;
  max-width: 1500px;
  margin: 40px auto;
  display: flex;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Checkout Container */
.checkout-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
  gap: 30px;
}

/* Left Section Styling */
.checkout-left {
  flex: 1;
  padding-right: 30px;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
  padding: 20px;
}

h2, h3 {
  color: #333;
  margin-bottom: 25px;
  font-weight: 600;
  text-transform: uppercase;
}

.shipping-info input,
.payment-method select {
  width: 100%;
  padding: 14px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 16px;
  background-color: #f4f4f4;
  transition: all 0.3s ease;
}

.shipping-info input:focus,
.payment-method select:focus {
  border-color: #9b59b6;
  background-color: #fff;
  outline: none;
}

/* Right Section Styling */
.checkout-right {
  flex: 1;
  padding-left: 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 25px;
}

.cart-summary {
  margin-bottom: 30px;
}

.cart-summary h4 {
  margin-top: 25px;
  font-size: 1.8rem;
  text-align: right;
  font-weight: 600;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 10px;
  transition: all 0.3s ease;
}

.cart-item:hover {
  background-color: #f9f9f9;
}

.cart-item-image img {
  width: 90px;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
}

.cart-item-details {
  flex: 1;
  margin-left: 20px;
}

.product-name {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

.product-price {
  margin-top: 8px;
  font-size: 1rem;
  color: #555;
}

.quantity-control {
  margin-top: 10px;
}

.quantity-control input {
  width: 60px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  padding: 8px;
  transition: border-color 0.3s ease;
}

.quantity-control input:focus {
  border-color: #9b59b6;
  outline: none;
}

/* Button Styling */
button {
  background: linear-gradient(to right, #9b59b6, #8e44ad);
  color: white;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  width: 50%;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  background: #8e44ad;
}

button:focus {
  outline: none;
}

/* Voucher Section */
#coupon .voucher-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  margin-top: 20px;
}

#coupon h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
}

.voucher-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  transition: all 0.3s ease;
}

.voucher-input:focus {
  border-color: #9b59b6;
  outline: none;
  box-shadow: 0 0 5px rgba(155, 89, 182, 0.5);
}

.apply-button {
  width: 100%;
  background-color: #9b59b6;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-button:hover {
  background-color: #8e44ad;
}

.discount-message {
  margin-top: 15px;
  font-size: 1rem;
  color: #27ae60;
  font-weight: 600;
}

.error-message {
  margin-top: 15px;
  font-size: 1rem;
  color: #e74c3c;
  font-weight: 600;
}


@media (max-width: 768px) {
  /* Mobile adjustments */
  .checkout-container {
    flex-direction: column;
    align-items: center;
  }

  .checkout-left, .checkout-right {
    width: 100%;
    padding: 20px;
    box-shadow: none;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .voucher-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .voucher-input {
    width: 100%;
    margin-bottom: 10px;
  }
}


</style>
