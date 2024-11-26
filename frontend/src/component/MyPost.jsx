import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myPost, deletePost } from "../Store/postSlice.js"; // Update the path as necessary
import { selectUser } from "../Store/authSlice.js";
import { Link } from "react-router-dom";

const MyPost = () => {
  const dispatch = useDispatch();

  // Redux state
  const { posts, loading, error } = useSelector((state) => state.post);
  const user = useSelector(selectUser);

  // Fetch all posts on component mount
  useEffect(() => {
    if (user?.id || user?._id) {
       dispatch(myPost(user.id || user._id));
    }
  }, [dispatch, user]);

  // Handle delete post
  const handleDelete = (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
     dispatch(deletePost(postId));
    }
  };

  // Render loading state
  if (loading) return <p className="text-center text-gray-500">Loading posts...</p>;

  // Render error state
  if (error) {
    const errorMessage = typeof error === "string" ? error : error?.message || "An unexpected error occurred.";
    return <p className="text-center text-red-500">{errorMessage}</p>;
  }

  // Render posts
  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts
            .filter((post) => post.owner === user?.id || user?._id) // Only show posts owned by the logged-in user
            .map((post) => (
              <div
                key={post.id || post._id}
                className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-gray-700 mt-2">{post.content}</p>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 p-4">
                  <button
                    onClick={() => handleDelete(post.id || post._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Delete
                  </button>
                  <Link to={`/${post._id}`}
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default MyPost;
