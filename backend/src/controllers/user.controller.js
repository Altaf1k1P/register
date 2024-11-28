import {User} from "../models/user.models.js"
import jwt from "jsonwebtoken"



//token
const genrateAccessAndRefreshToken = async (userId) => {
    try {
        // Step 1: find user 
      const user =  await User.findById(userId)//now we have user

      // Step 2: Generate access token and refresh token
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();
        
        // Ensure tokens are valid strings
    //     if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
    //       throw new error(500, "Failed to generate valid tokens");
    //   }


        user.refreshToken = refreshToken;
       await user.save({
           validateBeforeSave: false
        })

        return { accessToken, refreshToken };
        
    } catch (error) {
        throw new error(500, "something went wrong while generating access and refresh tokens")
    }
};

//register user 
const register = async (req, res) => {
    try {
        const {username, email, password} = req.body;
    
        if (!username ||!email ||!password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        
        const user = await User.create({ username, email, password });
        
      return  res.status(201).json({user});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
    }

//login user
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Please provide all required fields" });
        }

        const user = await User.findOne({ username });
        if (!user || !(await user.isPasswordCorrect(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(user._id);

        const loginUser = await User.findById(user._id).select("-password -refreshToken");
        console.log(loginUser);

        const options = {
            httpOnly: true, // Prevent frontend from accessing cookies
            secure: process.env.NODE_ENV === "production", // Use HTTPS in production
            sameSite: "lax", // Adjust based on your cross-origin requirements
        };

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json({ loginUser, accessToken, refreshToken });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server Error" });
    }
};


const logout = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { refreshToken: "" }, { new: true });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        };

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "User logged out" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Something went wrong while logging out" });
    }
};


 const refreshAccessToken = async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        // Check if refreshToken is present
        if (!incomingRefreshToken) {
            return res.status(401).json({ error: "Refresh token is missing" });
        }

        // Your existing logic to validate and refresh tokens
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // Generate new access token
        const newAccessToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m",
        });

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(401).json({ error: error.message });
    }
};



//get current user



export {
    register,
    login,
    logout,
    refreshAccessToken
}