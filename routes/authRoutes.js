const express = require("express");

const router = express.Router();

const { signup, login, googleLogin, verifyOtp, forgotPassword, verifyForgotOtp, resetPassword,  getAllUsers } = require("../controllers/authController");

router.post("/signup", signup);

router.post("/login", login);

router.post("/google-login", googleLogin);

router.post("/verify-otp", verifyOtp);

router.post("/forgot-password", forgotPassword);

router.post("/verify-forgot-otp", verifyForgotOtp);

router.post("/reset-password", resetPassword);

router.get("/users", getAllUsers);

module.exports = router;