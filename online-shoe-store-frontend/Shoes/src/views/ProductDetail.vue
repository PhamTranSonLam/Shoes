<template>
  <section class="container sproduct my-5 pt-5">
    <div class="row mt-5">
      <!-- Hình ảnh sản phẩm lớn -->
      <div class="col-lg-5 col-md-12 col-12">
        <!-- Hiển thị ảnh chính -->
        <img v-if="mainImage" :src="mainImage" alt="Product Image" class="img-fluid bg-light large-img" style="width: 100%;" />
        
        <!-- Nút quay lại ảnh chính -->
        <button v-if="isViewingSmallImage" @click="goBackToMainImage" class="btn btn-secondary mt-3">
          Quay lại
        </button>

        <!-- Hình ảnh sản phẩm nhỏ -->
        <div class="small-img-group mt-3">
          <div 
            class="small-img-col" 
            v-for="(image, index) in smallImages" 
            :key="index" 
            @click="changeMainImage(image)">
            <img :src="`http://localhost:5000/${image}`" alt="Product Image" class="img-fluid bg-light small-img" />
          </div>
        </div>
      </div>
      <!-- Thông tin sản phẩm -->
      <div class="col-lg-6 col-md-12 col-12">
        <h6>Trang chủ / Shoes</h6>
        <h3 class="py-4">{{ product.name }}</h3>
        <h2>{{ product.price | currency }} VNĐ</h2>
        <p>Số lượng:{{ calculateTotalQuantity(product.sizes) }}</p>

        <!-- Chọn kích thước -->
        <select class="my-3" v-model="selectedSize">
          <option disabled value=""> Kích thước</option>
          <option v-for="size in product.sizes" :key="size">{{ size.size }}</option>
        </select>

        <!-- Nhập số lượng -->
        <input type="number" v-model="quantity" min="1" class="quantity-input" />

        <!-- Nút thêm vào giỏ hàng -->
        <button class="buy-btn" @click="addToCart">Thêm giỏ hàng</button>

        <!-- Chi tiết sản phẩm -->
        <h4 class="mt-5 mb-5">Sản phẩm chi tiết</h4>
        <span>{{ product.description }}</span>
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
        smallImages: [],
      },
      mainImage: '',   // Hình ảnh chính
      selectedSize: '',

      quantity: 1,
      productId: this.$route.params.id,
      relatedProducts: [], // Sản phẩm liên quan
      isViewingSmallImage: false ,// Kiểm tra xem có đang xem ảnh nhỏ hay không
      showMessage: false,
    };
  },
  mounted() {
    this.fetchProductDetails();
    this.fetchRelatedProducts(); 

  },
  methods: {
    // Lấy chi tiết sản phẩm
    async fetchProductDetails() {
      try {
        
        const response = await axios.get(`http://localhost:5000/api/product/${this.productId}`);
        this.product = response.data;
        this.mainImage = `http://localhost:5000/${response.data.mainImage}`; // Gán ảnh chính
        this.smallImages = response.data.smallImages || []; // Kiểm tra ảnh nhỏ
      } catch (error) {
        console.log('Lỗi khi tải chi tiết sản phẩm:', error);
      }
    },

   

    // Lấy sản phẩm liên quan
    async fetchRelatedProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/product');
        this.relatedProducts = response.data.filter(product => product.category === this.product.category && product._id !== this.productId);
      } catch (error) {
        console.error('Error fetching related products:', error);
      }
    },

    // Thay đổi ảnh chính khi chọn ảnh nhỏ
    changeMainImage(image) {
      this.mainImage = `http://localhost:5000/${image}`; // Cập nhật ảnh chính khi nhấn ảnh nhỏ
      this.isViewingSmallImage = true; // Đánh dấu là đang xem ảnh nhỏ
    },

    // Quay lại ảnh chính
    goBackToMainImage() {
      this.mainImage = `http://localhost:5000/${this.product.mainImage}`; // Quay lại ảnh chính ban đầu
      this.isViewingSmallImage = false; // Đánh dấu là không còn xem ảnh nhỏ
    },

    // Thêm sản phẩm vào giỏ hàng
    async addToCart() {
  try {
    const userStore = useUserStore();

    // Kiểm tra xem người dùng đã đăng nhập chưa
    if (!userStore.isAuthenticated) {
      alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.');
      this.$router.push({ name: 'Login'}); // Chuyển hướng tới trang đăng nhập
      return;
    }

    // Kiểm tra kích thước sản phẩm
    if (!this.selectedSize) {
      alert('Vui lòng chọn kích thước sản phẩm.');
      return;
    }

    // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
    await axios.post(
      'http://localhost:5000/api/cart/add',
      {
        userId: userStore.user._id,
        productId: this.product._id,
        size: this.selectedSize,
        quantity: this.quantity,
        mainImage: this.mainImage,
      },
      { headers: { Authorization: `Bearer ${userStore.token}` } }
    );

    alert('Sản phẩm đã được thêm vào giỏ hàng thành công!');
    this.$router.push({ name: 'Cart' });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm vào giỏ hàng:', error.response ? error.response.data : error.message);
    alert('Thêm sản phẩm vào giỏ hàng thất bại. Vui lòng thử lại.');
  }
},

    // Tính tổng số lượng sản phẩm theo kích thước
    calculateTotalQuantity(sizes) {
      if (Array.isArray(sizes)) {
        return sizes.reduce((total, size) => total + size.quantity, 0);
      }
      return 0;
    },
  },
  filters: {
    // Định dạng giá tiền
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
