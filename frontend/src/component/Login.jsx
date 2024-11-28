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
  //console.log(error);
  
 

  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(credentials)).unwrap();
     //console.log("Dispatching credentials:", credentials); // Debug log
    alert('Account created successfully!');
          navigate('/');

    } catch (err) {
      //console.error('login failed:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    }
};


  return (

    <>
    
      <Container>
        <div className='className="container max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-md'>

        
          <h1 className='text-2xl font-bold mb-4'>Login</h1>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className='block text-lg font-semibold mb-2'>Username</label>
          <input 
          type="text" 
          placeholder='username..' 
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                 />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className='block text-lg font-semibold mb-2'>Password</label>
          <input 
          type="password" 
          placeholder='username..' 
         className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} 
          />
          </div>
          
          <div className="flex justify-between items-center">
          <button
            type="submit"
            className={'px-4 py-2 text-white rounded-md   bg-blue-500 hover:bg-blue-600'}
          >
            login
          </button>
           <p className="mt-4 text-sm text-center text-gray-600">
                    don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:underline">
                        Signup
                    </Link>
                </p>
                
        </div>
        </form>
      

         
         


        
        
        </div>
      </Container>
  
    </>
  )
}

export default Login

