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


// Set up multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Destination folder for uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Unique filename for each file
    },
  });
  
  // Initialize multer to handle multiple file uploads with field names 'image' and 'additionalImages'
  const upload = multer({ storage: storage }).fields([
    { name: 'image', maxCount: 1 }, // Main image (single file)
    { name: 'additionalImages', maxCount: 4 }, // Additional images (up to 4 files)
  ]);
  
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
const voucherRouters = require('./routes/Voucher');


app.use('/api/auth', authRoutes);
app.use('/api/authadmin', authadminRoutes);
app.use('/api/product', upload, productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRouters);
app.use('/api/orders', orderRoutes);  
app.use('/api/contact', contactRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/review', reviewRouters);
app.use('/api/Voucher', voucherRouters);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
