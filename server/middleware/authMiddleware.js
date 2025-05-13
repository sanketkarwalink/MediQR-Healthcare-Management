import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
        console.log("🔴 No Authorization header found");
        return res.status(401).json({ message: "Unauthorized: No token provided." });
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        console.log("🔴 Incorrect token format:", authHeader);
        return res.status(401).json({ message: "Unauthorized: Token format is incorrect." });
    }

    const token = tokenParts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🟢 Decoded Token:", decoded);

        if (!decoded.id) {
            console.log("🔴 User ID missing in decoded token!");
            return res.status(401).json({ message: "Unauthorized: User ID missing in token." });
        }

        req.user = decoded;
        console.log("🟢 Token Verified:", req.user);
        next();
    } catch (error) {
        console.log("🔴 Token verification failed:", error.message);
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Unauthorized: Token has expired." });
        } else if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Unauthorized: Token is invalid." });
        }
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export default authMiddleware;
