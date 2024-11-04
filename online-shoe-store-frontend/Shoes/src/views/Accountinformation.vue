<template>
    <section class="body" id="account-info">
      <div class="account-container">
        <h2>Account Information</h2>
  
        <form @submit.prevent="updateAccount">
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" v-model="user.username" id="username" required />
          </div>
  
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" v-model="user.email" id="email" required />
          </div>
  
          <div class="form-group">
            <label for="address">Address</label>
            <input type="text" v-model="user.address" id="address" required />
          </div>
  
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="text" v-model="user.phone" id="phone" required />
          </div>
  
          <button type="submit">Update Information</button>
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
        },
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
    async  getUser() {
        if (this.currentUser) {
            try {
          const userId = this.currentUser._id;
          const response = await axios.get(`http://localhost:5000/api/auth/${userId}`,  {
            headers: {
              Authorization: `Bearer ${this.UserStore.token}`,
            },
          });
          if (response.status === 200) {
           this.user = response.data
          }
        } catch (error) {
          console.error('Error updating account information:', error);
  
        }
        }
      },
      async updateAccount() {
        try {
          const userId = this.currentUser._id;
          const response = await axios.put(`http://localhost:5000/api/auth/update/${userId}`, this.user, {
            headers: {
              Authorization: `Bearer ${this.UserStore.token}`,
            },
          });
          if (response.status === 200) {
            alert('Account information updated successfully!');
            this.UserStore.update(response.data);
            this.getUser();
            window.location.reload();
            // this.UserStore.setUser(this.user);
            // Cập nhật thông tin trong UserStore
            // this.UserStore.setUser({ ...this.currentUser, ...this.user });
          }
        } catch (error) {
          console.error('Error updating account information:', error);
          alert('An error occurred while updating your account information.');
        }
      },
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
  