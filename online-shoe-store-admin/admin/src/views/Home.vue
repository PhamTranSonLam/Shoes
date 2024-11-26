<template>
  <div class="card--container">
    <h3 class="main--title">Today</h3>
    <div class="card--wrapper">
      <div class="payment--card light-red">
        <div class="card--header">
          <div class="amount">
            <span class="title">Sản Phẩm</span>
            <span class="amount--value">{{ productsCount }}</span>
          </div>
          <i class="fa-solid fa-calendar-days icon"></i>
        </div>
        <span class="card--detail">Tổng số sản phẩm hiện có</span>
      </div>

      <div class="payment--card light-purple">
        <div class="card--header">
          <div class="amount">
            <span class="title">Đơn Hàng</span>
            <span class="amount--value">{{ ordersCount }}</span>
          </div>
          <i class="fa-regular fa-clipboard icon dark-purple"></i>
        </div>
        <span class="card--detail">Tổng số đơn hàng đã được đặt</span>
      </div>

      <div class="payment--card light-green">
        <div class="card--header">
          <div class="amount">
            <span class="title">Khách Hàng</span>
            <span class="amount--value">{{ usersCount }}</span>
          </div>
          <i class="fa-regular fa-address-book icon dark-green"></i>
        </div>
        <span class="card--detail">Tổng số khách hàng đã đăng ký</span>
      </div>

      <div class="payment--card light-blue">
        <div class="card--header">
          <div class="amount">
            <span class="title">Nhân viên</span>
            <span class="amount--value">{{ authadminsCount }}</span>
          </div>
          <i class="fas fa-question-circle icon dark-blue"></i>
        </div>
        <span class="card--detail">Tổng số nhân viên hiện có</span>
      </div>
    </div>

    
  </div>

  <div class="chart-container">
    <div class="chart-container">
      <div class="chart">
        <h1>Biểu đồ Doanh Thu Hàng Tuần</h1>
        
        <BarChart :chartData="barChartData" />
      </div>
      <div class="chart">
        <h1>Biểu đồ Phân Bổ Sản Phẩm</h1>
        <PieChart :chartData="pieChartData" :options="pieChartOptions" />
      </div>
    </div>

  </div>
</template>

<script>
import BarChart from '../components/BarChart.vue';
import PieChart from '../components/Piechart.vue';
import axios from 'axios';

export default {
  name: 'Dashboard',
  components: {
    BarChart,
    PieChart
  },
  data() {
    return {
      productsCount: 0,
      ordersCount: 0,
      usersCount: 0,
      authadminsCount: 0,
      barChartData: {
        labels: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'],
        datasets: [
          {
            label: 'Doanh thu (triệu đồng)',
            backgroundColor: '#42A5F5',
            data: [] // Dữ liệu doanh thu hàng tuần
          }
        ]
      },
      pieChartData: {
        labels: ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C'],
        datasets: [
          {
            label: 'Phân bổ sản phẩm',
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
            data: [300, 500, 200] // Dữ liệu phân bổ sản phẩm
          }
        ]
      },
      pieChartOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          },
          title: {
            display: true,
            text: 'Phân bổ sản phẩm'
          }
        }
      }
    };
  },
  mounted() {
    this.fetchStatistics();
    // this.fetchWeeklyRevenue(); // Gọi hàm fetchWeeklyRevenue
  },
  methods: {
    async fetchStatistics() {
      try {
        const [productsRes, ordersRes, usersRes, authadminsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/product'),
          axios.get('http://localhost:5000/api/orders'),
          axios.get('http://localhost:5000/api/auth/'),
          axios.get('http://localhost:5000/api/authadmin')
        ]);

        this.productsCount = productsRes.data.length;
        this.ordersCount = ordersRes.data.length;
        this.usersCount = usersRes.data.length;
        this.authadminsCount = authadminsRes.data.length;
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    },
    

    mounted() {
      // this.fetchWeeklyRevenue(); // Mặc định là hiển thị doanh thu theo tuần khi tải trang
    }
  }
};
</script>

<style>
/* Trang chủ */
.card--container {
    background: white;
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.chart-container {
  background: #f5f6fa;
    width: 100%;
    padding: 1rem 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

}

.card--wrapper {
  padding: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.main--title {
  color: rgba(113, 99, 186, 255);
  padding-top: 10px;
  font-size: 15px;
}

.payment--card {
  background: rgb(229, 223, 223);
  border-radius: 10px;
  padding: 1.2rem;
  width: 290px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.5s ease-in-out;
}

.payment-card:hover {
  transform: translateY(-5px);
}

.card--header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.amount {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 20px;
  font-weight: 200;
}

.amount--value {
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: 600;
}

.icon {
  color: #fff;
  padding: 1rem;
  height: 60px;
  width: 60px;
  text-align: center;
  border-radius: 50%;
  font-size: 1.5rem;
  background: red;
}

.light-red {
  background: rgb(251, 233, 233);
}

.light-purple {
  background: rgb(254, 226, 254);
}

.light-green {
  background: rgb(235, 254, 235);
}

.light-blue {
  background: rgb(236, 236, 254);
}

.dark-red {
  background: red;
}

.dark-purple {
  background: rgb(11, 128, 0);
}

.dark-green {
  background: green;
}

.dark-blue {
  background: blue;
}

/* Biểu đồ */
/* Container của biểu đồ */
.chart-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 100px;
}

.chart {
  flex: 1;
  max-width: 500px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1rem;
}

.chart-container h1 {
  color: #7c73a0;
}

.time-period-selector {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background: #42A5F5;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background: #1E88E5;
}
</style>
