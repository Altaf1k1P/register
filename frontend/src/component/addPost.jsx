import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux"; // Added useSelector
import { addPost } from "../Store/postSlice.js"; // Import the addPost thunk
import { useNavigate } from "react-router-dom";
import Container from "./Container.jsx";

const AddPost = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const { loading } = useSelector((state) => state.post); // Access loading state from Redux

  const handleChange = (e) => {
    // Check if the function is firing correctly
    //console.log(e.target.name, e.target.value); // Log name and value of the input field
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors
    try {
      // Dispatch the addPost action from Redux
      await dispatch(addPost(form)).unwrap(); // .unwrap() allows you to catch any errors
      alert("Post added successfully!");
      navigate("/"); // Redirect to the homepage or another appropriate page
    } catch (error) {
      console.error(error);
      alert("Failed to add post");
      setError(error.response?.data?.message || error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Container>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Add Post</h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4" aria-live="assertive">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Title Field */}
            <div className="mb-4">
              <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"  // Ensure this is correct
                placeholder="Enter a title..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={form.title}
                onChange={handleChange}
                required
                aria-label="Post title"
              />
            </div>

            {/* Content Field */}
            <div className="mb-4">
              <label htmlFor="content" className="block text-gray-700 font-medium mb-1">
                Content
              </label>
              <textarea
                id="content"
                name="content" // Ensure this is correct as well
                placeholder="Enter content..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={form.content}
                onChange={handleChange}
                required
                aria-label="Post content"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 px-4 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Post"}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default AddPost;
