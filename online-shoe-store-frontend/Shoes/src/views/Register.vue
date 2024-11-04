<template>
    <section class="form my-5 mx-5">
      <div class="container">
        <div class="row no-gutters">
          <div class="col-lg-5">
            <img class="img-fluid" src="../assets/img/S1.webp" alt="Shoes">
          </div>
          <div class="col-lg-7 px-5 pt-5">
            <h1 class="font-weight-bold py-3">Shoes</h1>
            <h4>Sign up for your account</h4>
            <form @submit.prevent="registerUser">
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
                    type="email"
                    placeholder="Email"
                    v-model="email"
                    class="form-control my-3 p-4"
                  />
                </div>
              </div>
              <div class="form-row">
                <div class="col-lg-7">
                  <input
                    type="address"
                    placeholder="Address"
                    v-model="address"
                    class="form-control my-3 p-4"
                  />
                </div>
              </div>
  
              <div class="form-row">
                <div class="col-lg-7">
                  <input
                    type="text"
                    placeholder="Phone"
                    v-model="phone"
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
                  <button type="submit" class="btn1 mt-3 mb-4">Sign Up</button>
                </div>
              </div>
  
              <a href="#">Forgot password?</a>
              <p>Already have an account? <router-link to="/auth/login">Login here</router-link></p>
            </form>
  
            <!-- Notification Banner -->
            <div
              v-if="notification.message"
              :class="['alert', notification.type === 'success' ? 'alert-success' : 'alert-danger']"
              role="alert"
            >
              {{ notification.message }}
            </div>
  
            <!-- Display Error Message -->
            <p v-if="error" class="text-danger">{{ error }}</p>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        username: '',
        email: '',
        phone: '',
        password: '',
        address: '',
        error: null,
        notification: {
          message: '',
          type: ''
        }
      };
    },
    methods: {
      async registerUser() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/register', {
            username: this.username,
            email: this.email,
            phone: this.phone,
            password: this.password,
            address: this.address
          });
  
          this.notification.message = 'Registration successful! Redirecting to login page...';
          this.notification.type = 'success';
  
          // Delay the redirection to show the success message
          setTimeout(() => {
            this.$router.push('/auth/login');
          }, 2000);
        } catch (err) {
          this.notification.message = err.response?.data?.message || 'Registration failed';
          this.notification.type = 'danger';
          this.error = 'An error occurred. Please try again.';
        }
      }
    }
  };
  </script>
  
  <style scoped>
  * {
    padding:  0;
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
  width: auto;         /* Ensure the image takes up the full width of the container */
  height: 100%;        /* Allow the height to fill its container */
  object-fit: cover;   /* Cover the container while maintaining aspect ratio */
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
  
  .alert {
    margin-top: 20px;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
  }
  
  .alert-success {
    background-color: #d4edda;
    color: #155724;
  }
  
  .alert-danger {
    background-color: #f8d7da;
    color: #721c24;
  }
  
  .text-danger {
    color: red;
  }
  </style>
  