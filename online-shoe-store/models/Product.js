const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String },
    brand: { type: String },
    quantity: { type: Number },  
    sizes: { type: [Object] }, // Giả sử sizes là một mảng các đối tượng chứa kích thước, màu sắc, số lượng
    // color: { type: String },
    price: { type: Number },
    inStock: { type: Boolean, default: true },
    description: { type: String },
    category: { type: String },
    
    // Các ảnh khác nhau
    mainImage: { type: String }, // Hình ảnh chính
    smallImages: { type: [String] }, // Mảng các ảnh nhỏ (4 ảnh)
    additionalImages: { type: [String] }, // Mảng các ảnh bổ sung khác (nếu cần thêm loại ảnh nào khác)
    
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
