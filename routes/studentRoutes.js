const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getProfile,
    getMyExams
} = require("../controllers/studentController");


// ==========================
// Student Profile
// ==========================

router.get(
    "/profile",
    authMiddleware,
    getProfile
);


// ==========================
// My Purchased Exams
// ==========================

router.get(
    "/my-exams",
    authMiddleware,
    getMyExams
);

module.exports = router;