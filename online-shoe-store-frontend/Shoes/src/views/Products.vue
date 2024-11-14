<template>
  <div class="products" id="Products">
    <h1>Products</h1>
    <div class="search-container">
      <input
        type="text"v-model="searchQuery"@input="searchProducts"placeholder="Search for products..."class="search-input"/>
      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle"type="button"data-bs-toggle="dropdown"aria-expanded="false">
          Product selection suggestions
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#" @click="suggestProducts('best-selling')">Best seller</a></li>
          <li><a class="dropdown-item" href="#" @click="suggestProducts('newest')">Newest</a></li>
          <li><a class="dropdown-item" href="#" @click="suggestProducts('high-to-low')">Price from high to low</a></li>
          <li><a class="dropdown-item" href="#" @click="suggestProducts('low-to-high')">Price from low to high</a></li>
        </ul>
      </div>
    </div>
    <div class="box">
      <div class="sidebar">
        <h2>Categories</h2>
        <ul>
          <li @click="filterByCategory('')"><a href="#">All</a></li>
          <li v-for="(item, index) in category" :key="index" @click="filterByCategory(item.name)">
            <a href="#">{{ item.name }}</a>
          </li>
        </ul>
      </div>
      <div class="card-container">
        <div class="card" v-for="(product, index) in filteredProducts" :key="index">
          <div class="small_card">
            <i class="fa-solid fa-heart"></i>
            <i class="fa-solid fa-share"></i>
          </div>
          <div class="image">
            <img :src="`http://localhost:5000/${product.mainImage}`" alt="Product Image" class="img-fluid bg-light" />
          </div>
          <div class="products_text">
            <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
              <h2>{{ product.name }}</h2>
            </router-link>
            <p>{{ product.description }}</p>
            <p>Quantity:{{ calculateTotalQuantity(product.sizes) }}</p>
            <div class="price-size-container">
              <h3>{{ product.price }} VNĐ</h3>
            </div>
            <div class="products_star">
              <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
                <button class="buy-btn">See details</button>
              </router-link>
              <i v-for="star in product.rating" :key="star" :class="['fa-solid', star === 'full' ? 'fa-star' : 'fa-star-half-stroke']"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { useUserStore } from '../store/user';

export default {
  data() {
    return {
      products: [],
      filteredProducts: [],
      category: [],
      searchQuery: '',
      userStore: useUserStore(),
    };
  },
  mounted() {
    this.fetchProducts();
    this.fetchCategory();
  },
  methods: {
    async fetchProducts(category = '') {
      try {
        let response;
        if (category) {
          response = await axios.get('http://localhost:5000/api/product', { params: { category } });
        } else {
          response = await axios.get('http://localhost:5000/api/product');
        }
        this.products = response.data.map(product => ({
          ...product,
          selectedSize: ''
        }));
        this.filteredProducts = this.products;
      } catch (error) {
        console.log('Error fetching products:', error);
      }
    },
    async fetchCategory() {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        this.category = response.data;
      } catch (error) {
        console.log('Error fetching categories:', error);
      }
    },
    filterByCategory(category) {
      this.fetchProducts(category);
    },
    async addProductToCart(product) {
      if (!product.selectedSize) {
        alert('Please select a size');
        return;
      }
      try {
        const response = await axios.post('http://localhost:5000/api/cart/add', {
          userId: this.userStore.user._id,
          productId: product._id,
          quantity: 1,
          size: product.selectedSize,
        }, {
          headers: { Authorization: `Bearer ${this.userStore.token}` }
        });
        alert('Product added to cart!');
        console.log('Cart response:', response.data);
      } catch (error) {
        console.error('Error adding product to cart:', error.response ? error.response.data : error.message);
        alert('Failed to add product to cart. Please try again.');
      }
    },
    calculateTotalQuantity(sizes) {
      // Sum up the quantity from all sizes
      if (Array.isArray(sizes)) {
        return sizes.reduce((total, size) => total + size.quantity, 0);
      }
      return 0;
    },
    searchProducts() {
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    },
    suggestProducts(criteria) {
      switch(criteria) {
        case 'best-selling':
          this.filteredProducts = this.products.sort((a, b) => b.sales - a.sales); // Giả sử mỗi sản phẩm có thuộc tính 'sales'
          break;
        case 'newest':
          this.filteredProducts = this.products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sắp xếp theo ngày tạo
          break;
        case 'high-to-low':
          this.filteredProducts = this.products.sort((a, b) => b.price - a.price); // Sắp xếp theo giá từ cao đến thấp
          break;
        case 'low-to-high':
          this.filteredProducts = this.products.sort((a, b) => a.price - b.price); // Sắp xếp theo giá từ thấp đến cao
          break;
        default:
          this.filteredProducts = this.products;
      }
    }
  },
};
</script>

<style>
/* General styles for the product section */
.products {
  width: 100%;
  padding: 20px 0;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.products h1 {
  margin: 60px 0;
  font-size: 50px;
  text-align: center;
  text-transform: uppercase;
  background: linear-gradient(to right, #c72092, #6c14d0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.products .box {
  display: flex;
  width: 90%;
  margin: 0 auto;
  justify-content: flex-start;
  gap: 30px;
}

.search-input {
  width: 100%; /* Đảm bảo độ rộng đầy đủ */
  max-width: 400px; /* Đặt độ rộng tối đa */
  padding: 12px 20px;
  border: 2px solid transparent;
  border-radius: 30px; /* Góc bo tròn */
  font-size: 16px;
  color: #333;
  background: #f0f0f0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Bóng mờ nhẹ */
  outline: none;
  margin-left: 0; /* Đặt vị trí mặc định */
  position: relative; /* Sử dụng relative để có thể dịch chuyển */
  right: -500px; /* Dịch chuyển sang trái 50px, bạn có thể thay đổi giá trị này */
}

.search-input:focus {

  border-color: #c72092;
  background: #fff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2); /* Bóng lớn hơn khi focus */
}

.search-input:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15); /* Hiệu ứng hover */
}
.dropdown {
  position: relative;
  display: inline-block;
  right: 160px;
}

.dropdown-toggle {
  background-color: #f0f0f0; /* Màu nền của nút */
  color: black; /* Màu chữ */
  border: none; /* Bỏ đường viền */
  border-radius: 30px; /* Bo góc */
  padding: 10px 20px; /* Padding cho nút */
  cursor: pointer; /* Con trỏ khi hover */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu */
}

.dropdown-toggle:hover {
  background-color: #c72092; /* Màu nền khi hover */
}

.dropdown-menu {
  display: none; /* Ẩn dropdown menu ban đầu */
  position: absolute; /* Đặt vị trí tuyệt đối */
  background-color: white; /* Màu nền của menu */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); /* Đổ bóng */
  border-radius: 8px; /* Bo góc cho menu */
  z-index: 1; /* Đặt z-index để menu nằm trên các thành phần khác */
}

.dropdown:hover .dropdown-menu {
  display: block; /* Hiện dropdown menu khi hover vào dropdown */
}

.dropdown-menu li {
  list-style: none; /* Bỏ dấu đầu dòng */
}

.dropdown-item {
  padding: 10px 15px; /* Padding cho từng item */
  color: #333; /* Màu chữ */
  text-decoration: none; /* Bỏ gạch chân */
  display: block; /* Đặt dạng khối */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển màu */
}

.dropdown-item:hover {
  background-color: #f0f0f0; /* Màu nền khi hover */
}

.dropdown-item:active {
  background-color: #e0e0e0; /* Màu nền khi nhấn */
}
.products_star {
  display: flex;
  align-items: center; /* Canh giữa các phần tử theo chiều dọc */
  justify-content: space-between; /* Căn giữa các phần tử theo chiều ngang */
  margin-top: 10px; /* Khoảng cách trên */
}

.btn {
  text-decoration: none; /* Bỏ gạch chân cho liên kết */
}

.buy-btn {
  background: linear-gradient(135deg, #c72092, #6c14d0);
  color: white; /* Màu chữ */
  padding: 10px 15px; /* Đệm cho nút */
  border: none; /* Bỏ viền cho nút */
  border-radius: 5px; /* Bo góc cho nút */
  cursor: pointer; /* Thay đổi con trỏ khi hover */
  transition: background-color 0.3s ease; /* Hiệu ứng chuyển đổi màu nền khi hover */
}

.buy-btn:hover {
  background: linear-gradient(135deg, #c72092, #6c14d0);
}

.products_star i {
  color: #ffd700; /* Màu vàng cho ngôi sao */
  margin-left: 5px; /* Khoảng cách giữa các ngôi sao */
  font-size: 1.2rem; /* Kích thước ngôi sao */
}



/* Sidebar styling for categories */
.sidebar {
  flex-basis: 250px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.95); /* More opaque for a luxurious look */
  backdrop-filter: blur(15px);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
  position: sticky;
  top: 20px;
  height: fit-content;
  border: 1px solid rgba(230, 230, 230, 0.5); /* Light border for definition */
}

.sidebar h2 {
  font-size: 30px; /* Slightly larger font size */
  font-weight: 700;
  color: black; /* Text color */
  text-transform: uppercase;
  margin-bottom: 30px; /* Increased margin for better spacing */
  padding-bottom: 10px;
  border-bottom: 3px solid #c72092; /* Thicker border for emphasis */
  text-align: center; /* Centered title */
  font-family: 'Playfair Display', serif; /* Elegant font family */
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar ul li {
  margin-bottom: 20px; /* Increased space between items */
  padding: 15px 20px; /* More padding for a spacious feel */
  background: rgba(255, 255, 255, 0.8); /* Slightly more opaque */
  border-radius: 12px;
  transition: all 0.4s ease;
  font-family: 'Lora', serif; /* Elegant and readable font */
  font-size: 18px; /* Larger font size for readability */
  color: #000; /* Black text color */
  text-decoration: none; /* Remove underline */
}

.sidebar ul li a {
  color: #000; /* Ensures links are black */
  text-decoration: none; /* Ensures no underline */
  display: block; /* Make the entire list item clickable */
}

.sidebar ul li:hover {
  background: linear-gradient(135deg, #c72092, #6c14d0); /* Gradient background on hover */
  transform: translateX(5px); /* Subtle translation effect */
  box-shadow: 0 5px 20px rgba(108, 20, 208, 0.3); /* Softer shadow for a luxurious feel */
}
body {
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  color: #333;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Title of the section */
.section-title {
  text-align: center;
  margin-bottom: 40px;
  font-size: 36px;
  font-weight: 700;
  color: #6c14d0;
}

/* Product card container */
.card-container {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* Always 4 columns */
  gap: 20px;
  margin-top: 30px;
}

/* Ensure responsiveness for smaller screens */
@media (max-width: 1200px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr); /* 3 columns on medium screens */
  }
}

@media (max-width: 992px) {
  .card-container {
    grid-template-columns: repeat(2, 1fr); /* 2 columns on small screens */
  }
}

@media (max-width: 576px) {
  .card-container {
    grid-template-columns: 1fr; /* 1 column on mobile screens */
  }
}
/* Card container */
.card-container {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

/* Product card */
.card {
  position: relative;
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.card .small_card {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card:hover .small_card {
  opacity: 1;
}

.card .image {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card .image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.card:hover .image img {
  transform: scale(1.1);
}

/* Product text */
.card .products_text {
  padding: 15px;
  text-align: left;
}

.card .products_text h2 {
  font-size: 22px;
  margin: 10px 0;
  font-weight: 700;
  color: #333;
}

.card .products_text p {
  font-size: 16px;
  line-height: 1.4;
  color: #555;
  margin: 5px 0 15px;
}

.card .products_text h3 {
  color: black;
  font-size: 18px;
  font-weight: bold;
}

/* Price and rating section */
.price-size-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.products_star i {
  color: #ffc107;
  font-size: 16px;
}


/* Responsive */
@media (max-width: 768px) {
  .card .products_text h2 {
    font-size: 18px;
  }

  .card .products_text p {
    font-size: 14px;
  }
}


</style>
