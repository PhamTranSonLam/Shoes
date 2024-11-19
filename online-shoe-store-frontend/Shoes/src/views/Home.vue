<template>
    <section id="Home">
      <div class="container">
        <h5>SẢN PHẨM MỚI</h5>
        <h1><span>Giá Tốt Nhất</span>Năm Nay</h1>
        <p>Shoomatic mang đến cho bạn sự thoải mái<br>trong việc đi bộ và luyện tập.</p>
        <button>Mua Ngay</button>
      </div>
    </section>
  
    <!-- Voucher Flash Sale Section -->
    <section id="voucher">
      <div class="voucher-content">
        <h1>Flash Sale</h1>
        <p>Chương trình khuyến mãi siêu hot</p>
        <div class="voucher-list">
          <div class="voucher-item" v-for="voucher in vouchers" :key="voucher._id">
            <p>Giảm {{ voucher.discountValue }}% đơn hàng trên {{ voucher.discountValue }}VND</p>
            <p>Mã ưu đãi số lượng có hạng: {{ voucher.usageLimit }} lượt</p>
            <p>Thời gian bắt đầu từ: {{ formatDate(voucher.startDate) }} đến {{ formatDate(voucher.endDate) }}</p>
            <p class="voucher-code">Mã code: {{ voucher.code }}</p>
          </div>
        </div>
      </div>
    </section>
  
    <section id="new" class="w-100">
      <div class="row p-0">
        <div class="one col-lg-4 col-md-12 col-12 p-0">
          <img class="img-fluid" src="../assets/img/nike1.png" alt="">
          <div class="details">
            <h2>Giày Nike Hiếm Có</h2>
            <button class="text-uppercase">Mua ngay</button>
          </div>
        </div>
        <div class="one col-lg-4 col-md-12 col-12 p-0">
          <img class="img-fluid" src="../assets/img/adidas1.webp" alt="">
          <div class="details">
            <h2>Giày Adidas Hiếm Có</h2>
            <button class="text-uppercase">Mua ngay</button>
          </div>
        </div>
        <div class="one col-lg-4 col-md-12 col-12 p-0">
          <img class="img-fluid" src="../assets/img/sneaker1.jpg" alt="">
          <div class="details">
            <h2>Giày Sneaker Hiếm Có</h2>
            <button class="text-uppercase">Mua ngay</button>
          </div>
        </div>
      </div>
    </section>
  
    <!-- Adidas Products -->
    <section id="adidas" class="my-5">
      <div class="container text-center mt-5 py-5">
        <h3>Giày Adidas bán chạy nhất</h3>
        <hr class="mx-auto">
        <p>Sản phẩm bán chạy và được yêu thích nhất.</p>
      </div>
      <div class="row mx-auto container-fluid">
        <div v-for="product in adidasProducts" :key="product._id" class="product text-center col-lg-3 col-md-4 col-12">
          <img :src="`http://localhost:5000/${product.mainImage}`" alt="Product Image" class="img-fluid bg-light" />
          <div class="star">
            <i class="fas fa-star" v-for="n in 5" :key="n"></i>
          </div>
          <router-link :to="{ name: 'ProductDetail', params: { id: product._id } }" class="btn">
            <h2 class="p-name">{{ product.name }}</h2>
          </router-link>
          <p class="p-des">{{ product.description }}</p>
          <h4 class="p-price">{{ formatPrice(product.price) }}</h4>
          <router-link :to="{ name: 'ProductDetail', params: { id: product._id } }" class="btn">
            <button class="buy-btn">See details</button>
          </router-link>
        </div>
      </div>
    </section>
  
    <!-- Banner Section -->
    <section id="banner" class="my-5 pb-5">
      <div class="container">
        <h4>MID SEA</h4>
        <h1>BỘ SƯU TẬP MÙA THU<br>Giảm đến 20%</h1>
        <button class="text-uppercase">Mua Ngay</button>
      </div>
    </section>
  
    <!-- Nike Products -->
    <section id="nike" class="my-5">
      <div class="container text-center mt-5 py-5">
        <h3>Giày Nike bán chạy nhất</h3>
        <hr class="mx-auto">
        <p>Sản phẩm bán chạy và được yêu thích nhất.</p>
      </div>
      <div class="row mx-auto container-fluid">
        <div v-for="product in nikeProducts" :key="product._id" class="product text-center col-lg-3 col-md-4 col-12">
          <img :src="`http://localhost:5000/${product.mainImage}`" alt="Product Image" class="img-fluid bg-light" />
          <div class="star">
            <i class="fas fa-star" v-for="n in 5" :key="n"></i>
          </div>
          <router-link :to="{ name: 'ProductDetail', params: { id: product._id } }" class="btn">
            <h2 class="p-name">{{ product.name }}</h2>
          </router-link>
          <p class="p-des">{{ product.description }}</p>
          <h4 class="p-price">{{ formatPrice(product.price) }}</h4>
          <router-link :to="{ name: 'ProductDetail', params: { id: product._id } }" class="btn">
            <button class="buy-btn">Xem chi tiết</button>
          </router-link>
        </div>
      </div>
    </section>
  
    <!-- Sneakers Products -->
    <section id="sneakers" class="my-5">
      <div class="container text-center mt-5 py-5">
        <h3>Giày Sneakers bán chạy nhấts</h3>
        <hr class="mx-auto">
        <p>Sản phẩm bán chạy và được yêu thích nhất.</p>
      </div>
      <div class="row mx-auto container-fluid">
        <div v-for="product in sneakersProducts" :key="product._id" class="product text-center col-lg-3 col-md-4 col-12">
          <img :src="`http://localhost:5000/${product.mainImage}`" alt="Product Image" class="img-fluid bg-light" />
          <div class="star">
            <i class="fas fa-star" v-for="n in 5" :key="n"></i>
          </div>
          <router-link :to="{ name: 'ProductDetail', params: { id: product._id } }" class="btn">
            <h2 class="p-name">{{ product.name }}</h2>
          </router-link>
          <p class="p-des">{{ product.description }}</p>
          <h4 class="p-price">{{ formatPrice(product.price) }}</h4>
          <router-link :to="{ name: 'ProductDetail', params: { id: product._id } }" class="btn">
            <button class="buy-btn">Xem chi tiết</button>
          </router-link>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        vouchers: [], // Store voucher information
        adidasProducts: [], // Store Adidas products
        nikeProducts: [], // Store Nike products
        sneakersProducts: [], // Store Sneaker products
      };
    },
    mounted() {
      this.fetchProducts();  // Fetch products when component is mounted
      this.getAllVoucher();  // Fetch vouchers when component is mounted
    },
    methods: {
      async fetchProducts() {
        try {
          const response = await axios.get('http://localhost:5000/api/product');
          this.featuredProducts = response.data;
          this.adidasProducts = this.featuredProducts.filter(product => product.category === 'Adidas');
          this.nikeProducts = this.featuredProducts.filter(product => product.category === 'Nike');
          this.sneakersProducts = this.featuredProducts.filter(product => product.category === 'Sneaker');
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      },
  
      async getAllVoucher() {
        try {
          const response = await axios.get('http://localhost:5000/api/voucher');
          this.vouchers = response.data;
        } catch (error) {
          console.error('Error fetching vouchers:', error);
        }
      },
  
      formatPrice(price) {
        return `${price.toFixed(0)} VND`;
      },
  
      formatDate(date) {
        return new Date(date).toLocaleDateString('vi-VN');
      }
    }
  };
  </script>
  


<style scoped>
/* General Styles */
body {
    font-family: Arial, sans-serif; /* Use a simple and clean font */
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* Helps with consistent padding and margin */
}

/* Home Section */
#Home {
    background-image: url('../assets/img/back.jpg');
    background-size: cover;
    background-position: center;
    height: 100vh;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    color: white; /* Text color for better visibility */
}

#Home span {
    color: coral;
}


/* New Arrivals Section */
#new {
    margin-top: 50px;
    padding: 0 20px;
}

#new .one {
    position: relative;
    overflow: hidden;
    margin-bottom: 30px; /* Spacing between each item */
}

#new .one img {
    width: 100%;
    height: 400px; /* Set a fixed height for images */
    object-fit: cover; /* Ensure images cover the div properly */
    transition: transform 0.5s ease;
}

#new .one:hover img {
    transform: scale(1.05); /* Zoom effect on hover */
}

#new .one .details {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5); /* Dark transparent background */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    text-align: center;
    color: white; /* Text color */
}

#new .one:hover .details {
    opacity: 1; /* Show details on hover */
}

#new .one .details h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

#new .one .details button {
    display: inline-block;
    font-size: 14px;
    font-weight: 500;
    color: white;
    background-color: #c72092;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    text-transform: uppercase;
    transition: background 0.3s ease;
}

#new .one .details button:hover {
    background-color: #6c14d0;
}

/* Voucher Section */
#voucher {
    width: 100%;
    background-image: url('../assets/img/backgradmin1.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-attachment: fixed; /* Hiệu ứng parallax nhẹ */
    padding: 60px 0;
    color: white;
    position: relative;
    overflow: hidden; /* Ẩn các phần tử dư thừa */

}

#voucher::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5); /* Lớp overlay tối nhẹ */
    z-index: 0;
}

#voucher .voucher-content {
    text-align: center;
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    z-index: 1; /* Nội dung hiển thị trên lớp overlay */
}

#voucher h1 {
    font-size: 42px;
    font-weight: 800;
    color: #ffdf85; /* Màu vàng nổi bật */
    margin-bottom: 15px;
    text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.7); /* Tạo bóng chữ */
}

#voucher p {
    font-size: 20px;
    color: #f0f0f0;
    margin-bottom: 40px;
    line-height: 1.6;
}

#voucher .voucher-list {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
}

#voucher .voucher-item {
    background-color: rgba(255, 255, 255, 0.9); /* Màu nền sáng hơn một chút */
    border-radius: 10px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    padding: 25px;
    width: 260px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    text-align: center;
}

#voucher .voucher-item:hover {
    transform: scale(1.05); /* Tăng kích thước nhẹ */
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}

#voucher .voucher-item h2 {
    font-size: 20px;
    font-weight: 600;
    color: #ff6b6b;
    margin-bottom: 12px;
}

#voucher .voucher-item p {
    font-size: 16px;
    color: #666;
    margin-bottom: 15px;
    line-height: 1.5;
}

#voucher .voucher-code {
    font-size: 18px;
    font-weight: 700;
    color: #d9534f;
    background: #ffe3e3;
    padding: 8px;
    border-radius: 5px;
    display: inline-block;
    margin-top: 10px;
}

#voucher .voucher-item button {
    background-color: #ff6b6b;
    color: white;
    border: none;
    padding: 10px 25px;
    font-size: 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

#voucher .voucher-item button:hover {
    background-color: #ff4b4b;
    transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
    #voucher .voucher-list {
        flex-direction: column;
        align-items: center;
    }

    #voucher .voucher-item {
        width: 90%;
        margin-bottom: 20px;
    }
}

/* Product Section */
.product {
    position: relative;
    cursor: pointer;
    padding: 20px; /* Khoảng cách bên trong cho sản phẩm */
    background-color: #ffffff; /* Màu nền trắng */
    border: 1px solid #e0e0e0; /* Đường viền nhẹ nhàng */
    border-radius: 12px; /* Bo góc mềm mại */
    display: flex;
    flex-direction: column; /* Căn chỉnh theo chiều dọc */
    justify-content: space-between; /* Căn giữa các phần tử */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1); /* Bóng đổ mềm mại */
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease; /* Hiệu ứng chuyển tiếp */
    margin-bottom: 30px; /* Khoảng cách giữa các thẻ sản phẩm */
}

.product img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    margin-bottom: 15px;
}

.product h2 {
    font-size: 18px;
    margin-bottom: 10px;
}

.product p {
    margin: 10px 0;
}

.product h4 {
    font-size: 20px;
    color: black;
}

.product .buy-btn {
text-decoration: none;
  padding: 10px 14px;
  color: white;
  border-radius: 5px;
  background: linear-gradient(135deg, #c72092, #6c14d0);
  transition: background 0.3s ease, transform 0.3s ease;
  display: inline-block;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Responsive Layout for Product Section */
@media (min-width: 1200px) {
    .product {
        flex: 0 0 20%; /* 5 products per row on large screens */
        max-width: 20%;
    }
}

@media (max-width: 1199px) {
    .product {
        flex: 0 0 25%; /* 4 products per row on medium screens */
        max-width: 25%;
    }
}

@media (max-width: 992px) {
    .product {
        flex: 0 0 33.33%; /* 3 products per row on small screens */
        max-width: 33.33%;
    }
}

@media (max-width: 768px) {
    .product {
        flex: 0 0 50%; /* 2 products per row on extra small screens */
        max-width: 50%;
    }
}

@media (max-width: 576px) {
    .product {
        flex: 0 0 100%; /* 1 product per row on very small screens */
        max-width: 100%;
    }
}

/* Star Rating */
.star {
    padding: 5px 0;
    display: flex; /* Use flex to arrange stars */
}

.star i {
    font-size: 1rem; /* Increase star size */
    color: goldenrod; /* Star color */
    margin-right: 5px; /* Space between stars */
}
.des {
    margin:  0; 
}
/* Product Name and Price */
.p-name {
    font-size: 1.4rem; /* Font size for product name */
    margin:  0; /* Margin top and bottom */
    font-weight: bold; /* Bold text for emphasis */
    text-transform: capitalize; /* Capitalize first letter */
    color: #333; /* Text color */
    transition: color 0.3s ease; /* Color transition on hover */
}

.p-name:hover {
    color: #c72092; /* Change color on hover */
}

/* Price Styling */
.p-price {
    color: black;
    font-size: 1.5rem; /* Font size for price */
    font-weight: bold; /* Bold text */
    margin-top: 2px; /* Margin top */
    position: relative; /* For pseudo-element */
}

.p-price::after {
    font-size: 0.8rem; /* Font size for currency symbol */
    position: absolute;
    right: -15px; /* Position symbol to the right of price */
    top: 50%;
    transform: translateY(-50%); /* Center vertically */
}

/* Horizontal Rule */
hr {
    width: 60px; /* Increased width for better visibility */
    height: 2px;
    background: linear-gradient(to right, #c72092, #6c14d0);
    margin: 0 auto 20px auto;
}

/* Banner Section */
#banner {
    background-image: url('../assets/img/11.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
    height: 60vh;
    width: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: flex-start;
    color: white; /* Text color for better visibility */
}

/* Responsive Styles */
@media (max-width: 768px) {
    #Home {
        height: auto; /* Adjust height for smaller screens */
    }
    
    .product {
        margin-bottom: 15px; /* Reduce margin for smaller screens */
    }
    
    #new .one img {
        height: 250px; /* Adjust image height for smaller screens */
    }
    
    .p-name, .p-price {
        font-size: 1rem; /* Reduce font size for mobile */
    }
}

</style>
