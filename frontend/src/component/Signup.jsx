import React, {useState} from 'react'
import { createAccount } from '../Store/authSlice.js'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import Container from './container.jsx'
import { Link } from 'react-router-dom';


function Signup() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          // Dispatch createAccount action with form data
          await dispatch(createAccount(formData)).unwrap();
          alert('Account created successfully!');
          navigate('/login'); // Redirect to login on success
      } catch (err) {
          // Handle errors
         // console.error('Signup failed:', err);
          setError(err.message || 'Something went wrong. Please try again.');
      }
  };

  return (
    <Container>
    <div className='className="container max-w-lg mx-auto mt-8 p-4 bg-white rounded-lg shadow-md'>
    
    
      <h1 className='text-2xl font-bold mb-4'>Signup</h1>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className='block text-lg font-semibold mb-2'>Username</label>
      <input 
      type="text" 
      placeholder='username..' 
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={formData.username}
    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
    required  />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className='block text-lg font-semibold mb-2'>Email</label>
      <input 
      type="text"  
      placeholder='email..' 
     className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
     value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
    required  />
      </div>
      <div className="mb-4 relative">
  <label
    htmlFor="password"
    className="block text-lg font-semibold mb-2"
  >
    Password
  </label>
  <div className="relative">
    <input
      type={isPasswordVisible ? "text" : "password"}
      id="password"
      placeholder="Enter your password"
      aria-label="Password"
      className="w-full p-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={formData.password}
      onChange={(e) =>
        setFormData({ ...formData, password: e.target.value })
      }
    />
    {/* Toggle Visibility Button */}
    <button
      type="button"
      onClick={togglePasswordVisibility}
      className="absolute top-1/2 transform -translate-y-1/2 right-3 text-gray-500 hover:text-blue-500 focus:outline-none"
      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
    >
      {isPasswordVisible ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.962 0-9-3.738-9-8.5S7.038 2 12 2c4.963 0 9 3.738 9 8.5a7.999 7.999 0 01-1.875 5.325m-1.61 1.62l-3.03 3.03a2.828 2.828 0 01-4-4l3.03-3.03"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12l-3-3m0 0l-3 3m3-3v6"
          />
        </svg>
      )}
    </button>
  </div>
</div>

      
      <div className="flex justify-between items-center">
      <button
        type="submit"
        className={'px-4 py-2 text-white rounded-md   bg-blue-500 hover:bg-blue-600'}
      >
        Signup
      </button>
       <p className="mt-4 text-sm text-center text-gray-600">
                 have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:underline">
                    Login
                </Link>
            </p>
            
    </div>
    </form>
    
    
     
     
    
    
    
    
    </div>
    </Container>
  );
};

export default Signup



