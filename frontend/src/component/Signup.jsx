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

  const handleSubmit = async (e) => {
      e.preventDefault();

      try {
          // Dispatch createAccount action with form data
          await dispatch(createAccount(formData)).unwrap();
          alert('Account created successfully!');
          navigate('/login'); // Redirect to login on success
      } catch (err) {
          // Handle errors
          console.error('Signup failed:', err);
          setError(err.message || 'Something went wrong. Please try again.');
      }
  };

  return (
      <div className="">
        <Container>
        <div className='flex flex-col justify-center items-center bg-zinc-800 shadow-sm max-w-sm h-full mt-4'>
         <h2 className='mt-2'>Signup</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
              <div className='flex flex-col m-2'>
                  <label htmlFor="username">Username</label>
                  <input
                      id="username"
                      type="text"
                      placeholder="Username"
                       className='px-2 py-1 w-full mb-1'
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                  />
              </div>
              <div className='flex flex-col m-2'>
                  <label htmlFor="email">Email</label>
                  <input
                      id="email"
                      type="email"
                      placeholder="Email"
                       className='px-2 py-1 w-full mb-1'
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                  />
              </div>
              <div className='flex flex-col m-2'>
                  <label htmlFor="password">Password</label>
                  <input
                      id="password"
                      type="password"
                      placeholder="Password"
                       className='px-2 py-1 w-full mb-1'
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                  />
              </div>
              <button type="submit" className='m-2 px-3 py-3 bg-slate-950 rounded-sm'>Signup</button>
          </form>
          <p className="m-4 text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline">
                        Login
                    </Link>
                </p>

        </div>
            
        </Container>
       
      </div>
  );
};

export default Signup
