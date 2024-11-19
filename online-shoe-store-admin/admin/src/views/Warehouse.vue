<script setup lang="ts">
import router from '@/router';
</script>

<template>
  <div class="dropdown-group">
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Hàng hóa
      </button>
      <ul class="dropdown-menu">
        <router-link to = '/listproducttype'>
          <li><a class="dropdown-item" href="#">Danh sách loại hàng</a></li>
        </router-link>
        <router-link to = '/listproduct'>
          <li><a class="dropdown-item" href="#">Danh sách hàng hóa</a></li>
        </router-link>
      </ul>
    </div>

    <div class="dropdown">
      <router-link to="/Warehouselist">
        <li><a class="dropdown-item" href="#">Danh sách kho</a></li>
      </router-link>
    </div>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Nhập - Xuất
      </button>
      <ul class="dropdown-menu">
        <router-link to="/import">
          <li><a class="dropdown-item" href="#">Nhập</a></li>
        </router-link>
        <router-link to="/export">
          <li><a class="dropdown-item" href="#">Xuất</a></li>
        </router-link>
        

        <router-link to="/importdetail">
        <li><a class="dropdown-item" href="#">Chi tiết nhập hàng</a></li>
        </router-link>
        <router-link to="/exportdetail">
          <li><a class="dropdown-item" href="#">Chi tiết xuất hàng</a></li>
        </router-link>

      </ul>
    </div>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Cân đối kho
      </button>
    </div>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Nhà cung cấp
      </button>
    </div>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Báo cáo
      </button>
    </div>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        Biến động
      </button>
    </div>
  </div>
  

  <div class="card--container">
    <h3 class="main--title">Today</h3>
    <div class="card--wrapper">
      <div class="payment--card light-red">
        <div class="card--header">
          <div class="amount">
            <span class="title">Sản Phẩm</span>
            <span class="amount--value">123</span>
          </div>
          <i class="fa-solid fa-box icon"></i>
        </div>
        <span class="card--detail">Tổng số sản phẩm hiện có</span>
      </div>

      <div class="payment--card light-purple">
        <div class="card--header">
          <div class="amount">
            <span class="title">Đơn Hàng</span>
            <span class="amount--value">45</span>
          </div>
          <i class="fa-regular fa-clipboard icon dark-purple"></i>
        </div>
        <span class="card--detail">Tổng số đơn hàng đã được đặt</span>
      </div>

      <div class="payment--card light-green">
        <div class="card--header">
          <div class="amount">
            <span class="title">Khách Hàng</span>
            <span class="amount--value">78</span>
          </div>
          <i class="fa-regular fa-address-book icon dark-green"></i>
        </div>
        <span class="card--detail">Tổng số khách hàng đã đăng ký</span>
      </div>

      <div class="payment--card light-blue">
        <div class="card--header">
          <div class="amount">
            <span class="title">Nhân viên</span>
            <span class="amount--value">10</span>
          </div>
          <i class="fas fa-user-tie icon dark-blue"></i>
        </div>
        <span class="card--detail">Tổng số nhân viên hiện có</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Trang chủ */
.card--container {
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Thêm shadow cho độ sâu */
}

.card--wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between; /* Cải thiện khoảng cách giữa các card */
}

.main--title {
  color: rgba(113, 99, 186, 255);
  padding-top: 10px;
  font-size: 18px; /* Tăng kích thước font chữ tiêu đề */
  font-weight: 500;
}

.payment--card {
  background: rgb(229, 223, 223);
  border-radius: 10px;
  padding: 1.5rem;
  width: 280px;
  height: 160px; /* Điều chỉnh chiều cao card */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease-in-out; /* Hiệu ứng mượt khi hover */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* Thêm shadow nhẹ cho các card */
}

.payment--card:hover {
  transform: translateY(-7px); /* Hiệu ứng hover mượt hơn */
}

.card--header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.amount {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 16px;
  font-weight: 400;
  color: #555;
}

.amount--value {
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
}

.icon {
  color: #fff;
  padding: 1rem;
  height: 60px;
  width: 60px;
  text-align: center;
  border-radius: 50%;
  font-size: 1.5rem;
  background: red;
}

.light-red {
  background: rgb(251, 233, 233);
}

.light-purple {
  background: rgb(254, 226, 254);
}

.light-green {
  background: rgb(235, 254, 235);
}

.light-blue {
  background: rgb(236, 236, 254);
}

.dark-red {
  background: red;
}

.dark-purple {
  background: rgb(11, 128, 0);
}

.dark-green {
  background: green;
}

.dark-blue {
  background: blue;
}

/* Các dropdown */
.dropdown {
  margin-bottom: 1rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  font-size: 16px;
}

.dropdown-toggle::after {
  content: none; /* Tắt mũi tên dropdown */
}

/* Thiết kế cho các button */
button {
  padding: 0.5rem 1rem;
  background: #42A5F5;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background: #1E88E5;
}

</style>