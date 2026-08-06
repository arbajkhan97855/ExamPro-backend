
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const pool = require("../config/db");


const createPaymentOrder = async (req, res) => {

    try {

        const {
            examSlug,
            examName,
            amount
        } = req.body;

        if (!examSlug || !examName || !amount) {

            return res.status(400).json({
                success: false,
                message: "Exam details and amount are required"
            });

        }

        const amountInPaise = Math.round(Number(amount) * 100);

        if (amountInPaise <= 0) {

            return res.status(400).json({
                success: false,
                message: "Invalid payment amount"
            });

        }

        const options = {

            amount: amountInPaise,

            currency: "INR",

            receipt: `exam_${Date.now()}`,

            notes: {
                examSlug,
                examName
            }

        };

        const order = await razorpay.orders.create(options);

        return res.status(201).json({

            success: true,

            message: "Payment order created successfully",

            order: {

                id: order.id,

                amount: order.amount,

                currency: order.currency

            }

        });

    } catch (error) {

        console.error(
            "Create Payment Order Error:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Unable to create payment order"

        });

    }

};


const verifyPayment = async (req, res) => {

    try {

    const {
    examSlug,
    examName,
    amount,
    paymentMethod,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
} = req.body;

const userId = req.user.id;

    if (
    !examSlug ||
    !examName ||
    !amount ||
    !paymentMethod ||
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature
) {
    return res.status(400).json({
        success: false,
        message: "Payment details are required"
    });
}

        // =========================
        // VERIFY RAZORPAY SIGNATURE
        // =========================

        const generatedSignature = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");


        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({

                success: false,

                message: "Invalid payment signature"

            });

        }

        const [alreadyPaid] = await pool.execute(

    `SELECT id
     FROM payments
     WHERE razorpay_payment_id = ?`,

    [razorpay_payment_id]

);

if (alreadyPaid.length > 0) {

    return res.status(400).json({

        success: false,

        message: "Payment already verified"

    });

}

const [alreadyPurchased] = await pool.execute(

    `SELECT id
     FROM payments
     WHERE user_id = ?
     AND exam_slug = ?
     AND status = 'paid'`,

    [userId, examSlug]

);

if (alreadyPurchased.length > 0) {

    return res.status(400).json({

        success: false,

        message: "Exam already purchased"

    });

}


        // =========================
        // SAVE PAYMENT IN TiDB
        // =========================

      const [result] = await pool.execute(

    `INSERT INTO payments
    (
        user_id,
        exam_slug,
        exam_name,
        amount,
        currency,
        payment_method,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status,
        paid_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,

    [
        userId,
        examSlug,
        examName,
        amount,
        "INR",
        paymentMethod,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        "paid"
    ]

);


        return res.status(200).json({

            success: true,

            message: "Payment verified and saved successfully",

            paymentId: result.insertId

        });


    } catch (error) {

        console.error(
            "Payment Verification Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Payment verification failed"

        });

    }

};

module.exports = {
    createPaymentOrder,
    verifyPayment
};