import {Post} from "../models/post.models.js"
import {User} from "../models/user.models.js"
import { isValidObjectId } from "mongoose";



//create a new post

const createPost = async (req, res) => {
    try {
        const { title, content} = req.body;
        const userId = req.user?._id;
    if (!title || !content) {
        res.status(400).json({error:"Please provide title, content and userId"});
    }
if(!isValidObjectId(userId)){
    res.status(400).json({error:"Invalid userId"});
}
    
    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        req.json({error:"User not found"});
    }
    
    // Create the post
    const post = await Post.create(
        { 
        title, 
        content,
        owner: req.user._id // Assuming req.user has a _id property and it's the user who created the post. Replace this with the actual user ID.  // the user ID is obtained from the user who is logged in.
        })
    return res.status(201).json({ post });
    } catch (error) {
        res.status(500).json({ error: "something went wrong while creating post"})
    }
    
};

//get all posts

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate("owner");
        res.status(200).json(posts);
        
    } catch (error) {
        res.status(500).json({ error: "something went wrong while getting posts"})
    }
    
};

//get my post
const getMyPost = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from route params

      
          // Find all posts where the `owner` matches
    const userPosts = await Post.find({ owner: userId });
    
        if (!userPosts || userPosts.length === 0) {
          return res.status(404).json({ message: "No posts found for this user." });
        }
    
        // Send the posts as a response
        res.status(200).json(userPosts)

    } catch (error) {
        // Log the error for debugging
        //console.error("Error while retrieving posts:", error);

        // Return a server error response
        return res.status(500).json({ error: "Server error while retrieving posts" });
    }
};

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




//update post

const updatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const { postId } = req.params;

        // Log the postId for debugging
        //console.log(`Received postId: ${postId}`);

        // Validate postId
        if (!isValidObjectId(postId)) {
            return res.status(404).json({ error: "PostId is not valid" });
        }

        // Validate input fields
        if (!title?.trim() || !content?.trim()) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Find the post by ID
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        // Log the retrieved post for debugging
        //console.log(`Retrieved post: ${post}`);

        // Check ownership
        if (post.owner.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ error: "You are not authorized to edit this post" });
        }

        // Update the post
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $set: { title: title.trim(), content: content.trim() } },
            { new: true } // Return the updated document
        );

        // Handle case where the post is not updated
        if (!updatedPost) {
            return res.status(404).json({ error: "Post not found or not updated" });
        }

        // Log the updated post for debugging
        //console.log(`Updated post: ${updatedPost}`);

        // Return the updated post
        return res.status(200).json({ updatedPost });

    } catch (error) {
        // Log the error for debugging
        //console.error("Error while updating the post:", error);

        // Return a server error response
        return res.status(500).json({ error: "Something went wrong while updating the post" });
    }
};


//delete post

const deletePost = async (req, res) => {
    console.log("Deleting post...");
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      if (!post) {
        console.log("Post not found");
        return res.status(404).json({ error: "Post not found" });
      }
  
      if (post.owner.toString() !== req.user.id) {
        console.log("Unauthorized attempt to delete");
        return res.status(403).json({ error: "Not authorized" });
      }
  
      await Post.findByIdAndDelete(postId);
      console.log("Post deleted successfully");
      return res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Failed to delete post" });
    }
  };
  

export { createPost, getMyPost, getAllPosts, updatePost, deletePost };