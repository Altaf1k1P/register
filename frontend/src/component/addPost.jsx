import React, { useState } from 'react';
import { createPost } from "../Store/postSlice.js";
import { useDispatch } from 'react-redux';
import Container from './container.jsx';
import { useNavigate } from 'react-router-dom';

function AddPost() {
  const [post, setPost] = useState({ title: '', content: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await dispatch(createPost(post)).unwrap();
      alert('Post created successfully!');
      navigate('/');
    } catch (err) {
      console.error('Post creation failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Container>
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">Add Post</h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-4">{error}</p>
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
                placeholder="Enter a title..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
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
                placeholder="Enter content..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                value={post.content}
                onChange={(e) => setPost({ ...post, content: e.target.value })}
                required
                aria-label="Post content"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-2 px-4 text-white font-medium rounded-md ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
              }`}
              disabled={loading}
            >
              {loading ? 'Adding Post...' : 'Add Post'}
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default AddPost;
