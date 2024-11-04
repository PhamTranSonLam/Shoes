<template>
    <div>
      <h1>Available Shoes</h1>
      <div v-if="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else>
        <div v-for="shoe in shoes" :key="shoe._id" class="shoe-item">
          <h2>{{ shoe.name }}</h2>
          <p>Price: ${{ shoe.price }}</p>
          <p>Size: {{ shoe.size }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from '../axios';
  
  export default {
    name: 'ShoeList',
    data() {
      return {
        shoes: [],
        loading: true,
        error: null,
      };
    },
    async created() {
      try {
        const response = await axios.get('/Shoes');
        this.shoes = response.data;
      } catch (err) {
        this.error = 'Failed to load shoes. Please try again later.';
      } finally {
        this.loading = false;
      }
    },
  };
  </script>
  
  <style scoped>
  .shoe-item {
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .error {
    color: red;
  }
  </style>
  