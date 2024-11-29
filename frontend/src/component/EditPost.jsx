import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../Store/postSlice';
import { useNavigate, useParams } from 'react-router-dom';
import Container from './Container.jsx';

function EditPost() {
  const { postId } = useParams();
  const posts = useSelector((state) => state.post.posts);
  const post = posts.find((p) => p?._id === postId);
  const [updatedPost, setUpdatedPost] = useState({ title: '', content: '' });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user); 
  const userId = user.userId
  //console.log("userId for update",userId);
  
  useEffect(() => {
    if (post) {
      setUpdatedPost({ title: post.title, content: post.content });
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updatePost({ postId, ...updatedPost })).unwrap();
      alert('Post updated successfully!');
      navigate(`/my-post/${userId}`);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <Container>
      <div className="container max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Update Post</h1>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-semibold mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={updatedPost.title}
              onChange={(e) => setUpdatedPost({ ...updatedPost, title: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block text-lg font-semibold mb-2">
              Content
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={updatedPost.content}
              onChange={(e) => setUpdatedPost({ ...updatedPost, content: e.target.value })}
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600"
            >
              Update Post
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default EditPost;
