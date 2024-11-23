<template>
  <section>
    <nav>
      <!-- Navigation Bar -->
      <div class="logo">
        <h1>L.Shoe<span>s</span></h1>
      </div>
      <ul>
        <li><router-link to='/Home'>Trang chủ</router-link></li>
        <li><router-link to='/Products'>Sản Phẩm</router-link></li>
        <li><router-link to='/About'>Giới thiệu</router-link></li>
        <li><router-link to='/review'>Đánh giá</router-link></li>
        <li><router-link to='/Services'>Dịch vụ</router-link></li>
      </ul>
      <div class="icons">
        <i class="fa-solid fa-heart"></i>
        <router-link to="/Cart">
          <i class="fa-solid fa-cart-shopping"></i>
        </router-link>
        <div v-if="username" class="user-link" @click="toggleDropdown">
          <img class="user-img me-2" :src="`http://localhost:5000/uploads/${item.image}`" alt="User Image">
          <span>{{ username.username }}</span>
          <div v-if="isDropdownVisible" class="logout bg-light p-2 border shadow">
            <p><router-link to="/accountinformation" class="info">Thông tin tài khoản</router-link></p>
            <p><router-link to="/Orderhistory" class="text-dark">Lịch sử đơn hàng</router-link></p>
            <p class="text-dark" @click="showChangePasswordModal">Đổi mật khẩu</p>
            <p @click="logout">Đăng xuất</p>
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
      <!-- Footer Section -->
      <div class="footer_main">
        <!-- Footer Links and Content -->
        <div class="tag">
          <h1>Liên hệ</h1>
          <a href="#"><i class="fa-solid fa-house"></i>123/Colombo/Sri Lanka</a>
          <a href="#"><i class="fa-solid fa-phone"></i>+94 12 345 6789</a>
          <a href="#"><i class="fa-solid fa-envelope"></i>contact@gmail.com</a>
        </div>
        <div class="tag">
          <h1>Hỗ trợ</h1>
          <a href="#" class="center">Câu hỏi thường gặp</a>
          <a href="#" class="center">Vận chuyên</a>
          <a href="#" class="center">Trả hàng</a>
          <a href="#" class="center">Phương thức thanh toán</a>
        </div>
        <div class="tag">
          <h1>Cửa hàng của chúng tôi</h1>
          <a href="#" class="center">Sri Lanka</a>
          <a href="#" class="center">USA</a>
          <a href="#" class="center">India</a>
          <a href="#" class="center">Japan</a>
        </div>
        <div class="tag">
          <h1>Theo giỏi chúng tôi</h1>
          <div class="social_link">
            <a href="#"><i class="fa-brands fa-facebook"></i>FAQ</a>
            <a href="#"><i class="fa-brands fa-twitter"></i>FAQ</a>
            <a href="#"><i class="fa-brands fa-instagram"></i>FAQ</a>
            <a href="#"><i class="fa-brands fa-linkedin"></i>FAQ</a>
          </div>
        </div>
        <div class="tag">
          <h1>Bản tin</h1>
          <div class="search_bar">
            <input type="text" placeholder="Your email id here">
            <button type="submit">Đăng ký</button>
          </div>
        </div>
      </div>
    </footer>

    <!-- Modal for Changing Password -->
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="changePasswordLabel">Change Password</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="changePassword">
              <div class="mb-3">
                <label for="oldPassword" class="col-form-label">Old Password:</label>
                <input type="password" class="form-control" id="oldPassword" v-model="oldPassword">
              </div>
              <div class="mb-3">
                <label for="newPassword" class="col-form-label">New Password:</label>
                <input type="password" class="form-control" id="newPassword" v-model="newPassword">
              </div>
              <div class="mb-3">
                <label for="confirmPassword" class="col-form-label">Confirm New Password:</label>
                <input type="password" class="form-control" id="confirmPassword" v-model="confirmPassword">
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" class="btn btn-primary">Change Password</button>
              </div>
            </form>
            <div v-if="notification.message" :class="`alert alert-${notification.type}`">
              {{ notification.message }}
            </div>
          </div>
        </div>
      </div>
    </div>
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
      isDropdownVisible: false,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      notification: {
        message: '',
        type: ''
      },
      item:[],
    };
  },
  computed: {
    username() {
      return this.userStore.user;
    },

  },
  methods: {
    toggleDropdown() {
      this.isDropdownVisible = !this.isDropdownVisible;
    },
    async loadUser() {
      if (this.userStore.user) {
        return;
      }
      await this.userStore.getUser();
    },
    async logout() {
      await this.userStore.logout();
      this.$router.push('/auth/login');
    },
    showChangePasswordModal() {
      const modal = new bootstrap.Modal(document.getElementById('changePasswordModal'));
      modal.show();
    },
    async changePassword() {
      try {
        if (this.newPassword !== this.confirmPassword) {
          this.notification.message = 'Mật khẩu không khớp!';
          this.notification.type = 'danger';
          return;
        }
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:5000/api/auth/change-password',
          {
            userId: this.userStore.user._id,
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        this.notification.message = response.data.message || 'Đổi mật khẩu thành công!';
        this.notification.type = 'success';
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.$router.push('/home')
      } catch (error) {
        this.notification.message = error.response?.data?.message || 'Đổi mật khẩu thất bại!';
        this.notification.type = 'danger';
      }
    },
    async getByUser() {
      try {
        const userId = this.userStore.user._id;
        console.log(userId)
        const response = await axios.get(`http://localhost:5000/api/auth/${userId}`);
        this.item = response.data;
        console.log(this.item)
      } catch (error) {
        
      }
    }
  },
  mounted() {
    this.getByUser();
  }
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
  font-family: "Afacad Flux", sans-serif;
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
  