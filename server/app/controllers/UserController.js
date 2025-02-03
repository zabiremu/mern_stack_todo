import User from "../models/UserModal.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { JWT_SECRET } from "../config/config.js";
// registration
export const registration = async (req, res) => {
    try {
        let reqBody = req.body;
        let user = await User.findOne({ email: reqBody.email });

        if (user) {
            return res.status(400).json({ status: "error", message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(reqBody.password, 10);
        reqBody.password = hashedPassword;
        let newUser = new User(reqBody);
        await newUser.save();
        return res.json({
            status: "success",
            message: "Registration successful"
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.toString() });
    }
}

// login
export const login = async (req, res) => {
    try {
        const reqBody = req.body;

        // Find user by email
        const user = await User.findOne({ email: reqBody.email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(reqBody.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({
            message: 'Login successful',
            token,
            user: { email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: error.toString() });
    }
}

export const profile = async (req, res) => {
    const email = req.headers.email;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).json({ status: "error", message: "User not found" });
    }
    const reqBody = req.body;
    return res.json({
        status: reqBody,
        message: "Item show successfully"
    })
}
