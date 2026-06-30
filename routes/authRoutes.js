const express = require("express");

const router = express.Router();

const { signup, login, googleLogin, verifyOtp, forgotPassword, verifyForgotOtp, resetPassword } = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.post("/google-login", googleLogin);

router.post("/verify-otp", verifyOtp);

router.post("/forgot-password", forgotPassword);

router.post("/verify-forgot-otp", verifyForgotOtp);

router.post("/reset-password", resetPassword);


module.exports = router;