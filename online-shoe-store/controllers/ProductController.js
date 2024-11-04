
// controllers/ShoeController.js
const { application } = require('express');
const Product = require('../models/Product');
const Cart = require('../models/Cart.js');

exports.getProducts = async (req, res) => {
    try {
        const category = req.query
        const filter = req.query ? category  : {};

        const product = await Product.find(filter);
        // if(req.params){
        //     const product = await Product.find(filter);
        // }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Thêm sản phẩm giày mới
exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    console.log(req.body)
    const { name, category, description, price, quantity, sizes } = req.body;

    // Nếu sizes là chuỗi, phân tích nó thành mảng
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

    product.sizes = parsedSizes // Lưu sizes dưới dạng mảng

    try {
        product.imageUrl = req.file?.path;
        const newProduct = await product.save();
        res.status(201).json(newProduct);
        
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        // Kiểm tra nếu có hình ảnh được upload
        let updateData = req.body;
        const { name, category, description, price, quantity, sizes } = req.body;

        // Nếu sizes là chuỗi, phân tích nó thành mảng
        const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;

        updateData.sizes = parsedSizes // Lưu sizes dưới dạng mảng
        if (req.file) {
            updateData.imageUrl = req.file.path; // Lưu đường dẫn hình ảnh vào cơ sở dữ liệu
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
         // Nếu không tìm thấy sản phẩm
         if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Xóa sản phẩm giày theo ID
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: 'Deleted shoe' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Controller method to get product details by ID
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id; 
        const product = await Product.findById(productId); 
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product details', error });
    }
};
// Add to cart
exports.addToCart= async (req, res) => {
    try {
        const userId = '66bc232b7074f13b96acc979';
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ user: userId });
        if (cart) {
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        } else {
            // Tạo cart mới cho user
            cart = new Cart({
                user: userId,
                items: [{ product: productId, quantity }]
            });
        }
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// Lấy sản phẩm theo danh mục
exports.getbycategory=async (req, res) => {
    const { category } = req.query;
  
    try {
      const products = await Product.find({ category });
      res.json(products);
    } catch (error) {
      console.error('Error fetching related products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } ;