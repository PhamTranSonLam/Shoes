<template>
    <a-modal :open="true" @cancel="$emit('close')" @ok="$emit('close')" footer="">
      <a-result
        status="error"
        title="Thanh toán thất bại"
        sub-title="Chúng tôi rất tiếc khi quá trình thanh toán đơn hàng thất bại!!!"
      >
        <template #extra>
          <a-button @click="goToFieldList">Trở về</a-button>
        </template>
      </a-result>
    </a-modal>
  </template>
  
  <script>
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const router = useRouter();
  
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