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
  <!--Login Form-->

  <div class="login_form">
    <div class="left">
      <img src="../assets/img/logshoes.png" />
    </div>

    <div class="right">
      <h1>Welcome Back!</h1>

      <form action="#" method="post">
        <p>User Name</p>
        <div class="user">
          <i class="fa-solid fa-user"></i>
          <input
            type="text"
            name="user"
            placeholder="User Name"
            class="username"
          />
        </div>

        <p class="passworg_tag">Password</p>
        <div class="password">
          <i class="fa-solid fa-lock"></i>
          <input type="text" name="password" placeholder="Password" />
        </div>

        <p class="forget">Forget Password ?</p>

        <button type="submit">Login</button>
        <div class="loging_icon">
          <a href="#"><img src="../assets/img/google.png" /></a>
          <a href="#"><img src="../assets/img/facebook.png" /></a>
          <a href="#"><img src="../assets/img/twitter.png" /></a>
        </div>
      </form>
    </div>
  </div>
</template>

<style>
.services {
  width: 70%;
  margin: 0 auto;
  text-align: center;
  padding: 80px 0 10px 0;
}

.services h1 {
  font-size: 60px;
  text-transform: uppercase;
}

.services h1 span {
  margin-left: 15px;
  background: linear-gradient(to left, #c72092, #6c14d0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.services .services_cards {
  width: 80%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  top: 50px;
}

.services .services_box i {
  font-size: 60px;
  color: orange;
  margin: 20px 0;
  cursor: pointer;
}

.services .services_box h3 {
  margin-bottom: 12px;
  font-size: 19px;
}

.services .services_box p {
  text-align: center;
  color: #919191;
  margin-bottom: 60px;
}

.login_form {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-image: url(image/loging_bg.png);
  background-size: cover;
  background-position: center;
}

.login_form .left img {
  width: 650px;
}

.login_form .right {
  position: relative;
  top: -50px;
  left: -60px;
  padding: 50px 80px;
}

.login_form .right h1 {
  font-family: prevattscriptssk;
  font-size: 45px;
  margin-bottom: 40px;
}

.login_form .right p {
  margin-bottom: 5px;
}

.login_form .right .user {
  border: 2px solid #6c14d0;
  border-radius: 5px;
  width: 350px;
  height: 40px;
  display: flex;
}

.login_form .right .user i {
  position: relative;
  top: 9px;
  left: 15px;
  color: #c72092;
}

.login_form .right .user .username {
  position: relative;
  left: 9%;
  width: 295px;
  background: none;
  outline: none;
  border: none;
  display: flex;
  font-size: 15px;
}

.login_form .right .passworg_tag {
  margin: 15px 0 5px 0;
}

.login_form .right .password {
  border: 2px solid #6c14d0;
  border-radius: 5px;
  width: 350px;
  height: 40px;
  display: flex;
}

.login_form .right .password i {
  position: relative;
  top: 9px;
  left: 15px;
  color: #c72092;
}

.login_form .right .password input {
  position: relative;
  left: 9%;
  width: 295px;
  background: none;
  border: none;
  outline: none;
  display: flex;
  font-size: 15px;
}

::-webkit-input-placeholder {
  color: black;
  opacity: 0.7;
}

.login_form .right .forget {
  position: relative;
  left: 60%;
  margin: 6px 0 10px 0;
  cursor: pointer;
}

.login_form .right button {
  width: 350px;
  color: white;
  padding: 7px 20px;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
  background: linear-gradient(to right, #c72092, #6c14d0);
}

.login_form .right .loging_icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 25px;
}

.login_form .right .loging_icon a {
  width: 30px;
  height: 30px;
  margin: 0 2px;
  border-radius: 50%;
  background: #f3f3f3;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
}

.login_form .right .loging_icon img {
  width: 20px;
  margin: 5px 5px;
}
</style>
