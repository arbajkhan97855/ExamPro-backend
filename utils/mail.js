require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) {
    console.error("SMTP Error:", err);
  } else {
    console.log("✅ Brevo SMTP Connected");
  }
});

async function sendOTPEmail(email, otp) {
  return transporter.sendMail({
    from: `"ExamPro" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: "ExamPro OTP Verification",
    html: `
      <h2>ExamPro OTP Verification</h2>
      <h1>${otp}</h1>
      <p>Your OTP is valid for 5 minutes.</p>
    `,
  });
}

module.exports = sendOTPEmail;