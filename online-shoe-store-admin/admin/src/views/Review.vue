<template>
  <div class="container mt-5">
    <!-- Thanh tìm kiếm -->
    <div class="col-md-10 mb-4">
      <input
        type="text"
        class="form-control search-input"
        placeholder="Tìm kiếm đánh giá"
        v-model="searchTerm"
        @input="filterReviews"
      />
    </div>

    <!-- Danh sách đánh giá -->
    <div class="card shadow-sm">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h4 class="mb-0">Danh sách đánh giá</h4>
      </div>
      <div class="card-body p-0">
        <div v-if="loading" class="text-center p-3">
          <p>Đang tải dữ liệu...</p>
        </div>

        <!-- Kiểm tra xem người dùng đã đăng nhập chưa -->
        <div v-if="!user">
          <p class="text-center">Vui lòng đăng nhập để xem đánh giá.</p>
        </div>

        <table v-else v-if="!loading" class="table table-hover text-center">
          <thead class="table-header">
            <tr>
              <th scope="col">STT</th>
              <th scope="col">Tên khách hàng</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Đánh giá</th>
              <th scope="col">Nội dung</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Phản hồi</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredReviews.length === 0">
              <td colspan="8" class="text-center">Không có đánh giá nào!</td>
            </tr>
            <tr v-for="(review, index) in paginatedReviews" :key="review._id">
              <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
              <td>{{ review.user.username }}</td>
              <td>{{ review.user.address }}</td>
              <td>{{ review.rating }}</td>
              <td>{{ review.comment }}</td>
              <td>
                <p v-if="!review.feedback">Chưa phản hồi</p>
                <p v-else>Đã phản hồi</p>
              </td>
              <td>
                <button type="button" class="btn btn-primary btn-sm" @click="openFeedbackModal(review)">Phản hồi</button>
              </td>
              <td>
                <button type="button" class="btn btn-danger btn-sm" @click="deleteReview(review._id)">Xóa</button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </div>
    </div>

    <!-- Phân trang -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Trước</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Sau</button>
        </li>
      </ul>
    </nav>

    <!-- Modal phản hồi -->
    <div class="modal fade" id="feedbackModal" tabindex="-1" aria-labelledby="feedbackModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="feedbackModalLabel">Phản hồi đánh giá</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <textarea v-model="feedbackComment" class="form-control" rows="4" placeholder="Nhập phản hồi"></textarea>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            <button type="button" class="btn btn-primary" @click="submitfeedbackUser">Gửi phản hồi</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '../store/user';

export default {
  data() {
    return {
      reviews: [],
      filteredReviews: [],
      searchTerm: '',
      loading: true,
      errorMessage: '',
      currentPage: 1,
      pageSize: 10,
      feedbackComment: '',
      selectedReview: null,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredReviews.length / this.pageSize);
    },
    paginatedReviews() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredReviews.slice(start, start + this.pageSize);
    },
    user() {
      return this.UserStore.user;
    }
  },
  methods: {
    async fetchReviews() {
      this.loading = true;
      try {
        const response = await axios.get('http://localhost:5000/api/review');
        this.reviews = response.data;
        this.filteredReviews = this.reviews;
        this.loading = false;
      } catch (error) {
        this.errorMessage = 'Không thể tải dữ liệu.';
        this.loading = false;
      }
    },
    filterReviews() {
      this.filteredReviews = this.reviews.filter((review) =>
        review.user?.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    },
    async updateReviewStatus(review) {
      try {
        await axios.put(`http://localhost:5000/api/review/${review._id}`, { status: review.status });
        alert('Cập nhật trạng thái thành công');
      } catch (error) {
        this.errorMessage = 'Không thể cập nhật trạng thái.';
      }
    },
    openFeedbackModal(review) {
      this.selectedReview = review;
      this.feedbackComment = review.feedback?.comment || '';
      const modal = new bootstrap.Modal(document.getElementById('feedbackModal'));
      modal.show();
    },
    async submitfeedbackUser() {
      if (this.selectedReview) {
        try {
          await axios.post(`http://localhost:5000/api/review/${this.selectedReview._id}/comment`, {
            staff: this.user._id,
            comment: this.feedbackComment,
            feedbackAt: '12/5/2002',
          });
          alert('Phản hồi đã được gửi thành công.');
          this.fetchReviews();
          this.feedbackComment = '';
          const modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
          modal.hide();
        } catch (error) {
          this.errorMessage = 'Không thể gửi phản hồi.';
        }
      }
    },
    async deleteReview(id) {
      if (confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) {
        try {
          await axios.delete(`http://localhost:5000/api/review/${id}`);
          this.fetchReviews();
          alert('Xóa đánh giá thành công');
        } catch (error) {
          this.errorMessage = 'Không thể xóa đánh giá.';
        }
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
  mounted() {
    this.fetchReviews();
  },
  setup() {
    const UserStore = useUserStore();
    return {
      UserStore
    };
  }
};
</script>



  <style scoped>
  /* Container Styling */
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  /* Search Bar */
  .search-input {
    padding: 10px 20px;
    font-size: 16px;
    width: 30%; /* Full width on smaller devices */
    border: 2px solid #ddd;
    border-radius: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    background-color: #f8f9fa;
  }
  
  /* Search Bar Hover and Focus Effects */
  .search-input:hover,
  .search-input:focus {
    border-color: #00796b;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    outline: none;
    background-color: #ffffff;
  }
  
  /* Card Styling */
  .card {
    border: none;
    border-radius: 12px;
    overflow: hidden;
  }
  
  /* Card Header */
  .card-header {
    background-color: #f8f9fa;
    color: #333;
    padding: 15px;
    font-size: 1.25rem;
    border-bottom: 2px solid #28a745;
  }
  
  /* Table Styling */
  .table {
    margin: 0;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
  }
  
  .table-header {
    background-color: #28a745;
    color: white;
  }
  
  .table-header th {
    text-transform: uppercase;
    font-size: 0.875rem;
    padding: 12px;
  }
  
  .table tbody tr {
    border-bottom: 1px solid #eee;
    transition: background-color 0.3s ease;
  }
  
  .table tbody tr:hover {
    background-color: #f1f1f1;
  }
  
  .table td,
  .table th {
    padding: 12px 15px;
    font-size: 0.875rem;
  }
  
  .table td {
    color: #555;
  }
  
  /* Form Select Styling */
  .form-select {
    border-radius: 5px;
    border: 1px solid #ddd;
  }
  /* Pagination Styling */
  .pagination {
    margin-top: 20px;
  }
  
  .page-link {
    color: #28a745;
  }
  
  .page-item.active .page-link {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  }
  
  .page-item.disabled .page-link {
    color: #ddd;
  }
  
  
  
  /* Button Styling */
  .btn {
    font-size: 0.875rem;
    padding: 8px 12px;
    border-radius: 8px;
  }
  
  .btn-success {
    background-color: #28a745;
    border-color: #28a745;
    font-weight: bold;
    color: white;
  }
  
  .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
    color: #fff;
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .table th,
    .table td {
      padding: 10px;
    }
  
    .btn {
      font-size: 0.75rem;
    }
  }
  </style>
  