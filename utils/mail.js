const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4, // Force IPv4
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
});

transporter.verify((err) => {
    if (err) {
        console.error("SMTP Error:", err.message);
    } else {
        console.log("SMTP Server Ready");
    }
});

const sendOTPEmail = async (email, otp) => {
    try {
        const info = await transporter.sendMail({
            from: `"ExamPro" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "ExamPro OTP Verification",
            html: `
                <h2>Your OTP</h2>
                <h1>${otp}</h1>
                <p>Valid for 5 minutes.</p>
            `
        });

        console.log("Mail Sent:", info.messageId);

    } catch (error) {
        console.error("Send Mail Error:", error);
        throw error;
    }
};

module.exports = sendOTPEmail;