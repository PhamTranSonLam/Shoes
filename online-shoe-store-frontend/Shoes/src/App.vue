<template>
    <section>
      <nav>
        <div class="logo">
          <h1>Shoe<span>s</span></h1>
        </div>
        <ul>
          <li><router-link to='/Home'>Home</router-link></li>
          <li><router-link to='/Products'>Products</router-link></li>
          <li><router-link to='/About'>About</router-link></li>
          <li><router-link to='/review'>Review</router-link></li>
          <li><router-link to='/Services'>Services</router-link></li>
        </ul>
        <div class="icons">
          <i class="fa-solid fa-heart"></i>
          <router-link to="/Cart">
            <i class="fa-solid fa-cart-shopping"></i>
          </router-link>
          <div v-if="username" class="user-link" @click="toggleDropdown">
            <img class="user-img" src="../src/assets/img/gir_dp3.jpg" alt="User Image">
            <span>{{ username.username  }}</span>
            <div v-if="isDropdownVisible" class="logout bg-light p-2 border shadow">
              <p><router-link to="/accountinformation" class="info">Account information</router-link></p>
              <p><router-link to="/Orderhistory" class="text-dark">Order history</router-link></p>
              <p @click="logout">Logout</p>
            </div>
          </div>
          <div v-if="!username">
            <router-link to="/auth/login" class="auth-button">Đăng Nhập</router-link>
            <router-link to="/auth/register" class="auth-button register">Đăng Ký</router-link>
          </div>
        </div>
      </nav>
      <main>
        <router-view @user-logged-in="loadUser"></router-view>
      </main>
      <footer>
        <div class="footer_main">
          <div class="tag">
            <h1>Contact</h1>
            <a href="#"><i class="fa-solid fa-house"></i>123/Colombo/Sri Lanka</a>
            <a href="#"><i class="fa-solid fa-phone"></i>+94 12 345 6789</a>
            <a href="#"><i class="fa-solid fa-envelope"></i>contact@gmail.com</a>
          </div>
          <div class="tag">
            <h1>Get Help</h1>
            <a href="#" class="center">FAQ</a>
            <a href="#" class="center">Shipping</a>
            <a href="#" class="center">Returns</a>
            <a href="#" class="center">Payment Options</a>
          </div>
          <div class="tag">
            <h1>Our Stores</h1>
            <a href="#" class="center">Sri Lanka</a>
            <a href="#" class="center">USA</a>
            <a href="#" class="center">India</a>
            <a href="#" class="center">Japan</a>
          </div>
          <div class="tag">
            <h1>Follow Us</h1>
            <div class="social_link">
              <a href="#"><i class="fa-brands fa-facebook"></i>FAQ</a>
              <a href="#"><i class="fa-brands fa-twitter"></i>FAQ</a>
              <a href="#"><i class="fa-brands fa-instagram"></i>FAQ</a>
              <a href="#"><i class="fa-brands fa-linkedin"></i>FAQ</a>
            </div>
          </div>
          <div class="tag">
            <h1>Newsletter</h1>
            <div class="search_bar">
              <input type="text" placeholder="Your email id here">
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>
      </footer>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  import { useUserStore } from './store/user';
  
  export default {
    name: 'App',
    data() {
      return {
        userStore: useUserStore(),
        user: null,
        isDropdownVisible: false,
      };
    },
    computed: {
        username() {
            return this.userStore.user; // Access username directly from the userStore
        }
  },
    mounted() {
      this.loadUser();
    },
    methods: {
      async loadUser() {
        if (this.userStore.user) {
          this.user = this.userStore.user;
        } else {
          await this.getUser();
        }
      },
      async logout() {
        await this.userStore.logout();
        this.user = null;
        this.isDropdownVisible = false;
        this.$router.push('/auth/login');
      },
      toggleDropdown() {
        this.isDropdownVisible = !this.isDropdownVisible;
      },
      async getUser() {
        try {
          const userId = this.userStore.user?._id;
          if (userId) {
            const response = await axios.get(`http://localhost:5000/api/authadmin/${userId}`, {
              headers: {
                Authorization: `Bearer ${this.userStore.token}`,
              },
            });
            if (response.status === 200) {
              this.user = response.data;
              this.userStore.user = response.data;
            }
          }
        } catch (error) {
          console.error('Error updating account information:', error);
        }
      },
    },
  };
  </script>
  
  
  <style>
  .user-link {
    position: relative;
    display: inline-block;
    padding: 10px;
    color: black;
    text-decoration: none;
  }
  
  .logout {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    border: 1px solid #ddd;
    padding: 10px;
    z-index: 10;
  }
  
  .user-link:hover .logout {
    display: block;
  }
 /* Đặt lại các thuộc tính cơ bản */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

html {
  scroll-behavior: smooth;
}

section {
  width: 100%;
  min-height: 20px;
  height: fit-content;
}

/* Thanh điều hướng */
section nav {
  display: flex;
  align-items: center;
  justify-content: space-around;
  background: white;
  padding: 10px 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
}

/* Logo */
section nav .logo {
  font-size: 35px;
  color: #c72092;
  margin: 5px 0;
  cursor: pointer;
}

section nav .logo span {
  color: #6c14d0;
  text-decoration: underline;
}

/* Liên kết trong thanh điều hướng */
section nav ul {
  list-style: none;
}

section nav ul li {
  display: inline-block;
  margin: 5px 15px;
}

section nav ul li a {
  text-decoration: none;
  color: black;
  transition: color 0.2s;
}

section nav ul li a:hover {
  color: #c72092;
}

/* Biểu tượng và liên kết người dùng */
section nav .icons {
  display: flex;
  align-items: center;
  gap: 20px;
}

section nav .icons i {
  cursor: pointer;
  font-size: 20px;
  color: #333;
  transition: color 0.3s ease;
}

section nav .icons i:hover {
  color: #c72092;
}

/* Ảnh đại diện người dùng */
.user-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

/* Menu thả xuống của người dùng */
.user-link {
  position: relative;
  color: black;
  text-decoration: none;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
}

.logout {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  min-width: 160px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.user-link:hover .logout {
  display: block;
}

/* Nút đăng nhập và đăng ký */
.auth-buttons {
  display: flex;
  gap: 1rem;
}

.auth-button {
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.auth-button:hover {
  background-color: #0056b3;
}

/* Phần nội dung chính */
main {
  margin-top: 20px;
  padding-bottom: 20px;
}

/* Chân trang */
footer {
  background-color: #f8f9fa;
  padding: 20px 0;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

/* Bố cục chính trong footer */
.footer_main {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
}

.tag {
  flex: 1;
  margin: 0 20px;
}

.tag h1 {
  font-size: 20px;
  margin-bottom: 10px;
}

/* Liên kết trong footer */
.tag a {
  display: block;
  color: #333;
  text-decoration: none;
  margin: 5px 0;
  transition: color 0.3s;
}

.tag a:hover {
  color: #c72092;
}

/* Liên kết mạng xã hội */
.social_link {
  display: flex;
  gap: 10px;
}

/* Thanh tìm kiếm trong phần bản tin */
.search_bar {
  display: flex;
}

.search_bar input {
  border: 1px solid #ddd;
  padding: 5px;
  flex: 1;
}

.search_bar button {
  background-color: #c72092;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.search_bar button:hover {
  background-color: #a5007d;
}

  </style>
  