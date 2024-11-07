const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    username: { type: String },
    phone: { type: String },
    content: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
