import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";
export const authMiddleware = async (req, res, next) => {
    const token = req.headers['token'];

    if (!token) {
        return res.status(401).json({ status: "fail", message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.headers.email = decoded.email;
        next();
    } catch (error) {
        return res.status(401).json({ status: "fail", message: "Invalid or expired token" });
    }
}