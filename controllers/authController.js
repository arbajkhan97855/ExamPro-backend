const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const User = require("../models/userModel");

const signup = async (req, res) => {

    const { fullname, email, mobile, password, confirmPassword } = req.body;

    if (!fullname || !email || !mobile || !password || !confirmPassword) {
        return res.json({ success: false, message: "All Fields Required" });
    }

    if (password !== confirmPassword) {
        return res.json({ success: false, message: "Password Not Match" });
    }

    // OTP Generate (YE YAHAN HONA CHAHIYE)
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

    const user = await User.checkEmail(email);

    // Agar email already hai
    if (user.length > 0) {

        // Account active hai
        if (user[0].status === "active") {
            return res.json({
                success: false,
                message: "Email Already Registered"
            });
        }

        // Account inactive hai -> sirf OTP update karo
        await User.updateOtp(email, otp, otpExpire);

        const sendOTPEmail = require("../utils/mail");
        await sendOTPEmail(email, otp);

        return res.json({
            success: true,
            message: "New OTP sent to your email"
        });
    }

    // Password Hash
    const hashPassword = await bcrypt.hash(password, 10);

    // New User Create
    await User.createUser(
        fullname,
        email,
        mobile,
        hashPassword,
        otp,
        otpExpire,
        "inactive"
    );

    const sendOTPEmail = require("../utils/mail");
    await sendOTPEmail(email, otp);

    res.json({
        success: true,
        message: "OTP sent to your email"
    });
};


const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.json({
                success: false,
                message: "All fields are required"
            });

        }

        const user = await User.checkEmail(email);

        if (user.length === 0) {

            return res.json({
                success: false,
                message: "Invalid Email"
            });

        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {

            return res.json({
                success: false,
                message: "Invalid Password"
            });

        }

     if (user[0].status !== "active") {
    return res.json({
        success: false,
        message: "Please verify OTP first"
    });
}
        const token = jwt.sign(

            {
                id: user[0].id,
                email: user[0].email,
                role: user[0].role
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRE
            }

        );


        res.json({

            success: true,

            message: "Login Successfully",

            token,

            user: {

                id: user[0].id,

                fullname: user[0].fullname,

                email: user[0].email,

                role: user[0].role

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const verifyOtp = async (req, res) => {

    const { mobile, otp } = req.body;

    const user = await User.findByMobile(mobile);

    if (user.length === 0) {
        return res.json({ success: false, message: "User not found" });
    }

    const dbUser = user[0];

    if (dbUser.otp != otp) {
        return res.json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > new Date(dbUser.otp_expire)) {
        return res.json({ success: false, message: "OTP expired" });
    }

    await User.activateUser(mobile);

    res.json({
        success: true,
        message: "Account verified successfully"
    });
};

const googleLogin = async (req, res) => {

    try {

        const {

            fullname,

            email,

            google_id,

            profile_image

        } = req.body;

        let user = await User.findGoogleUser(email);

        if (user.length === 0) {

            await User.createGoogleUser(

                fullname,

                email,

                google_id,

                profile_image

            );

            user = await User.findGoogleUser(email);

        }

        const token = jwt.sign(

            {

                id: user[0].id,

                email: user[0].email,

                role: user[0].role

            },

            process.env.JWT_SECRET,

            {

                expiresIn: process.env.JWT_EXPIRE

            }

        );

        res.json({

            success: true,

            message: "Google Login Successful",

            token,

            user: user[0]

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: "Email is required"
            });
        }

        const user = await User.findByEmail(email);

        if (user.length === 0) {

            return res.json({
                success: false,
                message: "Email not found"
            });

        }

        const otp = Math.floor(100000 + Math.random() * 900000);

        const otpExpire = new Date(Date.now() + 5 * 60 * 1000);

        await User.updateForgotOtp(email, otp, otpExpire);

        const sendOTPEmail = require("../utils/mail");

        await sendOTPEmail(email, otp);

        res.json({

            success: true,

            message: "OTP sent successfully"

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

};

const verifyForgotOtp = async (req, res) => {

    const { email, otp } = req.body;

    const user = await User.findByEmail(email);

    if (user.length === 0) {

        return res.json({
            success: false,
            message: "User not found"
        });

    }

    if (user[0].otp != otp) {

        return res.json({
            success: false,
            message: "Invalid OTP"
        });

    }

    if (new Date() > new Date(user[0].otp_expire)) {

        return res.json({
            success: false,
            message: "OTP Expired"
        });

    }

    res.json({

        success: true,

        message: "OTP Verified"

    });

};


const resetPassword = async (req, res) => {

    const {

        email,

        password,

        confirmPassword

    } = req.body;

    if (password !== confirmPassword) {

        return res.json({

            success: false,

            message: "Password Not Match"

        });

    }

    const hashPassword = await bcrypt.hash(password, 10);

    await User.updatePassword(

        email,

        hashPassword

    );

    res.json({

        success: true,

        message: "Password Changed Successfully"

    });

};
module.exports = {
    verifyOtp,
    signup,
    login,
    googleLogin,
    forgotPassword,
    verifyForgotOtp,
    resetPassword 
};