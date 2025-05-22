const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    console.log("Received Token:", token);  // ✅ Debugging

    if (!token) return res.status(401).json({ message: "No token, authorization denied" });

    try {
        const tokenWithoutBearer = token.replace("Bearer ", ""); // ✅ Remove 'Bearer ' if present
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        console.log("Decoded Token:", decoded);  // ✅ Debugging
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error);
        res.status(401).json({ message: "Invalid token" });
    }
};





module.exports = authMiddleware;
