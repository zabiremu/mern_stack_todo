import express from 'express';
const router = express.Router();
import * as UserController from "../app/controllers/UserController.js"
import { authMiddleware } from '../app/middlewares/authMiddleware.js';

// Create
router.post("/register", UserController.registration)
router.post("/login", UserController.login)
router.post("/profile", authMiddleware, UserController.profile)

export default router;


