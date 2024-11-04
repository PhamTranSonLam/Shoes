import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Import Pinia
import App from './App.vue';
import router from './router';
import axios from 'axios';
import piniaPersistedState from 'pinia-plugin-persistedstate';
import 'font-awesome/css/font-awesome.css';


const app = createApp(App);

// Create a Pinia instance
const pinia = createPinia();

// CreatCart
axios.defaults.baseURL = 'http://localhost:5000/api';  // Đảm bảo đúng URL backend

pinia.use(piniaPersistedState);
app.use(pinia); // Use Pinia
app.use(router); // Use Vue Router
app.mount('#app');

