import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // ตั้งชื่อไว้ว่า token
    const token = req.cookies.token;

    if (!token)
        return res.status(401).json({ success: false, message: "Unauthorized - no token provided"});

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded)
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token"});

        req.userId = decoded.userId;
        next(); //next ที่เขียนไว้ด้านบน
    }
    catch (error) {
        console.log("Error in verifyToken", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}