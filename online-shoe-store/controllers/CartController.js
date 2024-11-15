
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Xuất tất cả các hàm dưới dạng một đối tượng
module.exports = {
    getCart: async (req, res) => {
        try {
            const userId = req.params.userId;
             // Extract user ID from URL parameters
            const cart = await Cart.findOne({ user: userId }).populate('items.product');
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            res.json(cart);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    addToCart: async (req, res) => {
        try {
            const userId = req.user; 
            console.log(req.user) // Giả sử bạn đã xác thực và có user ID từ token
            const { productId, quantity, size,mainImage } = req.body;
            console.log(req.body)
    
            // Kiểm tra xem cart của user đã tồn tại chưa
            let cart = await Cart.findOne({ user: userId });
            const product = await Product.findById(productId);
            if (cart) {
                // Thêm hoặc cập nhật sản phẩm trong cart
                const itemIndex = cart.items.findIndex(item => item.product.toString() === productId && item.size === size && item.mainImage === mainImage );
                if (itemIndex > -1) {
                    // Sản phẩm đã có trong cart, cập nhật số lượng
                    cart.items[itemIndex].quantity += quantity;
                    const sizeIndex = product.sizes.findIndex(sizeMB => sizeMB.size == size);

                    // Nếu không tìm thấy kích thước hoặc số lượng không đủ, trả về lỗi
                    if (sizeIndex === -1 || product.sizes[sizeIndex].quantity < quantity) {
                    throw new Error('Số lượng không đủ cho kích thước này');
                    }
                    // Trừ số lượng cho kích thước đó
                    product.sizes[sizeIndex].quantity -= quantity;
                     // Lưu thay đổi vào MongoDB
                    await Product.findByIdAndUpdate(productId, product, { new: true });
                } else {
                    // Thêm sản phẩm mới vào cart
                    cart.items.push({ product: productId, quantity,size,mainImage });
                    // Tìm kích thước cần giảm số lượng
                    const sizeIndex = product.sizes.findIndex(sizeMB => sizeMB.size == size);

                    // Nếu không tìm thấy kích thước hoặc số lượng không đủ, trả về lỗi
                    if (sizeIndex === -1 || product.sizes[sizeIndex].quantity < quantity) {
                    throw new Error('Số lượng không đủ cho kích thước này');
                    }
                    // Trừ số lượng cho kích thước đó
                    product.sizes[sizeIndex].quantity -= quantity;
                     // Lưu thay đổi vào MongoDB
                    await Product.findByIdAndUpdate(productId, product, { new: true });
                }
            } else {
                // Tạo cart mới cho user
                cart = new Cart({
                    user: userId,
                    items: [{ product: productId, quantity, size,mainImage}]
                });
            }
            await cart.save();
            res.status(200).json(cart);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    updateCartItem: async (req, res) => {
        const { quantity } = req.body; // Lấy quantity từ body
        const itemId = req.params.id; // Lấy itemId từ URL
        try {
            // const user ='66bc232b7074f13b96acc979';
            // Tìm giỏ hàng của người dùng
            const cart = await Cart.findOne({ user: req.user });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
    
            // Tìm item trong giỏ hàng dựa vào itemId
            const item = cart.items.id(itemId);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            
            const product = await Product.findById(item.product);

            const chenhLech = quantity - item.quantity;
            if(chenhLech > 0) {
                const sizeIndex = product.sizes.findIndex(sizeMB => sizeMB.size == item.size);

                // Nếu không tìm thấy kích thước hoặc số lượng không đủ, trả về lỗi
                if (sizeIndex === -1 || product.sizes[sizeIndex].quantity < chenhLech) {
                throw new Error('Số lượng không đủ cho kích thước này');
                }

                // Trừ số lượng cho kích thước đó
                product.sizes[sizeIndex].quantity -= chenhLech;

                    // Lưu thay đổi vào MongoDB
                await Product.findByIdAndUpdate(item.product, product, { new: true });
            }
            else {
                const sizeIndex = product.sizes.findIndex(sizeMB => sizeMB.size == item.size);

                // Nếu không tìm thấy kích thước hoặc số lượng không đủ, trả về lỗi
                if (sizeIndex === -1 || product.sizes[sizeIndex].quantity < chenhLech) {
                throw new Error('Số lượng không đủ cho kích thước này');
                }

                // Trừ số lượng cho kích thước đó
                product.sizes[sizeIndex].quantity -= chenhLech;

                    // Lưu thay đổi vào MongoDB
                await Product.findByIdAndUpdate(item.product, product, { new: true });
            }
            // Cập nhật số lượng
            item.quantity = quantity; // Sửa lại để cập nhật đúng thuộc tính quantity
            const update = await cart.save(); // Lưu giỏ hàng đã cập nhật
            res.json(update); // Trả về giỏ hàng đã cập nhật
        } catch (err) {
            console.error('Lỗi trong updateCartItem:', err); // Thêm log lỗi
            res.status(500).json({ message: err.message });
        }
    },
    
    
    
    removeFromCart: async (req, res) => {
        try {
          const userId = req.user; // Lấy user ID từ middleware xác thực
        //  const userId = '66bc232b7074f13b96acc979';
          const itemId = req.params.itemId; // Lấy item ID từ params
            // console.log(userId)
            
            const cart = await Cart.findOne({ user: req.user });
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found' });
            }
            
            // Tìm item trong giỏ hàng dựa vào itemId
            const item = cart.items.id(itemId);
            if (!item) {
                return res.status(404).json({ message: 'Item not found' });
            }
            const product = await Product.findById(item.product);
   
            const sizeIndex = product.sizes.findIndex(sizeMB => sizeMB.size == item.size);

            // Trừ số lượng cho kích thước đó
            product.sizes[sizeIndex].quantity += item.quantity;

                // Lưu thay đổi vào MongoDB
            await Product.findByIdAndUpdate(item.product, product, { new: true });
            
          // Tìm giỏ hàng của người dùng và xóa sản phẩm dựa trên item _id
          const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { _id: itemId } } }, // Xóa sản phẩm khỏi mảng items
            { new: true } // Trả về giỏ hàng đã được cập nhật
          );
      
          res.status(200).json(updatedCart); // Trả về giỏ hàng sau khi cập nhật
        } catch (error) {
          res.status(500).json({ error: 'Lỗi khi xóa sản phẩm khỏi giỏ hàng' });
        }
      },
};

