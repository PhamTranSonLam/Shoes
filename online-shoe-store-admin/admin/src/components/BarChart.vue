<template>
  <div>
    <Bar :data="chartData" :options="options" />
  </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'BarChart',
  components: {
    Bar
  },
  data() {
    return {
      chartData: {
        labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [
          {
            label: "Doanh thu (triệu đồng)",
            backgroundColor: "#42A5F5",
            data: [] // Dữ liệu sẽ được cập nhật từ API
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Doanh thu hàng tuần'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
  },
  mounted() {
    this.fetchData(); // Gọi API khi component được mount
  },
  methods: {
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/weekly-revenue'); // Thay URL bằng API của bạn
        const data = response.data; // Giả sử API trả về dữ liệu đúng định dạng
        this.updateChartData(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      }
    },
    updateChartData(data) {
      // Cập nhật `data` cho biểu đồ từ dữ liệu backend
      this.chartData.datasets[0].data = data.revenue; // `data.revenue` là mảng chứa doanh thu cho các ngày trong tuần
      this.chartData = { ...this.chartData }; // Đảm bảo cập nhật phản ứng với Vue
    }
  }
};
</script>

<style scoped>
/* CSS tùy chỉnh nếu cần */
</style>
