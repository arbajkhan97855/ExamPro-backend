const db = require("../config/db");

// Email Check
const checkEmail = async (email) => {

    const sql = "SELECT * FROM users WHERE email = ?";

    const [result] = await db.execute(sql, [email]);

    return result;

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

    const [result] = await db.execute(sql, [
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


const checkLoginEmail = async (email) => {

    const sql = "SELECT * FROM users WHERE email = ?";

    const [result] = await db.execute(sql, [email]);

    return result;

};


const findGoogleUser = async (email) => {

    const sql = "SELECT * FROM users WHERE email = ?";

    const [result] = await db.execute(sql, [email]);

    return result;

};

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

    const [result] = await db.execute(sql, [

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

const findByMobile = async (mobile) => {
    const [rows] = await db.execute(
        "SELECT * FROM users WHERE mobile = ?",
        [mobile]
    );
    return rows;
};

const activateUser = async (mobile) => {
    await db.execute(
        `UPDATE users 
         SET status = 'active', otp = NULL, otp_expire = NULL 
         WHERE mobile = ?`,
        [mobile]
    );
};


const updateOtp = async (email, otp, otpExpire) => {
    const sql = `
        UPDATE users
        SET otp = ?, otp_expire = ?
        WHERE email = ?
    `;

    await db.execute(sql, [
        otp,
        otpExpire,
        email
    ]);
};


// Find user by email
const findByEmail = async (email) => {

    const [rows] = await db.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows;
};

// Update Forgot OTP
const updateForgotOtp = async (email, otp, otpExpire) => {

    await db.execute(
        `UPDATE users
         SET otp = ?, otp_expire = ?
         WHERE email = ?`,
        [otp, otpExpire, email]
    );
};

// Update Password
const updatePassword = async (email, password) => {

    await db.execute(
        `UPDATE users
         SET password = ?, otp = NULL, otp_expire = NULL
         WHERE email = ?`,
        [password, email]
    );
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
    updateOtp

};