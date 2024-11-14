<template>
  <div class="pie-chart-container">
    <Pie v-if="chartData.labels.length > 0" :data="chartData" :options="options" />
  </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

// Đăng ký các thành phần cần thiết cho biểu đồ tròn
ChartJS.register(Title, Tooltip, Legend, ArcElement);

export default {
  name: 'PieChart',
  components: {
    Pie
  },
  data() {
    return {
      chartData: {
        labels: [], // Tên sản phẩm sẽ được gán ở đây
        datasets: [
          {
            label: "Số lượng bán",
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"], // Màu cho từng phần của biểu đồ
            data: [] // Số lượng bán sẽ được gán ở đây
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
            text: 'Top 5 sản phẩm được mua nhiều nhất'
          }
        }
      }
    };
  },
  mounted() {
    this.fetchTopProducts(); // Gọi hàm lấy dữ liệu khi component được mount
  },
  methods: {
    async fetchTopProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/product/top-sold'); // Đảm bảo URL này là chính xác và phù hợp với backend của bạn
        const topProducts = response.data; // Dữ liệu trả về từ API

        // Kiểm tra cấu trúc dữ liệu để chắc chắn có name và quantitySold
        console.log(topProducts); 

        // Cập nhật dữ liệu cho biểu đồ từ API
        this.chartData.labels = topProducts.map(product => product.name);
        this.chartData.datasets[0].data = topProducts.map(product => product.quantitySold);

        // Buộc Vue tái render nếu cần
        this.$forceUpdate();
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu top sản phẩm:', error);
      }
    }
  }
};
</script>

<style scoped>
.pie-chart-container {
  width: 80%;
  height: 400px;  /* Thêm chiều cao cho biểu đồ */
  margin: 0 auto;
  padding: 20px;
}
</style>
