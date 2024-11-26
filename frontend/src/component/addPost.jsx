import React,{useState} from 'react'
import {createPost} from "../Store/postSlice.js"
import { useDispatch } from 'react-redux'
import Container from './container.jsx'
import { useNavigate } from 'react-router-dom';


function AddPost() {
  const [post, setPost] = useState({title: '', content: ''});
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
       
    await dispatch(createPost(post)).unwrap();

      alert('post created successfully!');
      navigate('/');

    } catch (err) {
      console.error('post creation failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
   
  }

  return (
    
      <div className="">
        <Container>
        <div className='flex flex-col justify-center items-center bg-zinc-800 shadow-sm max-w-sm h-full mt-4'>
         <h2 className='mt-2'>add-post</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
              <div className='flex flex-col m-2'>
                  <label htmlFor="Title">Title</label>
                  <input
                      type="text"
                      placeholder="Title..."
                       className='px-2 py-1 w-full mb-1'
                      value={post.title}
                      onChange={(e) => setPost({ ...post, title: e.target.value })}
                      required
                  />
              </div>
              
              <div className='flex flex-col m-2'>
                  <label htmlFor="content">contant</label>
                  <textarea
                     
                      placeholder="contant.."
                       className='px-2 py-1 w-full mb-1'
                      value={post.content}
                      onChange={(e) => setPost({ ...post, content: e.target.value })}
                      required
                  />
              </div>
              <button type="submit" className='m-2 px-3 py-3 bg-slate-950 rounded-sm'>AddPost</button>
          </form>

        </div>
            
        </Container>
       
      </div>
  )
}

export default AddPost
