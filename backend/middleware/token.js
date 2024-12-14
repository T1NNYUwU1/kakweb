const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log("Authorization Header:", authHeader);

    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    console.log("Extracted Token:", token);

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
    }

    try {
        const secret = process.env.JWT_SECRET;
        console.log("JWT_SECRET:", secret); // Debug Log
        if (!secret) {
            throw new Error("JWT_SECRET is not defined in environment");
        }

        const decoded = jwt.verify(token, secret);
        console.log("Decoded Token:", decoded); // Debug Log

        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });
    }
};

module.exports = verifyToken;
