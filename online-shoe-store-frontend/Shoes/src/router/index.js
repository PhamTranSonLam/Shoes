import { createRouter, createWebHistory } from 'vue-router';
// import ShoeList from '../views/ShoeList.vue';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Review from '../views/Review.vue';
import Services from '../views/Services.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Products from '../views/Products.vue';
import ProductDetail from '../views/ProductDetail.vue';
import Cart from '../views/Cart.vue';
import Checkout from '../views/Checkout.vue';
import Orderhistory from '../views/Orderhistory.vue';
import Accountinformation from '../views/Accountinformation.vue';
import Returnpayment from '../views/Returnpayment.vue';
const routes = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/',
    component: Home,
  },

  {
    path: '/Products',
    component: Products,
  },
  {
    path: '/About',
    component: About,
  },
  {
    path: '/Review',
    component: Review,
  },
  {
    path: '/Services',
    component: Services,
  },
  {
    path: '/auth/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/auth/register',
    component: Register,
  },

  {
    path: '/product/:id',  // Make sure this path matches the one in the link
    name: 'ProductDetail',
    component: ProductDetail,  // Ensure ProductDetail is imported correctly
    props: true  // Ensure props are enabled to pass the ID as a prop
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart,
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: Checkout,
  },
  {
    path: '/orderhistory',
    name: 'Orderhistory',
    component: Orderhistory,
  },
  {
    path: '/accountinformation',
    name: 'Accountinformation',
    component: Accountinformation,
  },
  {
    path: '/payment/return',
    name: 'Returnpayment',
    component: Returnpayment,
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
