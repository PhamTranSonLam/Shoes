<template>
  <section class="container sproduct my-5 pt-5">
    <div class="row mt-5">
      <!-- Hình ảnh sản phẩm lớn -->
      <div class="col-lg-5 col-md-12 col-12">
        <img :src="mainImage" alt="Product Image" class="img-fluid bg-light large-img" style="width: 100%;" />
        <!-- Hình ảnh sản phẩm nhỏ -->
        <div class="small-img-group mt-3">
          <div 
            class="small-img-col" v-for="(image, index) in images" :key="index" @click="changeMainImage(image)">
            <img :src="`http://localhost:5000/${image}`" alt="Product Image" class="img-fluid bg-light small-img" />
          </div>
        </div>
      </div>
      <!-- Thông tin sản phẩm -->
      <div class="col-lg-6 col-md-12 col-12">
        <h6>Home / Shoes</h6>
        <h3 class="py-4">{{ product.name }}</h3>
        <h2>{{ product.price | currency }} VNĐ</h2>
        <p>Quantity:{{ calculateTotalQuantity(product.sizes) }}</p>

        <!-- Chọn kích thước -->
        <select class="my-3" v-model="selectedSize">
          <option disabled value=""> Size</option>
          <option v-for="size in product.sizes" :key="size">{{ size.size }}</option>
        </select>
         <!-- Chọn màu sắc -->
         <select class="my-3" v-model="selectedColor">
          <option disabled value=""> Màu sắc</option>
          <option v-for="color in product.color" :key="color">{{ color.name }}</option>
        </select>

        <!-- Nhập số lượng -->
        <input type="number" v-model="quantity" min="1" class="quantity-input" />

        <!-- Nút thêm vào giỏ hàng -->
        <button class="buy-btn" @click="addToCart">Add To Cart</button>

        <!-- Chi tiết sản phẩm -->
        <h4 class="mt-5 mb-5">Product Detail</h4>
        <span>{{ product.description }}</span>
      </div>
    </div>
  </section>

                        <!-- Gợi ý sản phẩm -->

  <section>
    <h3 class="text-center mt-5">Related product suggestions</h3>
    <div class="card-container">
      <div 
        class="card" 
        v-for="relatedProduct in relatedProducts" 
        :key="relatedProduct._id">
        <div class="small_card">
          <i class="fa-solid fa-heart"></i>
          <i class="fa-solid fa-share"></i>
        </div>
        <div class="image">
          <img :src="`http://localhost:5000/${relatedProduct.imageUrl}`" alt="Related Product Image" class="img-fluid bg-light" />
        </div>
        <div class="products_text">
          <router-link :to="{ name: 'ProductDetail', params: { id: relatedProduct._id } }" class="btn">
            <h2>{{ relatedProduct.name }}</h2>
          </router-link>
          <p>{{ relatedProduct.description }}</p>
          <p>Quantity:{{ calculateTotalQuantity(product.sizes) }}</p>
          <div class="price-size-container">
            <h3> {{ relatedProduct.price | currency }} VNĐ</h3>
          </div>
          <div class="products_star">
            <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
                <button class="buy-btn">See details</button>
              </router-link>
            <i v-for="star in relatedProduct.rating" :key="star" :class="['fa-solid', star === 'full' ? 'fa-star' : 'fa-star-half-stroke']"></i>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useUserStore } from '../store/user';

export default {
  data() {
    return {
      product: {
        name: '',
        price: 0,
        sizes: [],
        description: '',
        imageUrl: '',
        category: '',
        color:'',
      },
      images: [],
      mainImage: '',
      selectedSize: '',
      selectedColor: '',
      quantity: 1,
      productId: this.$route.params.id,
      relatedProducts: [] // Mảng chứa sản phẩm liên quan
    };
  },
  mounted() {
    this.fetchProductDetails();
    this.fetchRelatedProducts(); // Cập nhật tên hàm để lấy sản phẩm liên quan
    this.fetchColors();
  },
  methods: {
    async fetchProductDetails() {
      try {
        const response = await axios.get(`http://localhost:5000/api/product/${this.productId}`);
        this.product = response.data;
        this.images = [response.data.imageUrl, ...this.images];
        this.mainImage = `http://localhost:5000/${this.product.imageUrl}`;
      } catch (error) {
        console.log('Lỗi khi tải chi tiết sản phẩm:', error);
      }
    },
    async fetchColors() {
        try {
          const response = await axios.get('http://localhost:5000/api/color');
          this.product.color = response.data;
        } catch (error) {
          console.error('Error fetching colors:', error);
        }
      },

    async fetchRelatedProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/product'); // Lấy tất cả sản phẩm
        this.relatedProducts = response.data.filter(product => product.category === this.product.category && product._id !== this.productId); // Lọc sản phẩm cùng loại
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    },
    changeMainImage(newImage) {
      this.mainImage = newImage;
    },

    async addToCart() {
      if (!this.selectedSize) {
        alert('Please select a size');
        return;
      }

      try {
        const userStore = useUserStore();
        await axios.post(
          'http://localhost:5000/api/cart/add',
          {
            userId: userStore.user._id,
            productId: this.product._id,
            size: this.selectedSize,
            color: this.selectedColor,
            quantity: this.quantity
          },
          { headers: { Authorization: `Bearer ${userStore.token}` } }
        );
        alert('Product has been successfully added to cart!');
        this.$router.push({ name: 'Cart' }); // chuyển sang giỏ hàng
      } catch (error) {
        console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error.response ? error.response.data : error.message);
        alert('Adding product to cart failed or product is out of stock!');
      }
    },
    calculateTotalQuantity(sizes) {
      // Sum up the quantity from all sizes
      if (Array.isArray(sizes)) {
        return sizes.reduce((total, size) => total + size.quantity, 0);
      }
      return 0;
    },
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    }
  }
};
</script>

<style scoped>
/* Container cho sản phẩm */
.container.sproduct {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Hình ảnh lớn */
.large-img {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
}

/* Nhóm hình ảnh nhỏ */
.small-img-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

/* Ảnh nhỏ */
.small-img-col {
  flex-basis: 24%;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.small-img {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}

/* Hiệu ứng hover cho ảnh nhỏ */
.small-img-col:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

/* Tiêu đề và giá sản phẩm */
h3.py-4 {
  font-size: 26px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

h2 {
  font-size: 22px;
  color: black;
  margin: 10px 0;
  font-weight: bold;
}

/* Dropdown và input */
.sproduct select,
.sproduct input {
  border: 1px solid #ddd;
  padding: 12px;
  font-size: 16px;
  border-radius: 6px;
  margin-bottom: 15px;
  width: calc(50% - 12px);
  transition: border 0.3s ease;
}

/* Hiệu ứng focus cho trường nhập */
.sproduct select:focus,
.sproduct input:focus {
  border: 1px solid #c72092;
  outline: none;
}

/* Style cho nút thêm vào giỏ hàng */
.buy-btn {
  text-decoration: none;
  padding: 14px 32px;
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

/* Hiệu ứng hover cho nút */
.buy-btn:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #6c14d0, #c72092);
}

/* Container cho sản phẩm liên quan */
.card-container {
  display: flex; /* Sử dụng Flexbox */
  flex-wrap: wrap; /* Cho phép các sản phẩm nằm ngang */
  justify-content: center; /* Canh giữa các sản phẩm */
  margin-top: 20px; /* Khoảng cách trên */
}

/* Card styling */
.card {
  flex: 0 1 calc(25% - 15px); /* 4 cards mỗi hàng */
  margin: 10px; /* Margin xung quanh các card */
  border: 1px solid #ddd; /* Border cho card */
  border-radius: 10px; /* Góc tròn cho card */
  padding: 15px; /* Padding cho nội dung card */
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* Hiệu ứng chuyển tiếp */
  background-color: #fff; /* Màu nền cho card */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* Đổ bóng cho card */
}

/* Hiệu ứng hover cho card */
.card:hover {
  transform: scale(1.05); /* Hiệu ứng phóng to khi hover */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); /* Tăng bóng khi hover */
}

/* Hình ảnh trong card */
.image {
  height: 200px; /* Chiều cao cố định cho hình ảnh */
  overflow: hidden; /* Ẩn phần vượt quá */
  border-radius: 10px; /* Góc tròn cho hình ảnh */
  margin-bottom: 10px; /* Khoảng cách dưới hình ảnh */
}

.image img {
  width: 100%; /* Chiều rộng đầy đủ */
  height: 100%; /* Chiều cao đầy đủ */
  object-fit: cover; /* Căn chỉnh để giữ tỉ lệ khung hình */
}

/* Text trong card */
.products_text {
  text-align: center; /* Canh giữa văn bản trong card */
}

.products_text h2 {
  font-size: 20px; /* Kích thước font cho tên sản phẩm */
  color: #c72092; /* Màu sắc tên sản phẩm */
  margin: 10px 0; /* Khoảng cách */
}

.products_text p {
  color: #666; /* Màu sắc mô tả */
  margin: 5px 0; /* Khoảng cách */
}

.price-size-container h3 {
  font-size: 18px; /* Kích thước font cho giá */
  color: black; /* Màu sắc giá */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card {
    flex: 0 1 calc(50% - 15px); /* 2 cards mỗi hàng */
  }
}

@media (max-width: 480px) {
  .card {
    flex: 0 1 100%; /* 1 card mỗi hàng */
  }
}
</style>
