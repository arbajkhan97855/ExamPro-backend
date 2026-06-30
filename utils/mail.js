const nodemailer = require("nodemailer");

const sendOTPEmail = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "ExamPro OTP Verification",
        html: `
            <div style="font-family:Arial;padding:20px">
                <h2>ExamPro OTP Verification</h2>
                <p>Your OTP is:</p>
                <h1 style="color:#4a90e2">${otp}</h1>
                <p>This OTP is valid for 5 minutes.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;