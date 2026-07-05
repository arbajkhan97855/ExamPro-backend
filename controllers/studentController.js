const Student = require("../models/studentModel");

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

module.exports = {
    getProfile
};