import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myPost, deletePost } from "../Store/postSlice.js";
import { Link, useNavigate, useParams } from "react-router-dom";

const MyPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Access posts, loading, and error from Redux store
  const { posts, loading, error } = useSelector((state) => state.post);
  const {userId} = useParams();

  useEffect(() => {
    if (!userId) {
      navigate("/login");  // Redirect to login if userId is not found
    } else {
      dispatch(myPost(userId));  // Fetch posts if userId exists
    }
  }, [dispatch, navigate, userId]);

  const handleDelete = (postId) => {
    dispatch(deletePost(postId));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto my-8">
      <h1 className="text-3xl font-bold text-center mb-6">My Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center text-gray-600">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200"
            >
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                <p className="text-gray-700 mt-2">{post.content}</p>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 p-4">
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
                <Link
                  to={`/${post._id}`}
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
