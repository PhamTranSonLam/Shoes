const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String},
    brand: { type: String },
    quantity: { type: Number },  
    sizes: { type: [Object]},
    color: { type: String},
    price: { type: Number},
    inStock: { type: Boolean, default: true },
    description: { type: String },
    imageUrl: { type: String },
    category: { type: String, }
}, {
    timestamps: true
});
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
