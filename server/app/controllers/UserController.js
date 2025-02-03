import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { JWT_SECRET } from "../config/config.js";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Registration
export const registration = async (req, res) => {
    try {
        const reqBody = req.body;

        // Check if the user already exists
        const user = await prisma.user.findUnique({
            where: { email: reqBody.email }
        });

        if (user) {
            return res.status(400).json({ status: "error", message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(reqBody.password, 10);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email: reqBody.email,
                password: hashedPassword,
                name: reqBody.name,
                mobile: reqBody.mobile
            },
        });

        return res.json({
            status: "success",
            message: "Registration successful",
            user: newUser,
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const reqBody = req.body;

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: reqBody.email }
        });

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
        res.status(500).json({ message: error.message });
    }
};

// Profile
export const profile = async (req, res) => {
    try {
        const email = req.headers.email;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        return res.json({
            status: "success",
            user,
        });
    } catch (error) {
        return res.status(500).json({ status: "error", message: error.message });
    }
};
