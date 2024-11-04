
const Admin = require('../models/Useradmin');
const jwt = require('jsonwebtoken');
const sendMail = require ('../controllers/EmailController');
// Đăng ký người dùng mới
exports.register = async (req, res) => {
    try {
        const { username, email, password, phone, address } = req.body;
        const admin = new Admin({ username, email, password, phone, address });
        await admin.save();
        res.status(201).json({ message: 'User registered successfully' });
        await sendMail.sendMail ({
            email: email,
            subject: "Chúc mừng bạn đăng ký thành công",
            html: `<h1>Chào mừng trở thành nhân viên quản lý webiste Shoes</h1>
            <ul>
              <li>
              Tài khoản: ${username}
              </li>
            </ul>
            <p>Cảm ơn bạn đã đăng ký. Vui lòng bảo mật thông tin tài khoản của bạn.</p>`
        })
    } catch (err) {
        res.status(400).json({ message: 'lỗi'});
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body; // Correct destructuring assignment
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        // Tạo JWT token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '365d' });
        res.json({ admin: admin, token });
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
        const admin = await Admin.findById(userId); // populate để lấy chi tiết sản phẩm
        res.json(admin);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const admin = await Admin.find();
        res.status(200).json(admin);
    } catch (error) {
        res.status(500).json({message: 'Sai'});
    }
};
// Controller để cập nhật thông tin người dùng
exports.updateUseradmin = async (req, res) => {
    const userId = req.params.id;

    try {
      // Tìm kiếm người dùng theo ID
      const admin = await Admin.findById(userId);
  
      if (!admin) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Cập nhật thông tin người dùng từ body của yêu cầu
      admin.username = req.body.username || admin.username;
      admin.email = req.body.email || admin.email;
      admin.address = req.body.address || admin.address;
      admin.phone = req.body.phone || admin.phone;
  
      // Lưu thay đổi vào cơ sở dữ liệu
      const updatedUseradmin = await admin.save();
  
      // Trả về thông tin người dùng đã được cập nhật
      res.status(200).json({
        _id: updatedUseradmin._id,
        username: updatedUseradmin.username,
        email: updatedUseradmin.email,
        address: updatedUseradmin.address,
        phone: updatedUseradmin.phone,
      });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
exports.deleteUseradmin = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await Admin.findByIdAndDelete(id);
        res.status(200).json({message: 'Thành công'});
    } catch (error) {
        res.status(500).json({message: 'Thất bại'});
    }
}