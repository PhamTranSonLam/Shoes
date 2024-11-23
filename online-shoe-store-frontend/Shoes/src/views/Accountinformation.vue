<template>
  <section class="body" id="account-info">
    <div class="account-container">
      <h2>Tài khoản cá nhân</h2>

      <form @submit.prevent="updateAccount">
        <div class="form-group">
          <label for="username">Tên</label>
          <input type="text" v-model="user.username" id="username" required />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" v-model="user.email" id="email" required />
        </div>

        <div class="form-group">
          <label for="address">Địa chỉ</label>
          <input type="text" v-model="user.address" id="address" required />
        </div>

        <div class="form-group">
          <label for="phone">SĐT</label>
          <input type="text" v-model="user.phone" id="phone" required />
        </div>

        <div class="form-group">
          <label for="image">Ảnh đại diện</label>
          <input type="file" @change="onFileChange" id="image" />
        </div>

        <div class="profile-picture-preview">
          <img :src="`http://localhost:5000/uploads/${user.image}`" alt="Ảnh đại diện" v-if="user.image" />
        </div>

        <button type="submit">Cập nhật</button>
      </form>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/user';

export default {
  data() {
    return {
      user: {
        username: '',
        email: '',
        address: '',
        phone: '',
        image: '', // URL ảnh hiện tại
      },
      image: null, // File ảnh mới tải lên
    };
  },
  computed: {
    currentUser() {
      return this.UserStore.user;
    },
  },
  mounted() {
    this.getUser();
  },
  methods: {
    async getUser() {
      if (this.currentUser) {
        try {
          const userId = this.currentUser._id;
          const response = await axios.get(`http://localhost:5000/api/auth/${userId}`, {
            headers: {
              Authorization: `Bearer ${this.UserStore.token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          if (response.status === 200) {
            this.user = response.data;
          }
        } catch (error) {
          console.error('Error fetching account information:', error);
        }
      }
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.image = file;

        // Hiển thị ảnh xem trước
        const reader = new FileReader();
        reader.onload = (e) => {
          this.user.image = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async updateAccount() {
  this.isUpdating = true; // Bắt đầu trạng thái cập nhật
  try {
    const userId = this.currentUser._id;

    // Tạo FormData để gửi dữ liệu
    const formData = new FormData();
    formData.append('username', this.user.username);
    formData.append('email', this.user.email);
    formData.append('address', this.user.address);
    formData.append('phone', this.user.phone);
    if (this.image) {
      formData.append('image', this.image);
    }

    const response = await axios.put(
      `http://localhost:5000/api/auth/update/${userId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.UserStore.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.status === 200) {
      alert('Cập nhật thông tin thành công!');
      this.UserStore.update(response.data); // Cập nhật dữ liệu vào Pinia Store
      this.getUser(); // Refresh lại dữ liệu người dùng
    }
  } catch (error) {
    // Hiển thị lỗi cho người dùng
    if (error.response) {
      // Lỗi từ server (400, 500, ...)
      alert(`Lỗi: ${error.response.data.message || 'Cập nhật không thành công.'}`);
    } else if (error.request) {
      // Không nhận được phản hồi từ server
      alert('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
    } else {
      // Lỗi khác
      alert(`Đã xảy ra lỗi: ${error.message}`);
    }
    console.error('Error updating account information:', error);
  } finally {
    this.isUpdating = false; // Kết thúc trạng thái cập nhật
  }
}

  },
  setup() {
    const UserStore = useUserStore();
    return {
      UserStore,
    };
  },
};
</script>



  
  <style scoped>
  .body {
    background-image: url('../assets/img/loging_bg.png'); /* Đường dẫn tới ảnh nền */
  }
  
  #account-info {
    padding: 40px;
    max-width: 600px;
    margin: 100px auto 60px auto;
    background-color: rgba(255, 255, 255, 0.8); /* Đặt màu nền với độ trong suốt để thấy ảnh nền phía sau */
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #333;
    margin-bottom: 25px;
    font-weight: bold;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-size: 1rem;
    color: #333;
  }
  
  .form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    background-color: #f9f9f9;
    transition: border-color 0.3s ease;
  }
  
  .form-group input:focus {
    border-color: #6c14d0;
    outline: none;
  }
  
  button {
    background: linear-gradient(to right, #c72092, #6c14d0);
    color: white;
    padding: 12px 20px;
    border: none;
    border-radius: 8px;
    width: 100%;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  
  button:hover {
    background: #6c14d0;
  }
  
  button:focus {
    outline: none;
  }
  </style>
  