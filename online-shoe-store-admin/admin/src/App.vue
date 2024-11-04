<template>
    <div id="app">
      <div class="d-flex">
        <!-- Component for the header -->
        <TheHeader />
  
        <!-- Container for the main content -->
        <div class="flex-grow-1">
          <HeaderAdmin />
          <!-- Router view to display the routed components -->
          <router-view />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Home from './views/Home.vue';
  import TheHeader from './components/TheHeader.vue';
  import TheFooter from './components/TheFooter.vue';
  import HeaderAdmin from './components/HeaderAdmin.vue';
  
  export default {
    components: {
      TheHeader,
      HeaderAdmin,
      TheFooter,
      Home,
    },
  };
  </script>
  
  <!-- <style>
  .page {
    max-width: 400px;
    margin: auto;
  }
  </style> -->
  