<template>
  <div>
    <div class="time-period-selector">
          <button @click="fetchWeeklyRevenue">Tuần</button>
          <button @click="fetchMonthlyRevenue">Tháng</button>
        </div>
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
            data: [1,2,3,4,5], // Dữ liệu sẽ được cập nhật từ API
          },
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
      this.chartData.datasets[0].data = data; 
      const newData = this.chartData.datasets // `data.revenue` là mảng chứa doanh thu cho các ngày trong tuần
      console.log(newData);
      this.chartData = {...this.chartData, datasets: [...this.chartData.datasets, newData] }; // Đảm bảo cập nhật phản ứng với Vue
    },

    async fetchWeeklyRevenue() {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/weekly-revenue');
        const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const datasets = response.data; // Dữ liệu doanh thu theo tháng
        const newData = this.chartData.datasets // `data.revenue` là mảng chứa doanh thu cho các ngày trong tuần

        console.log(newData);
        this.chartData = {...this.chartData, labels: labels, datasets: [{
          label: "Doanh thu (triệu đồng)",
          backgroundColor: "#42A5F5",
          data: datasets,
        }] };
        
      //   const rawData = response.data; // Giả sử API trả về dữ liệu hàng tuần bắt đầu từ Chủ Nhật

      //   // Tìm ngày hiện tại và điều chỉnh dữ liệu bắt đầu từ ngày hiện tại
      //   const today = new Date().getDay(); // 0 (Chủ Nhật) - 6 (Thứ Bảy)
      //   const sortedData = [...rawData.slice(today), ...rawData.slice(0, today)];

      //   // Cập nhật dữ liệu vào biểu đồ
      //   this.barChartData.datasets[0].data = sortedData;
      //   const newData = this.chartData.datasets // `data.revenue` là mảng chứa doanh thu cho các ngày trong tuần
      // console.log(newData);
      // this.chartData = {...this.chartData, datasets: [...this.chartData.datasets, newData] }; 
      } catch (error) {
        console.error('Error fetching weekly revenue:', error);
      }
    },

    async fetchMonthlyRevenue() {
      try {
        const response = await axios.get('http://localhost:5000/api/orders/monthly-revenue');
        const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        const datasets = response.data; // Dữ liệu doanh thu theo tháng
        const newData = this.chartData.datasets // `data.revenue` là mảng chứa doanh thu cho các ngày trong tuần
        console.log(newData);
        this.chartData = {...this.chartData, labels: labels, datasets: [{
          label: "Doanh thu (triệu đồng)",
          backgroundColor: "#42A5F5",
          data: datasets,
        }] };
      } catch (error) {
        console.error('Error fetching monthly revenue:', error);
      }
    },
  }
};
</script>

<style scoped>
/* CSS tùy chỉnh nếu cần */
</style>
