// const order = require("../controllers/OrderController") ;
const Order = require("../models/Order");

const moment = require("moment");
const config = require("../config/default.json");
const sendMail = require ('../controllers/EmailController');

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

class PaymentController {
  //[POST] /payment/vnpay/create_payment_url
  async createPaymentVnpayUrl(req, res) {
    try {
      const dataBooking = req.body; // Lấy dữ liệu booking từ body request
      console.log ("dataBooking", dataBooking)
      if (!dataBooking) {
        return res.status(400).json({
          statusCode: 400,
          msg: "Thông tin booking không hợp lệ",
        });
      }

      let date = new Date();
      let createDate = moment(date).format("YYYYMMDDHHmmss");

      let ipAddr = req.headers["x-forwarded-for"];
      req.connection.remoteAddress;
      req.socket.remoteAddress || req.connection.socket.remoteAddress;
      let tmnCode = config.vnp_TmnCode;
      let secretKey = config.vnp_HashSecret;
      let vnpUrl = config.vnp_Url;
      let returnUrl = config.vnp_ReturnUrl;

      // let tmnCode = "36PE6W7U";
      // let secretKey = "4DY2B692PVWIRR1CXH3TESKUNB5M0EWZ";
      // let vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
      // let returnUrl = "http://localhost:5173/payments/vnpay_return";

      let orderId = moment(date).format("DDHHmmss");

      let locale = "vn";
      let currCode = "VND";
      let vnp_Params = {};

      vnp_Params["vnp_Version"] = "2.1.0";
      vnp_Params["vnp_Command"] = "pay";
      vnp_Params["vnp_TmnCode"] = tmnCode;
      vnp_Params["vnp_Locale"] = locale;
      vnp_Params["vnp_CurrCode"] = currCode;
      vnp_Params["vnp_TxnRef"] = dataBooking.data.orderId;
      vnp_Params["vnp_OrderInfo"] =
        "Thanh toán đặt hàng: " + dataBooking.data.orderId;
      vnp_Params["vnp_OrderType"] = "Thanh toan VNPAY";
      vnp_Params["vnp_Amount"] = dataBooking.data.order.totaldiscount * 100; // Tổng giá trị booking
      vnp_Params["vnp_ReturnUrl"] = returnUrl;
      vnp_Params["vnp_IpAddr"] = ipAddr;
      vnp_Params["vnp_CreateDate"] = createDate;

      vnp_Params = sortObject(vnp_Params);
      console.log(vnp_Params);
      let querystring = require("qs");
      let signData = querystring.stringify(vnp_Params, { encode: false });
      let crypto = require("crypto");
      let hmac = crypto.createHmac("sha512", secretKey);
      let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      vnp_Params["vnp_SecureHash"] = signed;
      vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });


      return res.status(200).json({
        statusCode: 200,
        msg: "Tạo liên kết thanh toán thành công",
        data: {
          url: vnpUrl,
        },
      });
} catch (error) {
  console.error("Error creating payment URL", error);

      return res.status(500).json({
        statusCode: 500,
        msg: "Có lỗi xảy ra",
        error: error.message,
      });
    }
  }

 // [GET] /payment/vnpay/return
async vnpayReturn(req, res) {
  try {
      console.log("Query Parameters:", req.query);

      const querystring = require("qs");
      const crypto = require("crypto");

      let vnp_Params = req.query;
      const secureHash = vnp_Params["vnp_SecureHash"];

      // Remove secure hash params for validation
      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);

      const secretKey = config.vnp_HashSecret;
      const signData = querystring.stringify(vnp_Params, { encode: false });
      const hmac = crypto.createHmac("sha512", secretKey);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      const orderId = vnp_Params["vnp_TxnRef"];
      const rspCode = vnp_Params["vnp_ResponseCode"];

      if (secureHash === signed) {
          if (rspCode === "00") {
              // Successful transaction
              const updateBooking = await Order.findByIdAndUpdate(
                  orderId, // ID đơn hàng
                  {
                      status: "Đang xử lý", // Cập nhật trạng thái thành công
                      paymentStatus: "Thành Công", // Cập nhật trạng thái thanh toán
                  },
                  { new: true } // Trả về bản cập nhật mới
              ).populate('user');

              if (updateBooking) {
                  // Gửi email xác nhận đơn hàng
                  const email = updateBooking.user.email; // Giả sử bạn đã lưu email trong đơn hàng
                  const username = updateBooking.user.username; // Giả sử bạn đã lưu tên người dùng trong đơn hàng
                  const totaldiscount = updateBooking.totaldiscount;
                  const createAt = updateBooking.createdAt;
                  await sendMail.sendMail({
                    email: email,
                    subject: "Chúc mừng bạn đã thanh toán thành công",
                    html: `
                      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                        <header style="background-color: #4CAF50; color: #fff; padding: 20px; text-align: center;">
                          <h1 style="margin: 0; font-size: 24px;">Chào mừng bạn đến với website của chúng tôi</h1>
                        </header>
                        <div style="padding: 20px;">
                          <p style="font-size: 16px; color: #333;">Đơn hàng của bạn đã được xác nhận!</p>
                          <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
                            <tr style="background-color: #f9f9f9;">
                              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #555;">Mã đơn hàng:</td>
                              <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${orderId}</td>
                            </tr>
                            <tr>
                              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #555;">Tên khách hàng:</td>
                              <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${username}</td>
                            </tr>
                            <tr style="background-color: #f9f9f9;">
                              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #555;">Tổng số tiền:</td>
                              <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${totaldiscount} VNĐ</td>
                            </tr>
                            <tr>
                              <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold; color: #555;">Ngày đặt hàng:</td>
                              <td style="padding: 10px; border: 1px solid #ddd; color: #333;">${createAt}</td>
                            </tr>
                          </table>
                          <p style="font-size: 16px; color: #333; margin: 20px 0;">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                          <p style="font-size: 14px; color: #888;">Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc hotline.</p>
                        </div>
                        <footer style="background-color: #4CAF50; color: #fff; text-align: center; padding: 10px;">
                          <p style="margin: 0; font-size: 14px;">© 2024 Website của chúng tôi. Tất cả các quyền được bảo lưu.</p>
                        </footer>
                      </div>
                    `,
                  });
                  

                  return res.status(200).json({
                      statusCode: 200,
                      msg: "Đơn hàng đã được xác nhận",
                      data: updateBooking,
                  });
              } else {
                  return res.status(404).json({
                      statusCode: 404,
                      msg: "Không tìm thấy đơn hàng",
                  });
              }
          } else {
              // Failed transaction
              const updateBooking = await Order.findByIdAndUpdate(
                  orderId, // ID đơn hàng
                  {
                      status: "cancel", // Cập nhật trạng thái thành công
                      paymentStatus: "Thất Bại", // Cập nhật trạng thái thanh toán
                  },
                  { new: true } // Trả về bản cập nhật mới
              );

              return res.status(200).json({
                  statusCode: 400,
                  msg: "Giao dịch không thành công",
                  data: updateBooking,
              });
          }
      } else {
          return res.status(400).json({
              statusCode: 400,
              msg: "Lỗi xác thực",
          });
      }
  } catch (error) {
      console.error('Payment Return Error:', error);
      return res.status(500).json({
          statusCode: 500,
          msg: "Có lỗi xảy ra",
          error: error.message,
      });
  }
}

  
  //[GET] /payment/vnpay/ipn
  async vnpayIpn(req, res) {
    try {
      var vnp_Params = req.query;
      var secureHash = vnp_Params["vnp_SecureHash"];

      delete vnp_Params["vnp_SecureHash"];
      delete vnp_Params["vnp_SecureHashType"];

      vnp_Params = sortObject(vnp_Params);

      var config = require("config");
      var secretKey = config.get("vnp_HashSecret");
      var querystring = require("qs");
      var signData = querystring.stringify(vnp_Params, { encode: false });
      var crypto = require("crypto");
      var hmac = crypto.createHmac("sha512", secretKey);
      var signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

      if (secureHash === signed) {
        var orderId = vnp_Params["vnp_TxnRef"];
        var rspCode = vnp_Params["vnp_ResponseCode"];

        if (rspCode === "00") {
          // Cập nhật trạng thái booking khi thanh toán thành công
          await Order.updatebookingstatus({
            status: "payment",
            id: orderId,
          });
          res.status(200).json({ RspCode: "00", Message: "success" });
        } else {
          res
            .status(200)
            .json({ RspCode: "01", Message: "Transaction failed" });
        }
      } else {
        res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
      }
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        msg: "Có lỗi xảy ra",
        error: error.message,
      });
    }
  }
}
module.exports = new PaymentController(); // Xuất một thể hiện mới của PaymentController

