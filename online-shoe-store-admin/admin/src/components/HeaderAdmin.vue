<template>
  <div class="main--content">
    <div class="header--wrapper">
      <div class="header--title">
        <span>Primary</span>
        <h2>Dashboard</h2>
      </div>
      <!-- Kiểm tra nếu người dùng chưa đăng nhập -->
      <div v-if="!username">
        <!-- Nút điều hướng đến trang Đăng ký -->
        <router-link to="/register" class="btn btn-primary">Register</router-link>
        <!-- Nút điều hướng đến trang Đăng nhập -->
        <router-link to="/login" class="btn btn-info">Login</router-link>
      </div>
      <!-- Hiển thị menu dropdown nếu người dùng đã đăng nhập -->
      <div v-else class="dropdown">
        <a class="btn btn-info dropdown-toggle" href="#" role="button" id="dropdownMenuLink" 
          data-bs-toggle="dropdown" aria-expanded="false"> 
          Welcome {{ item.username }}
          <img :src="`http://localhost:5000/uploads/${item.image}`" alt="User image" class="user-img">
        </a>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <li>
            <router-link to="/accountinformation">
              <a class="dropdown-item" href="#">Thông tin cá nhân</a>
            </router-link>
          </li>
          <a class="dropdown-item" @click="showChangePasswordModal">Đổi mật khẩu</a>
          <li>
            <a class="dropdown-item" @click="logout" href="#">Đăng xuất</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

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
</template>

<script>
import { useUserStore } from '../store/user'; // Import store Pinia cho user
import axios from 'axios';
import router from '../router';

export default {
  data() {
    return {
      userStore: useUserStore(),
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      notification: {
        message: '',
        type: ''
      },
      item:[],
      username: '', // Declare username here
      userImage: '', // Declare userImage here (replace with actual logic)
    };
  },
  computed: {
    username() {
      return this.userStore.user;
    },
  },
  methods: {
    async loadUser() {
      if (this.userStore.user) {
        return;
      }
      await this.userStore.getUser();
    },
    async logout() {
      await this.userStore.logout();
      // this.$router.push('/auth/login');
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
        const response = await axios.post('http://localhost:5000/api/authadmin/change-password',
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
      } catch (error) {
        this.notification.message = error.response?.data?.message || 'Đổi mật khẩu thất bại!';
        this.notification.type = 'danger';
      }
    },
    async getByUser() {
      try {
        const userId = this.userStore.user._id;
        console.log(userId)
        const response = await axios.get(`http://localhost:5000/api/authadmin/${userId}`);
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
.btn {
  display: inline-block;
  padding: 12px 25px;
  margin: 5px;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  background-color: rgb(109, 210, 222);
  border: none;
  border-radius: 50px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s, box-shadow 0.3s;
}

.btn:hover {
  background-color: rgb(95, 75, 150);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Nút Đăng ký với màu nền khác */
.btn-primary {
  background-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
}

/* Nút Đăng nhập với màu nền khác */
.btn-info {
  background-color: #17a2b8;
}

.btn-info:hover {
  background-color: #138496;
}

/* Phần nội dung chính */
.main--content {
  position: relative;
  background: #f5f6fa;
  width: 100%;
  padding: 1rem 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* Header wrapper */
.header--wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 10px;
  padding: 15px 30px;
  margin-bottom: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.header--title {
  color: rgb(113, 99, 186);
  font-size: 24px;
  font-weight: bold;
}

.header--title span {
  font-size: 14px;
  color: #6c757d;
}

/* Dropdown User Info */
.dropdown-toggle {
  background-color: #17a2b8;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
}

.dropdown-toggle:hover {
  background-color: #138496;
}

.dropdown-menu {
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
}

.dropdown-item {
  padding: 12px 20px;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #e9ecef;
}

/* User Image Styling */
.user-img {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-left: 10px;
  border: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

</style>
