<template>
    <div class="warehouse">
      <h1>Quản Lý Kho Hàng</h1>
      <button @click="openAddForm">Thêm Sản Phẩm</button>
      <table>
        <thead>
          <tr>
            <th>Tên Sản Phẩm</th>
            <th>SKU</th>
            <th>Số Lượng</th>
            <th>Giá</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product._id">
            <td>{{ product.name }}</td>
            <td>{{ product.sku }}</td>
            <td>{{ product.quantity }}</td>
            <td>{{ product.price }}</td>
            <td>
              <button @click="editProduct(product)">Sửa</button>
              <button @click="deleteProduct(product._id)">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import { useWarehouseStore } from "../store/Warehouse";
  
  export default {
    setup() {
      const warehouseStore = useWarehouseStore();
  
      return {
        products: warehouseStore.products,
        fetchProducts: warehouseStore.fetchProducts,
        deleteProduct: warehouseStore.deleteProduct,
      };
    },
    mounted() {
      this.fetchProducts();
    },
  };
  </script>
  
  <style scoped>
  /* Thêm CSS cho giao diện */
  .warehouse {
    padding: 1rem;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 0.5rem;
    border: 1px solid #ddd;
  }
  </style>
  