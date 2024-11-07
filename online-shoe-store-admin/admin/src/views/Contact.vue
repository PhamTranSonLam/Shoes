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
            <td>{{ new Date(contact.date).toLocaleDateString() }}</td>
            <td>
              <button @click="viewDetail(contact.id)">Xem Chi Tiết</button>
              <button @click="deleteContactForm(contact._id)">Xóa</button>
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
          <p><strong>Ngày Gửi:</strong> {{ new Date(selectedContact.date).toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        contacts: [],
        selectedContact: null,
      };
    },
    methods: {
      async fetchContacts() {
        try {
          const response = await axios.get('http://localhost:5000/api/contact/');
          this.contacts = response.data.contacts;
        } catch (error) {
          alert('Lỗi khi tải dữ liệu liên lạc');
        }
      },
      viewDetail(contactId) {
        this.selectedContact = this.contacts.find(contact => contact.id === contactId);
      },
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
    },
    mounted() {
      this.fetchContacts();
    },
  };
  </script>
  
  <style scoped>
  .contact-management {
    padding: 20px;
  }
  
  .contact-management h1 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .contact-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .contact-table th, .contact-table td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  .contact-table th {
    background-color: #f4f4f4;
    font-weight: bold;
  }
  
  .contact-table tr:hover {
    background-color: #f9f9f9;
  }
  
  button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    opacity: 0.8;
  }
  
  button:first-of-type {
    background-color: #4CAF50;
    color: white;
  }
  
  button:last-of-type {
    background-color: #f44336;
    color: white;
  }
  
  .modal {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    width: 400px;
    position: relative;
  }
  
  .modal-content h2 {
    margin-top: 0;
  }
  
  .close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 18px;
    cursor: pointer;
  }
  </style>
  