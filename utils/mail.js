require("dotenv").config();

const sendOTPEmail = async (email, otp) => {
    try {

        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "accept": "application/json",
                "api-key": process.env.BREVO_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                sender: {
                    name: "ExamPro",
                    email: process.env.EMAIL_FROM
                },
                to: [
                    {
                        email: email
                    }
                ],
                subject: "ExamPro OTP Verification",
                htmlContent: `
                    <h2>ExamPro OTP Verification</h2>
                    <h1>${otp}</h1>
                    <p>This OTP is valid for 5 minutes.</p>
                `
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.log(data);
            throw new Error(data.message || "Email Send Failed");
        }

        console.log("✅ Email Sent Successfully");

    } catch (error) {
        console.log("Email Error:", error);
        throw error;
    }
};

module.exports = sendOTPEmail;