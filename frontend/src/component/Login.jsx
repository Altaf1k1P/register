import React, {useState} from 'react'
import { loginUser } from '../Store/authSlice'
import Container from "./container.jsx"
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom"; 



function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [credentials, setCredentials] = useState({username: '', password: ''})
  const [error , setError] = useState(null)
  console.log(error);
  
 

  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(credentials)).unwrap();
     console.log("Dispatching credentials:", credentials); // Debug log
    alert('Account created successfully!');
          navigate('/');

    } catch (err) {
      console.error('login failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
};


  return (

    <>
    
      <Container>
        <div className='flex  justify-center items-center bg-zinc-800 shadow-sm max-w-sm h-5/6 mt-4'>

        <div className='flex flex-col justify-center items-center m-4'>
          <h1 className='text-center'>Login</h1>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
             <label htmlFor="username">Username</label>
          <input 
          type="text" 
          placeholder='username..' 
          className='px-2 py-1 w-full mb-1'
          value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                 />
          <label htmlFor="password">Password</label>
          <input 
          type="password" 
          placeholder='username..' 
          className='px-2 py-1 w-full mb-1'
          value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
          />
          <button type='submit' className='bg-zinc-800 px-4 py-3 '>Login</button>


          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
                    don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:underline">
                        Signup
                    </Link>
                </p>
         


        </div>
        
        </div>
      </Container>
  
    </>
  )
}

export default Login
