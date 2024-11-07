<template>
  <div class="services" id="Servises">
    <h1>our<span>services</span></h1>

    <div class="services_cards">
      <div class="services_box">
        <i class="fa-solid fa-truck-fast"></i>
        <h3>Fast Delivery</h3>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
      </div>

      <div class="services_box">
        <i class="fa-solid fa-rotate-left"></i>
        <h3>10 Days Replacement</h3>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
      </div>

      <div class="services_box">
        <i class="fa-solid fa-headset"></i>
        <h3>24 x 7 Support</h3>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
      </div>
    </div>
  </div>

  <!-- Contact Form -->
  <div class="login_form">
    <div class="left">
      <img src="../assets/img/logshoes.png" alt="Contact Us" />
    </div>

    <div class="right">
      <h1>Welcome Back! You can contact us right here.</h1>

      <form @submit.prevent="onSubmit">
        <label for="username">User Name</label>
        <div class="user">
          <i class="fa-solid fa-user"></i>
          <input
            type="text"
            v-model="username"
            id="username"
            placeholder="User Name"
            required
          />
        </div>

        <label for="phone" class="phone_tag">Phone</label>
        <div class="phone">
          <i class="fa-solid fa-phone"></i>
          <input
            type="number"
            v-model="phone"
            id="phone"
            placeholder="Phone"
            required
          />
        </div>

        <label for="content" class="content_tag">Content</label>
        <div class="content">
          <i class="fa-solid fa-envelope"></i>
          <textarea
            v-model="content"
            id="content"
            placeholder="Write your message here..."
            required
          ></textarea>
        </div>

        <button type="submit">Contact</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      username: '',
      phone: '',
      content: ''
    };
  },
  methods: {
    async onSubmit() {
      if (!this.username || !this.phone || !this.content) {
        alert('Please fill out all fields');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/api/contact/submit', {
          username: this.username,
          phone: this.phone,
          content: this.content
        });
        alert(response.data.message);
        this.username = '';
        this.phone = '';
        this.content = '';
      } catch (error) {
        alert(error.response?.data?.message || 'Error submitting contact form');
      }
    }
  }
};
</script>

<style scoped>
.services {
  width: 80%;
  margin: 0 auto;
  text-align: center;
  padding: 60px 0;
}

.services h1 {
  font-size: 48px;
  text-transform: uppercase;
  color: #333;
  margin-bottom: 40px;
}

.services h1 span {
  background: linear-gradient(to left, #c72092, #6c14d0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.services .services_cards {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 20px;
}

.services .services_box {
  width: 250px;
  padding: 20px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s;
}

.services .services_box:hover {
  transform: translateY(-10px);
}

.services .services_box i {
  font-size: 50px;
  color: #c72092;
  margin-bottom: 15px;
}

.services .services_box h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 10px;
}

.services .services_box p {
  font-size: 14px;
  color: #777;
}

.login_form {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 80px;
  background: rgba(255, 255, 255, 0.8);
}

.login_form .left img {
  width: 600px;
}

.login_form .right {
  padding: 40px 60px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login_form .right h1 {
  font-size: 32px;
  margin-bottom: 30px;
  color: #333;
  font-weight: bold;
}

.login_form .right label {
  font-size: 14px;
  color: #333;
  margin: 10px 0 5px;
  display: block;
}

.login_form .right .user,
.login_form .right .phone,
.login_form .right .content {
  border: 2px solid #6c14d0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  padding: 10px;
}

.login_form .right .user i,
.login_form .right .phone i,
.login_form .right .content i {
  color: #c72092;
  margin-right: 10px;
}

.login_form .right input[type="text"],
.login_form .right input[type="number"],
.login_form .right textarea {
  width: 100%;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
}

.login_form .right input[type="text"]:focus,
.login_form .right input[type="number"]:focus,
.login_form .right textarea:focus {
  border-color: #c72092;
  box-shadow: 0 0 5px rgba(199, 32, 146, 0.3);
}

.login_form .right button {
  width: 100%;
  padding: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 5px;
  background: linear-gradient(to right, #c72092, #6c14d0);
  cursor: pointer;
  transition: background 0.3s;
}

.login_form .right button:hover {
  background: linear-gradient(to left, #c72092, #6c14d0);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .services .services_cards {
    flex-direction: column;
    align-items: center;
  }

  .login_form {
    flex-direction: column;
    padding: 20px;
  }

  .login_form .left img {
    width: 100%;
    height: auto;
  }

  .login_form .right {
    width: 100%;
    padding: 20px;
  }
}
</style>
