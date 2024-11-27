import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, deletePost } from "../Store/postSlice.js";
import { selectUser } from "../Store/authSlice.js";
import { Link } from "react-router-dom";

const Home = () => {
    const dispatch = useDispatch();

    // Ensure default values for posts
    const { posts=[], loading, error } = useSelector((state) => state.post);
    const user = useSelector(selectUser);
   console.log(posts);
    

    useEffect(() => {
        dispatch(getAllPosts());
    }, [dispatch]);

    const handleDelete = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            dispatch(deletePost(postId));
        }
    };

    if (loading) return <p className="text-center text-gray-500">Loading posts...</p>;
    if (error) return <p className="text-center text-red-500">Error: {error.toString()}</p>;

    return (
        <div className="container mx-auto my-8 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">All Posts</h1>

            {posts.length === 0 ? (
                <p className="text-center text-gray-600">No posts available.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post._id || post.id}
                            className="bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden"
                        >
                            <div className="p-4">
                                <h3 className="text-xl font-semibold text-gray-800 truncate">{post.title}</h3>
                                <p className="text-gray-700 mt-2 line-clamp-3">{post.content}</p>
                                <p className="text-sm text-gray-500 mt-4">
                                    Posted by: {post.owner?.username || "Unknown"} on{" "}
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            {user?._id === post.owner?._id && (
                                <div className="flex justify-between items-center border-t border-gray-200 p-4">
                                    <Link
                                        to={`/${post._id}`}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        to="#"
                                        onClick={() => handleDelete(post._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </Link>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
