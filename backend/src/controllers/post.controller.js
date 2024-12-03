import {Post} from "../models/post.models.js"
import {User} from "../models/user.models.js"
import { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utills/asyncHandler.js";
import { ApiError } from "../utills/ApiError.js";
import { ApiResponse } from "../utills/ApiResponse.js";



//create a new post

const createPost = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;
        const userId = req.user?._id;

        if (!title || !content) {
            return res.status(400).json(new ApiError("Please provide title, content, and userId"));
        }

        if (!isValidObjectId(userId)) {
            return res.status(400).json(new ApiError("Invalid userId"));
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json(new ApiError("User not found"));
        }

        // Create the post
        const post = await Post.create({ 
            title, 
            content,
            owner: req.user._id 
        });

        return res.status(201).json(new ApiResponse(201, post));
    } catch (error) {
        //console.error("Error creating post:", error);
        return res.status(500).json(new ApiError("Something went wrong while creating post"));
    }
});



//get all posts

const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find().populate("owner", "username email");  // Populate with specific fields
        return res.status(200).json(new ApiResponse(200, posts));
    } catch (error) {
        //console.error("Error getting posts:", error);
        return res.status(500).json(new ApiError("Something went wrong while getting posts"));
    }
});


//get my post
const getMyPost = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;

        if (!isValidObjectId(userId)) {
            return res.status(400).json({ error: "Invalid userId" });
        }

        // Fetch posts of the user
        const userPosts = await Post.find({ owner: userId });

        // Check if there are posts for the user
        if (!userPosts || userPosts.length === 0) {
            return res.status(404).json({ message: "No posts found for this user." });
        }

        // Optionally, check if the logged-in user is the owner of these posts
        if (userId !== req.user?._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to access these posts" });
        }

        return res.status(200).json(new ApiResponse(200, userPosts));
    } catch (error) {
        //console.error("Error retrieving posts:", error);
        return res.status(500).json({ error: "Server error while retrieving posts" });
    }
});



// const getPostById = async (req, res) => {
//     const {postId} = req.params;
    
//     if(!isValidObjectId(postId)){
//       res.json({ error:"Invalid postId"})
//     }
//     const post = await Post.findById(postId).populate("owner");
    
//     if(!post){
//       res.json({ error:"post not found"})
//     }
//     res.status(200).json(post)  

// };




const updatePost = asyncHandler(async (req, res) => {
    try {
        const { title, content } = req.body;
        const { postId } = req.params;

        if (!isValidObjectId(postId)) {
            return res.status(404).json({ error: "PostId is not valid" });
        }

        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.owner.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to edit this post" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: { title: title.trim(), content: content.trim() } },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found or not updated" });
        }

        return res.status(200).json(new ApiResponse(200, updatedPost, "Post updated successfully"));
    } catch (error) {
        //console.error("Error while updating the post:", error);
        return res.status(500).json({ error: error.message || "Internal server error" });
    }
});




//delete post

const deletePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;

        if (!isValidObjectId(postId)) {
            return res.status(400).json({ error: "Invalid postId" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        if (post.owner.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ error: "Not authorized to delete this post" });
        }

        await Post.findByIdAndDelete(postId);
        return res.status(200).json(new ApiResponse(200, { message: "Post deleted successfully" }));
    } catch (error) {
        //console.error("Error while deleting the post:", error);
        return res.status(500).json({ error: "Failed to delete post" });
    }
});





  

export { createPost, getMyPost, getAllPosts, updatePost, deletePost };