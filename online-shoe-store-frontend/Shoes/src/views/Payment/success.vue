<template>
    <a-modal :open="true" @cancel="$emit('close')" @ok="$emit('close')" footer="">
      <a-result status="success" title="Chúc mừng bạn đã đặt tour thành công">
        <template #extra>
          <a-button type="primary" @click="goToHistory">Lịch Sử Đặt Sân</a-button>
          <a-button @click="goToFieldList">Tiếp Tục Đặt Sân</a-button>
        </template>
      </a-result>
    </a-modal>
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const router = useRouter();
  
      // Hàm điều hướng đến trang lịch sử đặt sân
      const goToHistory = () => {
        router.push("/booking");
      };
  
      // Hàm điều hướng đến danh sách sân để tiếp tục đặt
      const goToFieldList = () => {
        router.push("/field");
      };
  
      return {
        goToHistory,
        goToFieldList,
      };
    },
  };
  </script>