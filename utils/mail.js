const dns = require("dns");

// Force Node.js to use IPv4 first
dns.setDefaultResultOrder("ipv4first");
require("dotenv").config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Not Loaded ❌");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // 587 ke liye false
    requireTLS: true,
    family: 4,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
});

// SMTP Connection Check
transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP Verify Error:", err);
    } else {
        console.log("✅ SMTP Server Ready");
    }
});

const sendOTPEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `"ExamPro" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "ExamPro OTP Verification",
            html: `
                <h2>ExamPro OTP Verification</h2>
                <h1>${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
            `
        });

        console.log("✅ Mail Sent:", info.messageId);
        return info;

    } catch (error) {
        console.error("❌ Send Mail Error:", error);
        throw error;
    }
};

module.exports = sendOTPEmail;