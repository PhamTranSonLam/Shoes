<template>
    <section id="Home">
        <div class="container">
            <h5>NEW ARRIVALS</h5>
            <h1><span>Best Price</span> This Year</h1>
            <p>Shoomatic offers your very comfortable time<br>on walking and exercising.</p>
            <button>Shop Now</button>
        </div>
    </section>

    <section id="brand" class="container">
        <div class="row m-0 pu-5">
            <img class="img-fluid col-lg-2 col-md-4 col-6" src="../assets/img/1.png" alt="">
            <img class="img-fluid col-lg-2 col-md-4 col-6" src="../assets/img/2.png" alt="">
            <img class="img-fluid col-lg-2 col-md-4 col-6" src="../assets/img/3.png" alt="">
            <img class="img-fluid col-lg-2 col-md-4 col-6" src="../assets/img/4.png" alt="">
            <img class="img-fluid col-lg-2 col-md-4 col-6" src="../assets/img/5.png" alt="">
            <img class="img-fluid col-lg-2 col-md-4 col-6" src="../assets/img/6.png" alt="">
        </div>
    </section>

    <section id="new" class="w-100">
        <div class="row p-0">
            <div class="one col-lg-4 col-md-12 col-12 p-0">
                <img class="img-fluid" src="../assets/img/nike1.png" alt="">
                <div class="details">
                    <h2>Extremes Rare Nikes</h2>
                    <button class="text-uppercase">Shop now</button>
                </div>
            </div>
            <div class="one col-lg-4 col-md-12 col-12 p-0">
                <img class="img-fluid" src="../assets/img/adidas1.webp" alt="">
                <div class="details">
                    <h2>Extremes Rare Adidass</h2>
                    <button class="text-uppercase">Shop now</button>
                </div>
            </div>
            <div class="one col-lg-4 col-md-12 col-12 p-0">
                <img class="img-fluid" src="../assets/img/sneaker1.jpg" alt="">
                <div class="details">
                    <h2>Extremes Rare Sneakers</h2>
                    <button class="text-uppercase">Shop now</button>
                </div>
            </div>
        </div>
    </section>

    <section id="adidas" class="my-5">
    <div class="container text-center mt-5 py-5">
        <h3>Best selling adidas shoes</h3>s
        <hr class="mx-auto">
        <p>This is the best selling and most popular product. </p>
    </div>
    <div class="row mx-auto container-fluid">
        <div v-for="product in adidasProducts" :key="product._id" class="product text-center col-lg-3 col-md-4 col-12">
            <img :src="`http://localhost:5000/${product.imageUrl}`" alt="Product Image" class="img-fluid bg-light" />
            <div class="star">
            <i class="fas fa-star" v-for="n in 5" :key="n"></i>
            </div>
            <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
                <h2 class="p-name">{{ product.name }}</h2>
                </router-link>
                <p class="p-des">{{ product.description }}</p>
            <h4 class="p-price">{{ product.price }} VNĐ</h4>
            <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
                <button class="buy-btn">See details</button>
            </router-link>
        </div>
    </div>
</section>


    <section id="banner" class="my-5 pb-5">
        <div class="container">
            <h4>MID SEA</h4>
            <h1>Autumn Collection<br> UP TO 20% OFF </h1>
            <button class="text-uppercase">Shop Now</button>
        </div>

    </section>

    <section id="adidas" class="my-5">
        <div class="container text-center mt-5 py-5">
            <h3>Best selling Nike shoes</h3>
            <hr class="mx-auto">
            <p>This is the best selling and most popular product. </p>
    </div>
    <div class="row mx-auto container-fluid">
        <div v-for="product in nikeProducts" :key="product._id" class="product text-center col-lg-3 col-md-4 col-12">
            <img :src="`http://localhost:5000/${product.imageUrl}`" alt="Product Image" class="img-fluid bg-light" />
            <div class="star">
            <i class="fas fa-star" v-for="n in 5" :key="n"></i>
            </div>
            <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
                <h2 class="p-name">{{ product.name }}</h2>
            </router-link>
                <p class="p-des">{{ product.description }}</p>
            <h4 class="p-price">{{ product.price }} VNĐ</h4>
            <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
                <button class="buy-btn">See details</button>
            </router-link>
        </div>
    </div>
    </section>

    <section id="seakers" class="my-5">
        <div class="container text-center mt-5 py-5">
            <h3>Best selling Sneakers shoes</h3>
            <hr class="mx-auto">
            <p>This is the best selling and most popular product. </p>
    </div>
    <div class="row mx-auto container-fluid">
        <div v-for="product in sneakersProducts" :key="product._id" class="product text-center col-lg-3 col-md-4 col-12">
            <img :src="`http://localhost:5000/${product.imageUrl}`" alt="Product Image" class="img-fluid bg-light" />
            <div class="star">
            <i class="fas fa-star" v-for="n in 5" :key="n"></i>
            </div>
            <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
                <h2 class="p-name">{{ product.name }}</h2>
                </router-link>
                <p class="p-des">{{ product.description }}</p>
            <h4 class="p-price">{{ product.price }} VNĐ</h4>
            <router-link :to="{name: 'ProductDetail', params: {id: product._id} }" class="btn">
                <button class="buy-btn">See details</button>
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
      adidasProducts: [], // This will store the filtered Adidas products
      nikeProducts: [], // All products will be fetched here
      sneakersProducts:[],
    };
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:5000/api/product');
        this.featuredProducts = response.data;
        this.adidasProducts = this.featuredProducts.filter(product => product.category == 'Adidas');
        this.nikeProducts = this.featuredProducts.filter(product => product.category == 'Nike');
        this.sneakersProducts = this.featuredProducts.filter(product => product.category == 'Sneaker');


        // this.filterAdidasProducts(); // Call filter function
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },

    filterAdidasProducts() {
      this.adidasProducts = this.featuredProducts.filter(product => product.category == 'Adidas');
    },
    
    filternikeProducts() {
      this.nikeProducts = this.featureProducts.filter(product => product.category == 'Nike');
      console.log(this.nikeProducts)
    },
    filtersneakersProducts() {
      this.sneakerPsroducts = this.featureProducts.filter(product => product.category == 'Sneaker');
    },
   

    async formatPrice(price) {
      return `${price.toFixed(2)}`;
    },

    async addToCart(product) {
      // Logic to add the product to the cart
    },
  },
  created() {
    this.fetchProducts();
  },
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

/* Brand Section */
#brand {
    margin: 5rem 0;
}

#brand .row {
    padding: 0 20px;
}

#brand img {
    max-width: 100%; /* Ensure responsiveness */
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
