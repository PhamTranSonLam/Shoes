const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Shoe = require('../models/Product');
const Product = require('../models/Product')

exports.placeOrder =  async (req, res) => {
    console.log('Order Data:', req.body); // Ghi log dữ liệu nhận được
    const { user, items, shippingInfo, paymentMethod, totalAmount } = req.body;
    // Kiểm tra nếu dữ liệu cần thiết có trong yêu cầu
    if (!user || !items || !shippingInfo || !paymentMethod || totalAmount === undefined) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    // Phần còn lại của logic xử lý đơn hàng
    try {
        const order = await Order.create({
            user,
            items,
            shippingInfo,
            paymentMethod,
            totalAmount,
        });
        console.log("id", order._id);
        const orderId = order._id;
        
        
        res.status(201).json({ orderId, order});

        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ user: user });

        // Nếu giỏ hàng tồn tại, làm rỗng giỏ hàng
        if (cart) {
            cart.items = []; // Xóa tất cả các mục trong giỏ hàng
            await cart.save(); // Lưu lại giỏ hàng đã làm rỗng
        }
    } catch (error) {
        console.error('Error creating order:', error); // Ghi log lỗi
        res.status(500).json({ message: 'Internal server error' });
    }
};
// DB payment
// In OrderController.js or similar
exports.updatebookingstatus = async ({ orderId, status, paymentStatus }) => {
    try {
      const orderStatus = await Order.findByIdAndUpdate(
        { _id: orderId },
        { status: status },
        {paymentStatus: paymentStatus},
        { new: true } // Return the updated document
      );
      if (!orderStatus) {
        return { statusCode: 404, msg: "Không tìm thấy đơn hàng" };
      }
      console.log("Updated Order Status:", orderStatus);
  
      return { statusCode: 200, data: orderStatus };
    } catch (err) {
      return { statusCode: 500, msg: "Lỗi khi cập nhật đơn hàng", error: err.message };
    }
  };
// Lấy chi tiết đơn hàng khách hàng.
exports.getOrderById = async (req, res)=> {
    try{
        const { id } = req.params; 
        const order = await Order.findById(id).populate('items.product');
         // check if the order exists
         if (!order){
            return res.status(404).json({message: 'Bạn không có quyền xem đơn hàng này'});
         }
         res.json(order);// gửi chi tiết đơn hàng khi phản hồi
    } catch (err){
        res.status (500).json({mesage: err.message});
    }
};
// Lấy đơn hàng theo người dùng
exports.getOrdersByUser = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        console.log(id)
        const order = await Order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const stripe = require('stripe')('your_stripe_secret_key');

exports.orderSchema = async (req, res) => {
  const { items, shippingInfo, paymentMethod, totalAmount } = req.body;

  try {
    // Handle payment method
    if (paymentMethod === 'creditCard') {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalAmount * 100, // Convert to cents
        currency: 'vnd',
        payment_method_types: ['card'],
      });

      res.status(200).json({ clientSecret: paymentIntent.client_secret });
    }
  } catch (error) {
    res.status(500).json({ message: 'Payment processing failed', error });
  }
};
// Lấy lịch sử đơn hàng của người dùng
exports.getOrderHistory = async (req, res) => {
  try {
      const userId = req.user; // Lấy userId từ middleware `auth`, đã lưu trữ thông tin người dùng
      const orders = await Order.find({ user: userId })
          .populate('items.product') // Nạp thông tin chi tiết của sản phẩm
          .sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất
      
      if (orders.length === 0) {
          return res.status(404).json({ message: 'No orders found for this user' });
      }

      res.status(200).json({ orders });
  } catch (error) {
      console.error('Error fetching order history:', error);
      res.status(500).json({ message: 'Error fetching order history', error });
  }
};

exports.getAllOrders = async (req, res) => {
    try {
        const order = await Order.find().populate('items.product');
        res.status(200).json(order);

    } catch (error) {
        console.error('Error fetching order history:', error);
      res.status(500).json({ message: 'Error fetching order history', error });
    }
}

//Xóa 
exports.deleteOrders = async (req, res) => {
    const { id } = req.params; // Get the order ID from the request parameters

    try {
        // Attempt to find and delete the order by ID
        const order = await Order.findByIdAndDelete(id);

        // If no order is found, return a 404 status
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tìm thấy' }); // Order not found
        }

        // If the order was successfully deleted, return a success message
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa đơn hàng:', error);
        // Return a 500 status in case of an error
        res.status(500).json({ message: 'Thất bại', error: error.message });
    }
};


// Thống kê doanh thu hàng tuần
exports.getWeeklyRevenue = async (req, res) => {
    try {
        // Xác định ngày đầu tuần (Thứ Hai) và cuối tuần (Chủ Nhật)
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - (startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1)); // Chuyển về Thứ Hai
        startOfWeek.setHours(0, 0, 0, 0);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 7); // Tính ngày Chủ Nhật cuối tuần

        // Tìm tất cả đơn hàng trong khoảng thời gian từ đầu tuần đến cuối tuần
        const orders = await Order.find({
            createdAt: {
                $gte: startOfWeek,
                $lt: endOfWeek
            }
        });

        // Khởi tạo mảng doanh thu cho 7 ngày trong tuần, từ Thứ Hai đến Chủ Nhật
        const revenue = new Array(7).fill(0);

        // Tính toán doanh thu cho từng ngày trong tuần
        orders.forEach(order => {
            const localCreatedAt = new Date(order.createdAt);
            localCreatedAt.setMinutes(localCreatedAt.getMinutes() - localCreatedAt.getTimezoneOffset());

            // Lấy ngày trong tuần từ 0-6 (Thứ Hai = 0, Chủ Nhật = 6)
            const day = localCreatedAt.getDay() === 0 ? 6 : localCreatedAt.getDay() - 1;
            
            // Cộng doanh thu vào mảng revenue cho ngày tương ứng
            revenue[day] += order.totalAmount;
            console.log("Doanh thu ngày", day, " là: ", revenue[day]);
        });

        console.log("Doanh thu cả tuần: ", revenue);
        res.status(200).json(revenue); // Trả về mảng doanh thu cho 7 ngày
    } catch (error) {
        console.error('Error fetching weekly revenue:', error);
        res.status(500).json({ message: 'Error fetching weekly revenue', error });
    }
};

// Thống kê doanh thu hàng tháng
exports.getMonthlyRevenue = async (req, res) => {
    try {
        // Aggregate monthly revenue
        const monthlyRevenue = await Order.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" },  // Group by month
                    total: { $sum: "$totalAmount" }  // Sum total revenue for each month
                }
            },
            {
                $sort: { _id: 1 }  // Sort by month (ascending)
            }
        ]);

        // Initialize an array for all 12 months, filling with 0 as default
        const monthlyRevenueArray = new Array(12).fill(0);

        // Map the aggregated data to the correct month in the array
        monthlyRevenue.forEach(item => {
            monthlyRevenueArray[item._id - 1] = item.total; // _id is the month (1-12), adjust for zero-based index
        });

        res.status(200).json(monthlyRevenueArray);  // Return array with 12 months of data
    } catch (error) {
        console.error('Error fetching monthly revenue:', error);
        res.status(500).json({ message: 'Error fetching monthly revenue', error });
    }
};

// Thống kê doanh thu hàng năm
exports.getYearlyRevenue = async (req, res) => {
    try {
        const yearlyRevenue = await Order.aggregate([
            {
                $group: {
                    _id: { $year: "$createdAt" },  // Nhóm theo năm
                    total: { $sum: "$totalAmount" }  // Tính tổng doanh thu của mỗi năm
                }
            },
            {
                $sort: { _id: 1 }  // Sắp xếp theo năm (tăng dần)
            }
        ]);

        res.status(200).json(yearlyRevenue);  // Trả về kết quả
    } catch (error) {
        console.error('Error fetching yearly revenue:', error);
        res.status(500).json({ message: 'Error fetching yearly revenue', error });
    }
};
