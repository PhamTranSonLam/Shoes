<template>
    <div>
      <Pie :data="chartData" :options="options" />
    </div>
  </template>
  
  <script>
  import { Pie } from 'vue-chartjs';
  import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
  
  // Đăng ký các thành phần cần thiết cho biểu đồ tròn
  ChartJS.register(Title, Tooltip, Legend, ArcElement);
  
  export default {
    name: 'PieChart',
    components: {
      Pie
    },
    props: {
      chartData: {
        type: Object,
        required: true
      },
      options: {
        type: Object,
        default: () => ({
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: true,
              text: 'Biểu đồ tròn'
            }
          }
        })
      }
    }
  };
  </script>
  
  <style scoped>
  /* Thêm các tùy chỉnh CSS cho biểu đồ tròn nếu cần */
  </style>
  