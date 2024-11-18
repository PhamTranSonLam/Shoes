<template>
  <div class="sidebar" :class="{ expanded: isExpanded }" @click="toggleSidebar">
    <div class="logo">
      <img src="../assets/img/girl_dp1.jpg" alt="Logo" />
    </div>
    <ul class="menu">
      <li>
        <router-link to="/">
          <i class="fas fa-house"></i>
          <span>Trang Chủ</span>
        </router-link>
      </li>
      <li>
        <router-link to="/Productmanagement">
          <i class="fa-solid fa-calendar-days"></i>
          <span>Quản lý sản phẩm</span>
        </router-link>
      </li>
      <li>
        <router-link to="/Category">
          <i class="fa-solid fa-calendar-days"></i>
          <span>Quản lý danh mục</span>
        </router-link>
      </li>
      <li>
        <router-link to="/order">
          <i class="fa-regular fa-clipboard"></i>
          <span>Quản lý đơn hàng</span>
        </router-link>
      </li>
      <li>
        <router-link to="/user">
          <i class="fas fa-users"></i>
          <span>Quản lý khách hàng</span>
        </router-link>
      </li>
      <li>
        <router-link to="/staff">
          <i class="fas fa-user-tie"></i>
          <span>Quản lý Nhân Viên</span>
        </router-link>
      </li>
      <li>
        <router-link to="/review">
          <i class="fas fa-question-circle"></i>
          <span>Quản lý đánh giá</span>
        </router-link>
      </li>
      <li>
        <router-link to="/contact">
          <i class="fas fa-paint-brush"></i>
          <span>Quản lý liên lạc</span>
        </router-link>
      </li>
      <li>
        <router-link to="/voucher">
          <i class="fas fa-paint-brush"></i>
          <span>Quản lý khuyến mãi</span>
        </router-link>
      </li>
      <li>
        <router-link to="/warehouse">
          <i class="fas fa-paint-brush"></i>
          <span>Quản lý kho hàng</span>
        </router-link>
      </li>
      <li class="logout">
        <a href="#">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isExpanded: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isExpanded = !this.isExpanded;
    },
  },
};
</script>

<style scoped>
/* General Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Sidebar Container */
.sidebar {
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: 80px; /* Default width */
  background: linear-gradient(145deg, #0077b6, #00b4d8);
  padding: 1rem;
  overflow: hidden;
  transition: width 0.4s ease, padding 0.4s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 999; /* Always above other content */
}

/* Expanded Sidebar */
.sidebar.expanded {
  width: 260px; /* Expanded width */
}

/* Logo Section */
.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px;
  transition: all 0.3s ease;
}

.logo img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.logo img:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

/* Menu Styling */
.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  margin-bottom: 1rem;
  transition: transform 0.3s ease, background 0.3s ease;
}

.menu li:hover {
  transform: translateX(10px);
}

.menu a {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem 1rem;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, color 0.3s ease;
}

.menu a i {
  font-size: 1.5rem;
  transition: font-size 0.4s ease;
}

.menu a span {
  display: none; /* Hide text initially */
}

.sidebar.expanded .menu a span {
  display: inline; /* Show text when expanded */
}

.menu a:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Logout Styling */
.logout {
  margin-top: auto;
}

.logout a {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e63946;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.logout a:hover {
  background: #ff4d4d;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar {
    width: 60px; /* Smaller sidebar for mobile */
  }
  .sidebar.expanded {
    width: 200px;
  }
}
</style>
