import { User } from '../models/user.models.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        const token = req.cookies?.accessToken || authHeader?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                status: "error",
                message: "Access token is missing. Please log in.",
            });
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken || !decodedToken._id) {
            return res.status(401).json({
                status: "error",
                message: "Invalid access token structure.",
            });
        }

        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({
                status: "error",
                message: "User not found. Please log in again.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: "error",
                message: "Access token has expired. Please refresh your session.",
            });
        }
        return res.status(401).json({
            status: "error",
            message: error.message || "Invalid access token.",
        });
    }
};
