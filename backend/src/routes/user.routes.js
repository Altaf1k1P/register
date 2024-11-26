import { Router } from "express"
import { register, login, logout } from "../controllers/user.controller.js";
import {verifyJWT} from '../middleware/auth.middleware.js'

const router = Router();

// Register a new user
router.route('/signup').post(register)

// Login user
router.route('/login').post(login)

// Logout user
router.route('/logout').post(verifyJWT, logout)

export default router;

