<template>
  <section id="page-headers">
    <h2>Your Checkout, {{ user.username }}</h2>
    <p>All products are marked down from their original prices</p>
  </section>

  <section id="checkout">
    <div class="checkout-container">
      <!-- Left Section: Shipping Info and Payment -->
      <div class="checkout-left">
        <h2>Checkout</h2>

        <!-- Shipping Details Form -->
        <div class="shipping-info">
          <h3>Shipping Information</h3>
          <form @submit.prevent="submitOrder" v-if="userInfo">
            <input type="text" v-model="userInfo.username" placeholder="Full Name" required />
            <input type="text" v-model="userInfo.address" placeholder="Address" required />
            <input type="email" v-model="userInfo.email" placeholder="Email" required />
            <input type="text" v-model="userInfo.phone" placeholder="Phone Number" required />
          </form>
          <p>You can edit the information here</p>
          
        </div>

        <!-- Payment Section -->
        <div class="payment-method">
          <h3>Payment Method</h3>
          <select v-model="paymentMethod">
            <option value="offline">Payment upon receipt</option>
            <option value="vnpay">VNPay</option>
          </select>
        </div>
      </div>

      <!-- Right Section: Cart Summary -->
      <div class="checkout-right">
        <div class="cart-summary">
          <h3>Order Summary</h3>
          <div v-for="item in cartItems" :key="item.product._id" class="cart-item">
            <div class="cart-item-image">
              <img :src="`http://localhost:5000/${item.product.imageUrl}`" alt="Product Image" class="img-fluid bg-light" />
            </div>
            <div class="cart-item-details">
              <span class="product-name">{{ item.product.name }}</span>
              <div class="color-display">
                <span>Color: {{ item.color }}</span> <!-- Hiển thị màu sắc -->
              </div>
              <div class="quantity-control">
                <input type="number" v-model.number="item.quantity" @change="updateQuantity(item.product._id, item.quantity)" min="1" />
              </div>
              <span class="product-price">{{ formatPrice(item.product.price) }}</span>
            </div>
          </div>
          <h4>Total: {{ formatPrice(cartTotal) }}</h4>
        </div>

        <!-- Order Button -->
         
        <button @click="submitOrder">Place Order</button>
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
    };
  },
  computed: {
    // user() {
    //   return this.UserStore.user;
    // },
    cartTotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);
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
    formatPrice(value) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    },
    async submitOrder() {
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
        totalAmount: this.cartTotal,
        status: "Đang xử lý", // Đặt trạng thái mặc định là "Đang xử lý"
      };

      console.log("Order Details:", orderDetails);

      try {
        // Tạo đơn hàng trong hệ thống
        const response = await axios.post('http://localhost:5000/api/orders/place', orderDetails);
        console.log("Order Response:", response);

        // Tạo liên kết thanh toán với chi tiết đơn hàng
        if (this.paymentMethod === "vnpay") {
          const paymentResponse = await axios.post('http://localhost:5000/api/payment/vnpay/create_payment_url', response);
          console.log("Payment Response:", paymentResponse);

          if (paymentResponse.status === 200) {
            // Chuyển hướng đến URL thanh toán
            window.location.href = paymentResponse.data.data?.url;
          }
        } else {
          this.$router.push('/Products');
          alert("Order placed successfully. You will pay upon receipt.");
        }
      } catch (error) {
        console.log('Error placing order:', error);
        alert('An error occurred while placing your order.');
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
        console.error('Error fetching cart items:', error);
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
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
}

#page-headers p {
  color: white;
  font-size: 1.2rem;
  font-style: italic;
  margin: 0;
}

/* Checkout Section */
#checkout {
  padding: 40px 20px;
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.checkout-container {
  display: flex;
  width: 100%;
}

/* Left Section Styling */
.checkout-left {
  flex: 1;
  padding-right: 30px;
}

h2, h3 {
  color: #333;
  margin-bottom: 25px;
  font-weight: bold;
}

.shipping-info input,
.payment-method select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 16px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.shipping-info input:focus,
.payment-method select:focus {
  border-color: #c72092;
  outline: none;
}

/* Right Section Styling */
.checkout-right {
  flex: 1;
  padding-left: 30px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  padding: 25px;
}

.cart-summary {
  margin-bottom: 30px;
}

.cart-summary h4 {
  margin-top: 25px;
  font-size: 1.8rem;
  text-align: right;
  font-weight: bold;
}

.cart-item {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 10px;
}

.cart-item-image img {
  width: 80px;
  height: 80px;
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
  font-weight: bold;
}

.product-price {
  margin-top: 8px;
  font-size: 1rem;
  color: #666;
}

.quantity-control {
  margin-top: 10px;
}

.quantity-control input {
  width: 60px;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  padding: 5px;
  transition: border-color 0.3s ease;
}

.quantity-control input:focus {
  border-color: #6c14d0;
  outline: none;
}

/* Button Styling */
button {
  background: linear-gradient(to right, #c72092, #6c14d0);
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  width: 100%;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

button:hover {
  background: #6c14d0;
}

button:focus {
  outline: none;
}

/* Media Queries */
@media screen and (max-width: 768px) {
  #checkout {
    flex-direction: column;
    padding: 20px;
  }

  .checkout-left,
  .checkout-right {
    padding: 20px;
  }

  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart-item-details {
    margin-left: 0;
    margin-top: 10px;
  }

  button {
    width: 100%;
    margin-top: 20px;
  }
}

</style>
