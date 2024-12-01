<template>
  <!-- Page Header -->
  <section id="page-header">
    <h2>Giỏ hàng của bạn</h2>
    <p>Tất cả sản phẩm đều được giảm giá so với giá gốc</p>
  </section>

  <!-- Cart Section -->
  <section id="cart" class="section-p1">
    <table width="100%">
      <thead>
        <tr>
          <td>XÓA</td>
          <td>HÌNH ẢNH</td>
          <td>SẢN PHẨM</td>
          <td>SIZE</td>
          <td>GIÁ</td>
          <td>SỐ LƯỢNG</td>
          <td>TỔNG CỘNG</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in cartItems" :key="item._id">
          <td>
            <a href="#" @click.prevent="removeFromCart(item._id)">
              <i class="far fa-times-circle"></i>
            </a>
          </td>
          <td>
            <img v-if="item.product" :src="item.mainImage" :alt="item.product.name" class="img-fluid bg-light" />
          </td>
          <td>{{ item.product.name }}</td>
          <td>{{ item.size }}</td>
          <td>{{ formatPrice(item.product.price) }}</td>
          <td>
            <input
              type="number"
              v-model.number="item.quantity"
              @change="updateQuantity(item._id, item.quantity)"
              min="1"
              :max="item.max"
            />
          </td>
          <td>{{ formatPrice(item.product.price * item.quantity) }}</td>
        </tr>
      </tbody>
    </table>
  </section>

  <!-- Coupon and Cart Totals Section -->
  <section id="cart-add" class="section-p1">
    <div id="subtotal">
      <h3>Tổng giỏ hàng</h3>
      <table>
        <tr>
          <td>Tổng giỏ hàng</td>
          <td>{{ formatPrice(cartTotal) }}</td>
        </tr>
        <tr>
          <td>Phí vận chuyển</td>
          <td>Miễn phí</td>
        </tr>
        <tr>
          <td><strong>Tổng cộng</strong></td>
          <td><strong>{{ formatPrice(cartTotal) }}</strong></td>
        </tr>
      </table>

      <RouterLink to="/checkout">
        <button class="normal" @click="checkout" :disabled="cartItems.length === 0">Tiến hành thanh toán</button>
      </RouterLink>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import { useUserStore } from "../store/user";

export default {
  data() {
    return {
      cartItems: [],
      UserStore: useUserStore(),
      discount: 50000, // Example discount, adjust as needed
      productQuantities: []
    };
  },
  computed: {
    cartTotal() {
      return this.cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    },
    finalTotal() {
      return Math.max(this.cartTotal - this.discount, 0); // Ensure total is not negative
    },
  },
  mounted() {
    this.fetchCartItems();
  },
  methods: {
    // async fetchProductDetails(item, index) {
    //   console.log(item)
    //   try {
    //     const response = await axios.get(`http://localhost:5000/api/product/${item.product?._id}`);
    //     const product = response.data;

    //     // Tìm kích thước phù hợp và lấy số lượng
    //     const sizeDetail = product.sizes.find((element) => element.size === item.size);
    //     const quantity = sizeDetail ? sizeDetail.quantity : 0;
    //     console.log('chạy: ' + quantity)
    //     // Lưu trữ số lượng vào productQuantities
    //     this.productQuantities = [...this.productQuantities, quantity];
    //   } catch (error) {
    //     console.error("Lỗi khi tải chi tiết sản phẩm:", error);
    //   }
    // },

    async fetchCartItems() {
      try {
        const userId = this.UserStore.user._id;
        const response = await axios.get(`http://localhost:5000/api/cart/${userId}`, {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`,
          },
        });
        this.cartItems = response.data.items || [];
        console.log(response.data.items)
        this.cartItems.forEach((item, index) => {
          const size = item.product.sizes.filter(it => it.size == item.size);
          this.cartItems[index].max = item.quantity + size[0].quantity;
        });
        
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
      }
    },
    async removeFromCart(productId) {
      const confirmation = confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
      if (!confirmation) return;

      try {
        await axios.delete(`http://localhost:5000/api/cart/remove/${productId}`, {
          headers: {
            Authorization: `Bearer ${this.UserStore.token}`,
          },
        });
        this.fetchCartItems();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
      }
    },
    async updateQuantity(productId, quantity) {
      const product = this.cartItems.find((item) => item._id === productId);

      // Kiểm tra số lượng không được vượt quá tồn kho
      if (quantity > product.product.quantity) {
        alert(`Số lượng không được vượt quá tồn kho: ${product.product.quantity}`);
        this.cartItems = this.cartItems.map((item) =>
          item._id === productId ? { ...item, quantity: product.product.quantity } : item
        );
        return;
      }

      if (quantity < 1) {
        alert("Số lượng không thể nhỏ hơn 1!");
        this.cartItems = this.cartItems.map((item) =>
          item._id === productId ? { ...item, quantity: 1 } : item
        );
        return;
      }

      try {
        await axios.put(
          `http://localhost:5000/api/cart/update/${productId}`,
          { quantity },
          {
            headers: {
              Authorization: `Bearer ${this.UserStore.token}`,
            },
          }
        );
        this.fetchCartItems();
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng:", error);
      }
    },
    formatPrice(value) {
      return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    },
    checkout() {
      this.$router.push({ name: "Checkout" });
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
  padding: 15px 30px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
}

#coupon button:hover, #subtotal button:hover {
  background-color: #9c22d4;
}

#subtotal table {
  width: 100%;
}

#subtotal table td {
  padding: 12px 0;
  text-align: left;
}

#subtotal table td:nth-child(2) {
  text-align: right;
}

#subtotal table td strong {
  font-size: 18px;
}
</style>
