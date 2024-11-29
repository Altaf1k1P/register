import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../Store/postSlice.js";
//import { selectUser } from "../Store/authSlice.js";
import { Link } from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.post);
    const posts = useSelector((state) => state.post.posts);
    //console.log("Posts from Redux: ", JSON.stringify(posts, null, 2)); // Pretty print the posts

    
   

    useEffect(() => {
        dispatch(fetchPosts()); // Fetch all posts
    }, [dispatch]);
   

    // const handleDelete = (postId) => {
    //     if (!postId) {
    //         console.error("Post ID is undefined"); // Additional logging
    //         return;
    //     }
    //     if (window.confirm("Are you sure you want to delete this post?")) {
    //         dispatch(deletePost(postId));
    //     }
    // };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
                <span className="ml-2 text-gray-500">Loading posts...</span>
            </div>
        );
    }

    if (error) {
        const errorMessage = typeof error === "string" ? error : error.message || "An unexpected error occurred.";
        return <p className="text-center text-red-500">Error: {errorMessage}</p>;
    }

    return (
        <div className="container mx-auto my-8 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">All Posts</h1>

            {posts.length === 0 ? (
                <div className="text-center">
                    <p className="text-gray-600">No posts available.</p>
                    <Link to="/create-post" className="text-blue-500 underline mt-2 inline-block">
                        Create a new post
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 truncate">{post.title}</h3>
                                <p className="text-gray-700 mt-2 line-clamp-3">{post.content}</p>
                                <p className="text-sm text-gray-500 mt-4">
                                    Posted by: {post.owner?.username || "Unknown"} on{" "}
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
