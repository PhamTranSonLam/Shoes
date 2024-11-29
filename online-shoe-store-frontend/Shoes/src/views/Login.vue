<template>
    <section class="form my-5 mx-5">
      <div class="container">
        <div class="row no-gutters">
          <div class="col-lg-5">
            <img class="img-fluid" src="../assets/img/S1.webp" alt="Shoes">
          </div>
          <div class="col-lg-7 px-5 pt-5">
            <h1 class="font-weight-bold py-3">Shoes</h1>
            <h4>Đăng ký tài khoản của bạn</h4>
            <form @submit.prevent="loginUser">
              <div class="form-row">
                <div class="col-lg-7">
                  <input
                    type="text"
                    placeholder="Username"
                    v-model="username"
                    class="form-control my-3 p-4"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="col-lg-7">
                  <input
                    type="password"
                    placeholder="Password"
                    v-model="password"
                    class="form-control my-3 p-4"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="col-lg-7">
                  <button type="submit" class="btn1 mt-3 mb-4">Đăng ký</button>
                </div>
              </div>
              <a href="#">Quên mật khẩu</a>
              <p>
                Bạn có tài khoản đăng ký chưa?
                <router-link to="/auth/register">Đăng ký tại đây</router-link>
              </p>
            </form>
            <!--Notification Banner-->
            <div
              v-if="notification.message"
              :class="['alert', notification.type === 'success' ? 'alert-success' : 'alert-danger']"
              role="alert"
            >
              {{ notification.message }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  import { useUserStore } from '../store/user'
  export default {
    data() {
      return {
        username: '',
        password: '',
        notification: {
          message: '',
          type: ''
        },
        userStore: useUserStore(),
      };
    },
    methods: {
      async loginUser() {
        try {
          console.log('login');
          const response = await axios.post('http://localhost:5000/api/auth/login', {
            username: this.username,
            password: this.password
          });
  
          this.notification.message = 'Login successful! Redirecting...';
          this.notification.type = 'success';
          await this.userStore.login(this.username, this.password); // Call the login action
          if (this.userStore.user) {
            this.notification.message = 'Login successful! Redirecting...';
            this.notification.type = 'success';
            // Handle successful login, e.g., store token, redirect, etc.
            setTimeout(() => {
              this.$router.push('/home'); // Change to your dashboard route
            }, 2000);
          }
        } catch (err) {
          this.notification.message = err.response?.data?.message || 'Login failed';
          this.notification.type = 'danger';
          console.log(err)
        }
      }
    }
  };
  </script>
  
  <style scoped>
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
  
  body {
    padding-top: 10%;
  }
  
  .row {
    background: rgb(226, 224, 235);
    border-radius: 30px;
    box-shadow: 12px grey;
  }
  
  .container {
    width: 100%;
  }
  
  img {
    border-top-left-radius: 30px;
    border-bottom-left-radius: 30px;
  }
  
  .btn1 {
    border: none;
    outline: none;
    height: 50px;
    width: 100%;
    background: linear-gradient(to left, #c72092, #6c14d0);
    color: white;
    border-radius: 4px;
    font-weight: bold;
  }
  
  .btn1:hover {
    background: white;
    border: 1px solid;
    color: black;
  }
  </style>
  