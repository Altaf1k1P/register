import { User } from '../models/user.models.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = async (req, res, next) => {
    try {
        // Extract the token from cookies or Authorization header
        const authHeader = req.header("Authorization");
        const token = req.cookies?.accessToken || authHeader?.replace("Bearer ", "");

        // Debugging: Log token only in non-production environments
        if (process.env.NODE_ENV !== 'production') {
            console.log("Token:", token);
        }

        // Check if token is missing or invalid
        if (!token) {
            return res.status(401).json({ error: "Access token is missing. Please log in." });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken || !decodedToken._id) {
            return res.status(401).json({ error: "Invalid access token structure" });
        }

        // Debugging: Log decoded token only in non-production environments
        if (process.env.NODE_ENV !== 'production') {
            console.log("Decoded Token:", decodedToken);
        }

        // Fetch the user from the database
        const user = await User.findById(decodedToken._id).select("-password -refreshToken");
        if (!user) {
            return res.status(401).json({ error: "User not found or invalid access token" });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error) {
        // Handle token-specific errors (e.g., expiration)
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Access token has expired. Please log in again." });
        }
        return res.status(401).json({ error: error.message || "Invalid access token" });
    }
};
