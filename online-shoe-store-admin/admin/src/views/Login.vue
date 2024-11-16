<template>
  <section class="form my-5 mx-5">
    <div class="container">
      <div class="row no-gutters">
        <div class="col-lg-5">
          <img class="img-fluid" src="../assets/img/backgradmin1.jpg" alt="Shoes">
        </div>
        <div class="col-lg-7 px-5 pt-5">
          <h1 class="font-weight-bold py-3">Shoes</h1>
          <h4>Sign into your account</h4>
          <form @submit.prevent="loginadmin">
            <div class="form-row">
              <div class="col-lg-7">
                <input
                  type="text" placeholder="Username" v-model="username" class="form-control my-3 p-4"/>
              </div>
            </div>
            <div class="form-row">
              <div class="col-lg-7">
                <input
                  type="password" placeholder="Password" v-model="password" class="form-control my-3 p-4"
                />
              </div>
            </div>
            <div class="form-row">
            <div class="col-lg-7">
              <router-link to= "/home">
                <button @click="loginadmin" class="btn1 mt-3 mb-4">Login</button>
              </router-link>
            </div>
          </div>

            <a href="#">Forgot password?</a>
            <p>
              Don't have an account?
              <router-link to="/register">Register here</router-link>
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
    async loginadmin() {
      try {
        console.log('login');
        const response = await axios.post('http://localhost:5000/api/authadmin/login', {
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
           
          }, 2000);
        }
      } catch (err) {
        this.notification.message = err.response?.data?.message || 'Login failed';
        this.notification.type = 'danger';
        this.$router.push('/login'); // Change to your dashboard route
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
  border-radius: 20px;  /* Reduced border-radius for a smaller appearance */
  box-shadow: 8px 4px 12px rgba(0, 0, 0, 0.1);  /* Softer shadow */
}

.container {
  width: 100%;
}

img {
  border-top-left-radius: 20pxs; 
  border-bottom-left-radius: 20px;
  width: 100%;                   
  height: auto;                 
  max-height: 600px;             
  object-fit: cover;              
  margin: 0 auto;                 
  display: block;                 
}


.form-control {
  padding: 8px;  
  font-size: 14px;  
}

.form-row {
  margin-bottom: 10px; 
}

.btn1 {
  border: none;
  outline: none;
  height: 40px;  /* Kept button height smaller */
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
  padding: 8px;  /* Adjusted padding for alert */
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
