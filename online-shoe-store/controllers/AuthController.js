
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendMail = require ('../controllers/EmailController');
const bcrypt = require('bcrypt')
// Đăng ký người dùng mới
exports.register = async (req, res) => {
    try {
        const { username, email, password, phone, address } = req.body;
        const user = new User({ username, email, password, phone, address });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
        await sendMail.sendMail({
            email: email, 
            subject: "Chúc mừng bạn đăng ký thành công",
            html: `<h1>Chào mừng bạn đến với website của chúng tôi</h1>
            <ul>
              <li>
              Tài khoản: ${username}
              </li>
            </ul>
            <p>Cảm ơn bạn đã đăng ký. Vui lòng bảo mật thông tin tài khoản của bạn.</p>`
        })
        
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body; // Correct destructuring assignment
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Tạo JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '356d' });
        res.json({ user: user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getByUser = async (req, res) => {
    try {
        // Lấy userId từ body của request
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Tìm người dùng theo _id
        const user = await User.findById(userId); // populate để lấy chi tiết sản phẩm
        res.json( user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// Controller để cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  const userId = req.params.id;

  try {
    // Tìm kiếm người dùng theo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Cập nhật thông tin người dùng từ body của yêu cầu
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.phone = req.body.phone || user.phone;

    // Lưu thay đổi vào cơ sở dữ liệu
    const updatedUser = await user.save();

    // Trả về thông tin người dùng đã được cập nhật
    res.status(200).json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      address: updatedUser.address,
      phone: updatedUser.phone,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAll = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: 'Sai'});
    }
};
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({message: 'Thành công'});
    } catch (error) {
        res.status(500).json({message: 'Thất bại'});
    }
}

// Đổi mật khẩu
exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword,userId } = req.body;
        

        // Tìm user trong database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kiểm tra mật khẩu cũ
        const isMatch = await user.comparePassword(oldPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        // Mã hóa mật khẩu mới
        // const salt = await bcrypt.genSalt(10);
        // user.password = await bcrypt.hash(newPassword, salt);
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

