const Product = require('../models/Product');
const Cart = require('../models/Cart.js');
const Order = require('../models/Order.js');

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
    try {
        const category = req.query;
        const filter = req.query ? category : {};

        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sản phẩm giày mới
exports.createProduct = async (req, res) => {
    const product = new Product(req.body);
    const { name, category, description, price, quantity, sizes } = req.body;

    // If sizes is a string, parse it into an array
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
    product.sizes = parsedSizes;

    try {
        // Handle images (make sure you check the field names)
        if (req.files) {
            // Handle the main image (should be a single file uploaded under the field 'image')
            if (req.files['image']) {
                product.mainImage = req.files['image'][0]?.path; // Main image
            }

            // Handle small images (should be uploaded under the field 'additionalImages')
            if (req.files['additionalImages']) {
                product.smallImages = req.files['additionalImages']
                    .slice(0, 4) // Get a maximum of 4 small images
                    .map(file => file.path); // Extract the file path for each image
            }
        }

        // Save the new product to the database
        const newProduct = await product.save();
        res.status(201).json(newProduct); // Send the saved product in the response
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let updateData = req.body;

        // Parse sizes nếu là chuỗi JSON
        const { sizes } = req.body;
        if (sizes && typeof sizes === 'string') {
            updateData.sizes = JSON.parse(sizes);
        }

        // Cập nhật ảnh
        if (req.files) {
            // Ảnh chính
            if (req.files['image']) {
                updateData.mainImage = req.files['image'][0]?.path;
            }

            // Ảnh nhỏ
            if (req.files['additionalImages']) {
                updateData.smallImages = req.files['additionalImages']
                    .slice(0, 4) // Giới hạn tối đa 4 ảnh
                    .map((file) => file.path);
            }
        }

        // Cập nhật dữ liệu sản phẩm
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
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

// Lấy chi tiết sản phẩm theo ID
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

// Thêm vào giỏ hàng
exports.addToCart = async (req, res) => {
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
            // Tạo giỏ hàng mới cho user
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
};

// Lấy sản phẩm theo danh mục
exports.getByCategory = async (req, res) => {
    const { category } = req.query;

    try {
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Lấy top 5 sản phẩm bán chạy nhất
exports.getTopProducts = async (req, res) => {
    try {
        const productsSold = await Order.aggregate([
            { $unwind: "$items" }, // Mở rộng các sản phẩm trong đơn hàng
            {
                $group: {
                    _id: "$items.product", // Nhóm theo sản phẩm
                    totalSold: { $sum: "$items.quantity" } // Tính tổng số lượng bán
                }
            },
            { $sort: { totalSold: -1 } }, // Sắp xếp theo số lượng bán giảm dần
            { $limit: 5 } // Lấy top 5 sản phẩm bán chạy nhất
        ]);

        const productIds = productsSold.map(product => product._id);
        const products = await Product.find({ _id: { $in: productIds } });

        const topProducts = products.map(product => {
            const soldData = productsSold.find(sold => sold._id.toString() === product._id.toString());
            return { name: product.name, quantitySold: soldData.totalSold };
        });

        res.json(topProducts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching top products' });
    }
};
