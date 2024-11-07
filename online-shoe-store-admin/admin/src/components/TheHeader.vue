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
        <router-link to="/color">
          <i class="fas fa-paint-brush"></i>
          <span>Quản lý màu sắc</span>
        </router-link>
      </li>
      <li>
        <router-link to="/contact">
          <i class="fas fa-paint-brush"></i>
          <span>Quản lý liên lạc</span>
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.sidebar {
  position: sticky;
  top: 0;
  left: 0;
  height: 100vh;
  width: 80px; /* Độ rộng khi thu gọn */
  background: linear-gradient(145deg, #0077b6, #00b4d8);
  padding: 1rem;
  overflow: hidden;
  transition: width 0.4s ease, padding 0.4s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.sidebar.expanded {
  width: 260px; /* Độ rộng khi mở rộng */
  padding: 1rem;
}

.logo {
  display: flex;
  justify-content: center; /* Canh giữa logo */
  margin-bottom: 0.5rem; /* Giảm khoảng cách dưới logo */
  padding: 5px; /* Giảm khoảng đệm để giảm kích thước không gian quanh logo */
  border-radius: 10px; /* Bo góc cho khung chứa logo */
  background: rgba(255, 255, 255, 0.1); /* Thêm nền mờ cho logo */
}

.logo img {
  width: 50px; /* Giảm kích thước logo */
  height: 50px; /* Đảm bảo tỷ lệ là hình vuông */
  border-radius: 50%; /* Để tạo hiệu ứng hình tròn cho logo */
  border: 2px solid #ffffff; /* Viền trắng cho logo */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Thêm bóng cho logo */
  transition: transform 0.3s ease; /* Thêm hiệu ứng mượt mà khi hover */
}

.logo img:hover {
  transform: scale(1.05); /* Tăng kích thước logo một chút khi hover */
}


.menu {
  list-style: none;
  padding: 0;
}

.menu li {
  margin-bottom: 1rem;
  transition: transform 0.3s ease, background 0.3s ease;
}

.menu li:hover {
  transform: translateX(5px); /* Nâng lên khi hover */
}

.menu a {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
  transition: background 0.3s ease, color 0.3s ease, transform 0.3s ease;
}

.menu a i {
  font-size: 1.2rem;
  transition: font-size 0.4s ease; /* Giúp biểu tượng thay đổi kích thước mượt mà */
}

.menu a span {
  display: none; /* Ẩn văn bản khi sidebar thu gọn */
  transition: opacity 0.3s ease;
}

.sidebar.expanded .menu a span {
  display: inline; /* Hiện văn bản khi mở rộng */
}

.menu li.active a {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.menu a:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(10px);
}

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

.menu a,
.logout a {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
