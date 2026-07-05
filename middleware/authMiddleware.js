const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    try {

        // Authorization Header
        const authHeader = req.headers.authorization;

        // Check Token Exists
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Access Denied. No Token Provided."
            });
        }

        // Remove Bearer
        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save User Data
        req.user = decoded;

        // Continue
        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });

    }

};

module.exports = authMiddleware;