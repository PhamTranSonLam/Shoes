const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },  // Không bắt buộc phải có mật khẩu
    phone: { type: Number, required: true },
    address: { type: String },
    image: { type: String },
}, {
    timestamps: true
});

// Mã hóa mật khẩu trước khi lưu vào database (nếu có)
userSchema.pre('save', async function(next) {
    // Kiểm tra nếu mật khẩu không tồn tại hoặc không thay đổi
    if (!this.password || !this.isModified('password')) {
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
userSchema.methods.comparePassword = function(candidatePassword) {
    if (!this.password) {
        return false;  // Nếu không có mật khẩu, không thể so sánh
    }
    return bcrypt.compare(candidatePassword, this.password);
};


const User = mongoose.model('User', userSchema);

module.exports = User;
