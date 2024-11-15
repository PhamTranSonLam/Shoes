import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Productmanagement from '../views/Productmanagement.vue';
import Addproduct from '../views/Addproduct.vue';
import Editproduct from '../views/Editproduct.vue';
import User from '../views/User.vue';
import Adduser from '../views/Adduser.vue';
import Edituser from '../views/Edituser.vue';
import Staff from '../views/Staff.vue';
import Addstaff from '../views/Addstaff.vue';
import Editstaff from '../views/Editstaff.vue';
import Order from '../views/Order.vue';
import Orderdetail from '../views/Orderdetail.vue';
import Accountinformation from '../views/Accountinformation.vue';

import Review from '../views/Review.vue';
import Category from '../views/Category.vue';
import Contact from '../views/Contact.vue';
import Voucher from '../views/Voucher.vue';
import Addvoucher from '../views/Addvoucher.vue';
import Editvoucher from '../views/Editvoucher.vue';


const routes = [
  {
    path: "/",
    name: "home",
    component: Home,  // Đã thêm component Home vào route "/"
  },
  {
    path: '/register',
    name: "register",
    component: Register,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/productmanagement',
    name: 'Productmanagement',
    component: Productmanagement,
  },
  {
    path: '/addproduct',
    name: 'Addproduct',
    component: Addproduct,
  },
  {
    path: '/editproduct/:id',
    name: 'Editproduct',
    component: Editproduct,
  },
  {
    path: '/user',
    name: '/User',
    component: User,
  },
  {
    path: '/adduser',
    name: '/Adduser',
    component: Adduser,
  },
  {
    path: '/edituser/:id',
    name: '/Edituser',
    component: Edituser,
  },
  {
    path: '/staff',
    name: '/Staff',
    component: Staff,
  },
  {
    path: '/addstaff',
    name: '/Addstaff',
    component: Addstaff,
  },
  {
    path: '/editstaff/:id',
    name: 'Editstaff',
    component: Editstaff,
  },
  {
    path: '/order',
    name: '/Order',
    component: Order,
  },
  {
    path: '/orderdetail/:id',
    name: '/Orderdetail',
    component: Orderdetail,
  },
  {
    path: '/accountinformation',
    name: 'Accountinformation',
    component: Accountinformation,
  },
  {
    path: '/review',
    name: 'Review',
    component: Review,
  },
  {
    path: '/category',
    name: 'Category',
    component: Category,
  },
  {
    path: '/contact/',
    name: 'Contact',
    component: Contact,
  },
  {
    path: '/voucher/',
    name: 'Voucher',
    component: Voucher,
  },
  {
    path: '/addvoucher/',
    name: 'AddVoucher',
    component: Addvoucher,
  },
  {
    path: '/editvoucher/:id',
    name: 'EditVoucher',
    component: Editvoucher,
  }
  
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
