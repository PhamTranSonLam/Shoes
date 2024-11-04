// stores/user.js
// import { defineStore } from 'pinia';

import axios from 'axios';
import { defineStore } from 'pinia';
import piniaPersistedState from 'pinia-plugin-persistedstate';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null, // You can set this to null or an empty object
    token: '',  // If you need to store a token
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          username: username,
          password: password
        });
        console.log(response.data)
        const data = response.data;
        this.user = data.user;
        this.token = data.token;
      } catch (error) {
        console.log('Error logging in:', error);
      }
    },
    update(data) {
      this.user = data;
    },
    logout() {
      this.user = null;
      this.token = '';
      localStorage.removeItem('user'); // Hoặc thay bằng sessionStorage nếu cần
      localStorage.removeItem('token'); // Xóa token lưu trữ
    },
  },
  persist: true, 
});
