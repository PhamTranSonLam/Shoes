<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h4 class="mb-0">Chỉnh Sửa Khách Hàng</h4>
              <router-link to="/user" class="btn btn-secondary">Quay lại</router-link>
            </div>
            <div class="card-body">
              <form @submit.prevent="submitForm">
                <div class="form-group mb-3">
                  <label for="username">Tên khách hàng</label>
                  <input
                    type="text"
                    v-model="user.username"
                    class="form-control"
                    id="username"
                    placeholder="Nhập tên khách hàng"
                    required
                  />
                </div>
  
                <div class="form-group mb-3">
                  <label for="email">Email</label>
                  <input
                    type="email"
                    v-model="user.email"
                    class="form-control"
                    id="email"
                    placeholder="Nhập email"
                    required
                  />
                </div>
  
                <div class="form-group mb-3">
                  <label for="address">Địa chỉ</label>
                  <input
                    type="text"
                    v-model="user.address"
                    class="form-control"
                    id="address"
                    placeholder="Nhập địa chỉ"
                    required
                  />
                </div>
                <div class="form-group mb-3">
                  <label for="address">Password</label>
                  <input
                    type="text"
                    v-model="user.password"
                    class="form-control"
                    id="password"
                    placeholder="Nhập địa chỉ"
                    required
                  />
                </div>
  
                <div class="form-group mb-3">
                  <label for="phone">Số điện thoại</label>
                  <input
                    type="text"
                    v-model="user.phone"
                    class="form-control"
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>
  
                <div class="form-group text-center">
                  <button type="submit" class="btn btn-add">
                    Cập Nhật Khách Hàng
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        user: {
          username: '',
          email: '',
          address: '',
          phone: ''
        }
      };
    },
    methods: {
      async getUser() {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/auth/${this.$route.params.id}`
          );
          if (response.data) {
            // Gán các trường từ dữ liệu trả về
            this.user = {
              username: response.data.username || '',
              email: response.data.email || '',
              address: response.data.address || '',
              phone: response.data.phone || ''
            };
          } else {
            console.error('Dữ liệu không hợp lệ:', response.data);
          }
        } catch (error) {
          console.error('Lỗi khi tải thông tin khách hàng:', error);
        }
      },
      async submitForm() {
        const userId = this.$route.params.id; // Lấy ID khách hàng từ router
        try {
          // Chỉ cập nhật các trường cần thiết
          await axios.put(`http://localhost:5000/api/auth/update/${userId}`, {
            username: this.user.username,
            email: this.user.email,
            phone: this.user.phone,
            address: this.user.address
          });
          alert('Thông tin khách hàng đã được cập nhật thành công');
          this.$router.push('/user');
        } catch (error) {
          console.error('Lỗi khi cập nhật khách hàng:', error);
        }
      }
    },
    mounted() {
      this.getUser(); // Fetch user details when the page is loaded
    }
  };
  </script>
  
  <style scoped>
  /* Styling như cũ */
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .card {
    border: none;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .card-header {
    background-color: #f8f9fa;
    color: #333;
    padding: 15px;
    font-size: 1.25rem;
    border-bottom: 2px solid #28a745;
  }
  
  .card-body {
    padding: 20px;
  }
  
  .form-group label {
    font-weight: bold;
  }
  
  .form-control {
    height: 45px;
    border-radius: 8px;
    border: 1px solid #ccc;
    padding-left: 15px;
    transition: border-color 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .form-control:focus {
    border-color: #28a745;
    box-shadow: 0 0 8px rgba(40, 167, 69, 0.25);
  }
  
  .btn-add {
    background-color: #28a745;
    border-color: #28a745;
    font-weight: bold;
    color: white;
  }
  
  .btn-add:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    color: white;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
  }
  
  @media (max-width: 768px) {
    .form-group {
      margin-bottom: 15px;
    }
  
    .btn {
      font-size: 0.85rem;
      padding: 10px 20px;
    }
  }
  </style>
  