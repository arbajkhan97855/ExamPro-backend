const Student = require("../models/studentModel");
const pool = require("../config/db");

const getProfile = async (req, res) => {

    try {

        const userId = req.user.id;

        const user = await Student.getStudentById(userId);

        if (user.length === 0) {

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        res.json({
            success: true,
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


// ===========================
// MY PURCHASED EXAMS
// ===========================

const getMyExams = async (req, res) => {

    try {

        const userId = req.user.id;

        const [rows] = await pool.execute(

            `SELECT
                exam_slug,
                exam_name,
                amount,
                payment_date,
                razorpay_payment_id
            FROM payments
            WHERE user_id = ?
            AND status='paid'
            ORDER BY payment_date DESC`,

            [userId]

        );

        return res.json({

            success: true,

            exams: rows

        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};


module.exports = {

    getProfile,

    getMyExams

};