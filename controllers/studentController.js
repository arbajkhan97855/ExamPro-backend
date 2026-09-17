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
                id,
                exam_slug,
                exam_name,
                amount,
                currency,
                payment_method,
                razorpay_order_id,
                razorpay_payment_id,
                status,
                created_at,
                paid_at
            FROM payments
            WHERE user_id = ?
            AND status = 'paid'
            ORDER BY paid_at DESC, created_at DESC`,

            [userId]

        );

        return res.status(200).json({

            success: true,

            count: rows.length,

            exams: rows

        });

    } catch (error) {

        console.error(
            "Get My Exams Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Unable to fetch purchased exams"

        });

    }

};


module.exports = {

    getProfile,

    getMyExams

};