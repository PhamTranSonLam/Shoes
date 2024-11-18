import { defineStore } from "pinia";
import axios from "axios";

export const useWarehouseStore = defineStore("warehouse", {
  state: () => ({
    products: [],
    loading: false,
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const res = await axios.get("http://localhost:5000/api/warehouse");
        this.products = res.data;
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      } finally {
        this.loading = false;
      }
    },
    async addProduct(product) {
      try {
        const res = await axios.post("http://localhost:5000/api/warehouse", product);
        this.products.push(res.data.product);
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
      }
    },
    async updateProduct(id, updates) {
      try {
        await axios.put(`http://localhost:5000/api/warehouse/${id}`, updates);
        this.fetchProducts();
      } catch (error) {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
      }
    },
    async deleteProduct(id) {
      try {
        await axios.delete(`http://localhost:5000/api/warehouse/${id}`);
        this.products = this.products.filter((p) => p._id !== id);
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
      }
    },
  },
});
