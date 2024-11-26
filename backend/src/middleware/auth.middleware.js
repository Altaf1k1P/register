import {User} from '../models/user.models.js';
import jwt from 'jsonwebtoken';
 

export const verifyJWT = async (req, res, next) => {
    try {
       
        // Extract the token from cookies or the Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        
        console.log(token); // Debugging: log the token

        // Check if the token is present and is a valid string
        if (!token || typeof token !== "string") {
            return res.status(401).json({ error: "Unauthorized request - Token must be a valid string" });
        }

        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decodedToken); // Debugging:

        // Find the user by the ID from the token and exclude sensitive fields
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // If no user is found, return an unauthorized error
        if (!user) {
            return res.status(401).json({ error: "Invalid Access Token" });
        }

        // Attach the user to the request object and call next middleware
        req.user = user;
        next();
    } catch (error) {
        // Handle any token verification errors
        return res.status(401).json({ error: error?.message || "Invalid access token" });
    }
};
