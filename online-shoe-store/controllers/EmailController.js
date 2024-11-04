const nodemailer = require ('nodemailer')
require ("dotenv").config()

exports.sendMail = async ({ email, subject, html }) => {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log(email);
  
    const message = {
      from: "Shoes",
      to: email,
      subject: subject,
      html: html,
    };
  
    const result = await transporter.sendMail(message);
    console.log(result);
  
    return result;
  };
  