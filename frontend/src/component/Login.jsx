import React, {useState} from 'react'
import { login } from '../Store/authSlice'
import Container from "./container.jsx"
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom"; 



function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setformData] = useState({username: '', password: ''})
  const [error , setError] = useState(null)
  const { loading } = useSelector((state) => state.auth);
  //console.log(error);
  
 

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(login(formData)).unwrap();
      //console.log('Login response:', response);  // Log the entire response
      
      
      if (response.accessToken) {
        // Store the access token
        localStorage.setItem('accessToken', response.accessToken);
        
        navigate('/');  // Redirect to home page
      } else {
        setError('Access token is missing!');
      }
    } catch (err) {
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
          value={formData.username}
                onChange={(e) => setformData({ ...formData, username: e.target.value })}
                 />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className='block text-lg font-semibold mb-2'>Password</label>
          <input 
          type="password" 
          placeholder='username..' 
         className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={formData.password}
                onChange={(e) => setformData({ ...formData, password: e.target.value })} 
          />
          </div>
          
          <div className="flex justify-between items-center">
          <button
              type="submit"
              className=" py-2 px-4 text-white font-medium rounded-md bg-blue-500 hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Login..." : "Login"}
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

