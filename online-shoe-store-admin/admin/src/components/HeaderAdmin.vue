<template>
  <div class="main--content">
    <div class="header--wrapper">
      <div class="header--title">
        <span>Primary</span>
        <h2>Dashboard</h2>
      </div>
      <!-- Kiểm tra nếu người dùng chưa đăng nhập -->
      <div v-if="!isLoggedIn">
        <!-- Nút điều hướng đến trang Đăng ký -->
        <router-link to="/register" class="btn btn-primary">Register</router-link>
        <!-- Nút điều hướng đến trang Đăng nhập -->
        <router-link to="/login" class="btn btn-info">Login</router-link>
      </div>
      <!-- Hiển thị menu dropdown nếu người dùng đã đăng nhập -->
      <div v-else class="dropdown">
        
        <a class="btn btn-info dropdown-toggle" href="#" role="button" id="dropdownMenuLink" 
          data-bs-toggle="dropdown" aria-expanded="false"> Welcome {{ username }}
          <img src="../assets/img/gir_dp2.jpg" alt="User image" class="user-img">
        </a>
        <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <li>
            <router-link to="/accountinformation">
              <a class="dropdown-item" href="#">Thông tin cá nhân</a>
            </router-link>
          </li>
          <li>
            <a class="dropdown-item" @click="logout" href="#">Đăng xuất</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useUserStore } from '../store/user'; // Import store Pinia cho user
import router from '../router';

export default {
  setup() {
    const userStore = useUserStore(); // Lấy userStore từ Pinia

    // Sử dụng computed để lấy trạng thái đăng nhập và thông tin người dùng
    const isLoggedIn = computed(() => !!userStore.user);
    const username = computed(() => userStore.user?.username || 'Người dùng');
    const userImage = computed(() => userStore.user?.profileImage || '../assets/img/default_user.jpg');

    // Hàm đăng xuất
    const logout = () => {
      userStore.logout();
      router.push('/login');
    }

    return {
      isLoggedIn,
      username,
      userImage,
      logout,
    };
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
