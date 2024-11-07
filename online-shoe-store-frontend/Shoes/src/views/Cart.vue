<template>
  <!-- Page Header -->
  <section id="page-header">
    <h2>Your Cart</h2>
    <p>All products are marked down from their original prices</p>
  </section>

  <!-- Cart Section -->
  <section id="cart" class="section-p1">
    <table width="100%">
      <thead>
        <tr>
          <td>REMOVE</td>
          <td>IMAGE</td>
          <td>PRODUCT</td>
          <td>SIZE</td> 
          <td>COLOR</td>
          <td>PRICE</td>
          <td>QUANTITY</td>
          <td>SUBTOTAL</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cartItems" :key="item._id">
          <td>
            <a href="#" @click.prevent="removeFromCart(item._id)">
              <i class="far fa-times-circle"></i>
            </a>
          </td>
          <td><img v-if="item.product" :src="`http://localhost:5000/${item.product.imageUrl}`" alt="Product Image" class="img-fluid bg-light" /></td>
          <td>{{ item.product.name }}</td>
          <td>{{ item.size }}</td>
          <td>{{ item.color }}</td>
          <td>{{ formatPrice(item.product.price) }}</td>
          <td>
            <input type="number" v-model.number="item.quantity" @change="updateQuantity(item._id, item.quantity)" min="1" />
          </td>
          <td>{{ formatPrice(item.product.price * item.quantity) }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- Coupon and Cart Totals Section -->
  <section id="cart-add" class="section-p1">
    <div id="coupon">
      <h3>Apply Coupon</h3>
      <input type="text" placeholder="Enter Your Coupon" />
      <button class="normal">Apply</button>
    </div>

    <div id="subtotal">
      <h3>Cart Totals</h3>
      <table>
        <tr>
          <td>Cart Subtotal</td>
          <td>{{ formatPrice(cartTotal) }}</td>
        </tr>
        <tr>
          <td>Shipping</td>
          <td>Free</td>
        </tr>
        <tr>
          <td><strong>Totals</strong></td>
          <td><strong>{{ formatPrice(cartTotal) }}</strong></td>
        </tr>
      </table>

      <RouterLink to="/checkout">
        <button class="normal" @click="checkout">Proceed to checkout</button>
      </RouterLink>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/user';

export default {
  data() {
    return {
      cartItems: [],
      UserStore: useUserStore(),
    };
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    },
  },
  mounted() {
    this.fetchCartItems();
    this.fetchColors();
  },
  methods: {
    async fetchCartItems() {
      try {
        const userId = this.UserStore.user._id;
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`,
          },
        });
        this.cartItems = response.data.items || []; // Ensure cartItems is always an array
        // console.log(this.cartItems);
        // let newCart = [];
        // for(let item in this.cartItems) {
        //   const response = await axios.get(`http://localhost:5000/api/product/${item.product}`, {
        //     headers: {
        //     Authorization: `Bearer ${this.UserStore.token}`,
        //     },
        //   });
        //   newCart.push(response.data);
        // }
        // console.log(newCart)
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    async removeFromCart(productId) {
      try {
        await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`,
          },
        });
        this.fetchCartItems();
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    },
    async fetchColors() {
        try {
          const response = await axios.get('http://localhost:5000/api/color');
          this.product.color = response.data;
        } catch (error) {
          console.error('Error fetching colors:', error);
        }
      },
    async updateQuantity(productId, quantity) {
      if (quantity < 1) return; // Prevent invalid quantities
      try {
        await axios.put(`http://localhost:5000/api/cart/update/${productId}`, { quantity }, {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`,
          },
        });
        this.fetchCartItems();
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    formatPrice(value) {
      return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }); // Corrected locale
    },
    checkout() {
      this.$router.push({ name: 'Checkout' });
    },
  },
};
</script>


<style>
/* Page header styling */
#page-header {
  background-image: url(../assets/img/S3.gif);
  width: 100%;
  height: 40vh;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;
  padding: 14px;
}

#page-header h2 {
  color: white;
  font-size: 48px;
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  margin: 0;
}

#page-header p {
  color: white;
  font-size: 20px;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  margin: 10px 0 0;
}

/* Cart section styling */
#cart {
  overflow-x: auto;
  padding: 40px;
  display: flex;
  justify-content: center;
  background-color: #f8f9fa;
}

#cart table {
  width: 90%;
  max-width: 1200px;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

#cart table thead {
  background: linear-gradient(45deg, #6c14d0, #c72092);
  color: white;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
}

#cart table thead td {
  padding: 20px 15px;
}

#cart table tbody td {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #e2e9e1;
}

#cart table img {
  width: 80px;
  border-radius: 8px;
  transition: transform 0.3s;
}

#cart table img:hover {
  transform: scale(1.1);
}

#cart table td:nth-child(3) {
  text-align: left;
  font-weight: 500;
}

#cart table td i {
  color: white;
  background-color: #ff3e43;
  padding: 10px;
  font-size: 20px;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

#cart table td i:hover {
  background-color: #d32f2f;
}

#cart table input {
  width: 60px;
  padding: 10px;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  font-size: 16px;
  transition: border 0.3s ease;
}

#cart table input:focus {
  border: 1px solid #6c14d0;
}

/* Coupon and Totals section */
#cart-add {
  display: flex;
  justify-content: space-between;
  padding: 40px;
  flex-wrap: wrap;
}

#coupon, #subtotal {
  width: 45%;
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

#coupon h3, #subtotal h3 {
  margin-bottom: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #6c14d0;
}

#coupon input {
  padding: 12px;
  width: 60%;
  margin-right: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border 0.3s ease;
}

#coupon input:focus {
  border-color: #6c14d0;
}

#coupon button, #subtotal button {
  background: linear-gradient(45deg, #c72092, #6c14d0);
  color: white;
  padding: 12px 30px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
  border: none;
}

#coupon button:hover, #subtotal button:hover {
  background: linear-gradient(45deg, #6c14d0, #c72092);
}

#subtotal table {
  width: 100%;
  margin-bottom: 20px;
}

#subtotal table td {
  padding: 12px;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
}

#subtotal table td:last-child {
  font-weight: bold;
  text-align: right;
}

/* Responsive adjustments */
@media screen and (max-width: 768px) {
  #cart table {
    width: 100%;
  }

  #cart-add {
    flex-direction: column;
  }

  #coupon, #subtotal {
    width: 100%;
  }
}

</style>
