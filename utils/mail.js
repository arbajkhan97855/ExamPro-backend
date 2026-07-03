// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 587,
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// transporter.verify((error, success) => {
//     if (error) {
//         console.log("SMTP Error:", error);
//     } else {
//         console.log("SMTP Server Ready");
//     }
// });
// const sendOTPEmail = async (email, otp) => {

//     await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: "ExamPro OTP Verification",
//         html: `
//             <h2>Your OTP</h2>
//             <h1>${otp}</h1>
//             <p>Valid for 5 minutes.</p>
//         `
//     });

// };

// module.exports = sendOTPEmail;

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("SMTP Ready");
    }
});

module.exports = async (email, otp) => {
    await transporter.sendMail({
        from: `"ExamPro" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "ExamPro OTP Verification",
        html: `
            <h2>Your OTP</h2>
            <h1>${otp}</h1>
        `
    });
};