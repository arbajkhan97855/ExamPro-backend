const db = require("../config/db");

// Email Check
const checkEmail = async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(sql, [email]);
    return rows;
};

// Insert User
const createUser = async (
    fullname,
    email,
    mobile,
    password,
    otp,
    otpExpire,
    status
) => {
    const sql = `
        INSERT INTO users
        (fullname, email, mobile, password, otp, otp_expire, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        fullname,
        email,
        mobile,
        password,
        otp,
        otpExpire,
        status
    ]);

    return result;
};

// Login Email Check
const checkLoginEmail = async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(sql, [email]);
    return rows;
};

// Google user find
const findGoogleUser = async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(sql, [email]);
    return rows;
};

// Create Google user
const createGoogleUser = async (
    fullname,
    email,
    google_id,
    profile_image
) => {
    const sql = `
        INSERT INTO users
        (
            fullname,
            email,
            google_id,
            profile_image,
            auth_provider,
            role,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
        fullname,
        email,
        google_id,
        profile_image,
        "google",
        "student",
        "active"
    ]);

    return result;
};

// Find by mobile
const findByMobile = async (mobile) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE mobile = ?",
        [mobile]
    );
    return rows;
};

// Activate user
const activateUser = async (mobile) => {
    await db.query(
        `UPDATE users 
         SET status = 'active', otp = NULL, otp_expire = NULL 
         WHERE mobile = ?`,
        [mobile]
    );
};

// Update OTP
const updateOtp = async (email, otp, otpExpire) => {
    await db.query(
        `UPDATE users SET otp = ?, otp_expire = ? WHERE email = ?`,
        [otp, otpExpire, email]
    );
};

// Find by email
const findByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows;
};

// Forgot OTP update
const updateForgotOtp = async (email, otp, otpExpire) => {
    await db.query(
        `UPDATE users SET otp = ?, otp_expire = ? WHERE email = ?`,
        [otp, otpExpire, email]
    );
};

// Update password
const updatePassword = async (email, password) => {
    await db.query(
        `UPDATE users SET password = ?, otp = NULL, otp_expire = NULL WHERE email = ?`,
        [password, email]
    );
};

const getAllUsers = async () => {

    const sql = `
        SELECT
           *
        FROM users
        ORDER BY id DESC
    `;

    const [rows] = await db.query(sql);

    return rows;
};

module.exports = {
    findByEmail,
    updateForgotOtp,
    updatePassword,
    checkEmail,
    createUser,
    checkLoginEmail,
    findGoogleUser,
    createGoogleUser,
    findByMobile,
    activateUser,
    updateOtp,
    getAllUsers
};