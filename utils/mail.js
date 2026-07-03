require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 60000,
  greetingTimeout: 60000,
  socketTimeout: 60000,
});

transporter.verify((err, success) => {
  console.log("Verify:", err || success);
});

module.exports = async (email, otp) => {
  return transporter.sendMail({
    from: `"ExamPro" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "OTP",
    html: `<h1>${otp}</h1>`,
  });
};