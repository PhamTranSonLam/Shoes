
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
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                <header style="background-color: #4CAF50; color: #fff; padding: 20px; text-align: center;">
                  <h1 style="margin: 0; font-size: 24px;">Chào mừng bạn đến với website của chúng tôi</h1>
                </header>
                <div style="padding: 20px;">
                  <p style="font-size: 16px; color: #333;">Chúc mừng bạn đã đăng ký thành công!</p>
                  <ul style="list-style-type: none; padding: 0;">
                    <li style="background-color: #f9f9f9; padding: 10px; border: 1px solid #ddd; margin-bottom: 10px;">
                      <strong>Tài khoản:</strong> ${username}
                    </li>
                  </ul>
                  <p style="font-size: 16px; color: #333; margin-top: 20px;">Cảm ơn bạn đã đăng ký. Vui lòng bảo mật thông tin tài khoản của bạn.</p>
                </div>
                <footer style="background-color: #4CAF50; color: #fff; text-align: center; padding: 10px;">
                  <p style="margin: 0; font-size: 14px;">© 2024 Website của chúng tôi. Tất cả các quyền được bảo lưu.</p>
                </footer>
              </div>
            `,
          });
          
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
        // so sánh mật khẩu
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
  
      // Xóa ảnh cũ nếu có file mới được upload
      if (req.file) {
        const fs = require('fs');
        const path = require('path');
  
        if (user.image && fs.existsSync(path.join(__dirname, '../uploads', user.image))) {
          fs.unlinkSync(path.join(__dirname, '../uploads', user.image));
        }
  
        user.image = req.file.filename; // Lưu tên file ảnh mới vào cơ sở dữ liệu
      }
  
      // Cập nhật các thông tin khác từ body của request
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;
  
      // Lưu thay đổi
      const updatedUser = await user.save();
  
      // Trả về thông tin đã được cập nhật
      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        address: updatedUser.address,
        phone: updatedUser.phone,
        image: updatedUser.image,
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

