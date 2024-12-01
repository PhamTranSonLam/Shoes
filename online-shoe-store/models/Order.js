const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      price:{type: Number},
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      mainImage:{type: String}
    },
  ],
  shippingInfo: {
    username: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  paymentMethod: { type: String, required: true }, // 'creditCard', 'paypal'
  paymentStatus: {type: String},
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Đang xử lý' },
  createdAt: { type: Date, default: Date.now },
  voucher:{type: String},
  discount:{type: String},
  totaldiscount:{type: String},
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


