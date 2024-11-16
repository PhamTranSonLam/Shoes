// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: {type: Number, required: true},
    address: {type: String, require: true. unique},
}, {
    timestamps: true
});

// Mã hóa mật khẩu trước khi lưu vào database
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

// So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
adminSchema.methods.comparePassword = function(candidatePassword) {
    if (!this.password) {
        return false;  // Nếu không có mật khẩu, không thể so sánh
    }
    return bcrypt.compare(candidatePassword, this.password);
};


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
