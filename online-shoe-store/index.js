const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require("path");

// Load cấu hình từ .env
dotenv.config();

// Kết nối MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Cấu hình CORS
app.use(express.json());
app.use(bodyParser.json());

// Định nghĩa vị trí lưu trữ và tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Thư mục lưu trữ
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Tạo tên file duy nhất
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Lưu file với định dạng gốc
    },
});

const upload = multer({ storage: storage });

// Routes
const authRoutes = require('./routes/auth');
const authadminRoutes = require('./routes/Authadmin');
const productRoutes = require('./routes/Product');
const categoryRoutes = require('./routes/Categories');
const cartRouters = require('./routes/Cart');
const orderRoutes = require('./routes/Orders');
const contactRoutes = require('./routes/Contact');
const paymentRoutes = require('./routes/Payment'); // Sửa đổi tại đây
const reviewRouters = require('./routes/Review');
const colorRouters = require('./routes/Color')

app.use('/api/auth', authRoutes);
app.use('/api/authadmin', authadminRoutes);
app.use('/api/product', upload.single('image'), productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRouters);
app.use('/api/orders', orderRoutes);  
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/review', reviewRouters);
app.use('/api/color', colorRouters);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
