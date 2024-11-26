<template>
  <div class="contact-management">
    <h1>Quản Lý Liên Lạc</h1>
    <table class="contact-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Tên Người Dùng</th>
          <th>Số Điện Thoại</th>
          <th>Nội Dung</th>
          <th>Ngày Gửi</th>
          <th>Hành Động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(contact, index) in contacts" :key="contact.id">
          <td>{{ index + 1 }}</td>
          <td>{{ contact.username }}</td>
          <td>{{ contact.phone }}</td>
          <td>{{ contact.content }}</td>
          <td>{{ formatDate(contact.date) }}</td>
          <td>
            <button @click="viewDetail(contact.id)" class="me-2">Xem Chi Tiết</button>
            <button @click="deleteContactForm(contact.id)">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal xem chi tiết -->
    <div v-if="selectedContact" class="modal">
      <div class="modal-content">
        <span class="close" @click="selectedContact = null">&times;</span>
        <h2>Chi Tiết Liên Lạc</h2>
        <p><strong>Tên Người Dùng:</strong> {{ selectedContact.username }}</p>
        <p><strong>Số Điện Thoại:</strong> {{ selectedContact.phone }}</p>
        <p><strong>Nội Dung:</strong> {{ selectedContact.content }}</p>
        <p><strong>Ngày Gửi:</strong> {{ formatDate(selectedContact.date) }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      contacts: [], // Danh sách liên lạc
      selectedContact: null, // Liên lạc được chọn để xem chi tiết
    };
  },
  methods: {
    // Lấy danh sách liên lạc từ API
    async fetchContacts() {
      try {
        const response = await axios.get('http://localhost:5000/api/contact/');
        this.contacts = response.data.contacts;
      } catch (error) {
        alert('Lỗi khi tải dữ liệu liên lạc');
      }
    },
    // Hiển thị chi tiết liên lạc
    viewDetail(contactId) {
      this.selectedContact = this.contacts.find(contact => contact.id === contactId);
    },
    // Xóa liên lạc
    async deleteContactForm(contactId) {
      if (confirm('Bạn có chắc muốn xóa liên lạc này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/contact/${contactId}`);
          this.contacts = this.contacts.filter(contact => contact.id !== contactId);
          alert('Đã xóa liên lạc thành công');
        } catch (error) {
          alert('Lỗi khi xóa liên lạc');
        }
      }
    },
    // Định dạng ngày tháng
    formatDate(date) {
      if (!date) return 'Không xác định';
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) return 'Ngày không hợp lệ';
      return parsedDate.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },
  mounted() {
    this.fetchContacts(); // Gọi API khi component được gắn vào
  },
};
</script>
<style scoped>
/* Toàn bộ container */
.contact-management {
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Tiêu đề chính */
.contact-management h1 {
  font-size: 28px;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
  font-weight: bold;
  text-transform: uppercase;
  border-bottom: 3px solid #4CAF50;
  display: inline-block;
  padding-bottom: 5px;
}

/* Bảng danh sách liên lạc */
.contact-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 20px;
}

.contact-table th,
.contact-table td {
  padding: 12px 15px;
  text-align: left;
  color: #333;
}

.contact-table th {
  background-color: #4CAF50;
  color: white;
  font-size: 16px;
  text-transform: uppercase;
  border-bottom: 3px solid #f2f2f2;
}

.contact-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.contact-table tr:hover {
  background-color: #e8f5e9;
  cursor: pointer;
  transform: scale(1.01);
  transition: 0.2s;
}

.contact-table td {
  border-bottom: 1px solid #ddd;
}

/* Nút bấm */
button {
  padding: 8px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

button:first-of-type {
  background-color: #4CAF50;
  color: white;
}

button:first-of-type:hover {
  background-color: #45a049;
}

button:last-of-type {
  background-color: #f44336;
  color: white;
}

button:last-of-type:hover {
  background-color: #e53935;
}

/* Modal */
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  animation: fadeIn 0.3s ease-in-out;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  animation: scaleUp 0.3s ease-in-out;
}

.modal-content h2 {
  font-size: 20px;
  margin-top: 0;
  color: #333;
  text-align: center;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 10px;
}

.modal-content p {
  margin: 10px 0;
  line-height: 1.6;
  color: #555;
}

.close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
  background: #f44336;
  color: white;
  border: none;
  padding: 5px;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.close:hover {
  background: #e53935;
}

/* Hiệu ứng */
@keyframes fadeIn {
  from {
    background: rgba(0, 0, 0, 0);
  }
  to {
    background: rgba(0, 0, 0, 0.6);
  }
}

@keyframes scaleUp {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

