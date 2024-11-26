import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../Store/postSlice';
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
  const { postId } = useParams();
  const posts = useSelector((state) => state.post.posts);
  const post = posts.find((p) => p?._id === postId);
  const [updatedPost, setUpdatedPost] = useState(post || { title: '', content: '' });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //console.log(updatedPost.title, updatedPost.content);
//console.log('useParams output:', useParams());


  //console.log('postId:', postId, typeof postId);
//console.log('Posts:', posts);

  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updatePost({ postId, data: updatedPost })).unwrap();
      alert('Post updated successfully!');
      navigate('/');
    } catch (err) {
      //console.error('Post update failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="container">
      <h2>Edit Post</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={updatedPost.title}
          onChange={(e) => setUpdatedPost({ ...updatedPost, title: e.target.value })}
          required
        />
        <label>Content</label>
        <textarea
          value={updatedPost.content}
          onChange={(e) => setUpdatedPost({ ...updatedPost, content: e.target.value })}
          required
        />
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}

export default EditPost;
