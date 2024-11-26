import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from "./Logout.jsx"
import { selectAuthStatus, selectUser } from '../Store/authSlice.js'

function Navbar() {
 const navigate = useNavigate()
 const status = useSelector(selectAuthStatus)
 const user = useSelector(selectUser)

 //console.log(status)

 const navItems = [
  { name: 'Home', slug: '/', active: true },
  { name: 'add-post', slug: '/add-post', active:status === 'succeeded'  },
 //{ name: 'edit-post', slug: '/edit-post/:postId', active: status === 'succeeded' },
  { name: 'my-post', slug: '/my-post', active: status === 'succeeded' },
  { name: 'Login', slug: '/login', active: status !== 'succeeded' },
  { name: 'Signup', slug: '/signup', active: status !== 'succeeded' },
];
  return (
    <nav className='top-0 static bg-stone-700'>
      <ul className="flex items-center space-x-4">
                {/* Dynamic Navigation Items */}
                {navItems.map(
                    (item) =>
                        item.active && (
                            <li key={item.name}>
                                <button
                                    onClick={() => navigate(item.slug)}
                                    className="text-white px-4 py-2 hover:bg-gray-700 rounded"
                                >
                                    {item.name}
                                </button>
                            </li>
                        )
                )}

                {/* Show Logout Button for Logged-In Users */}
                {status === 'succeeded' && (
                    <li>
                        <Logout />
                    </li>
                )}
            </ul>
    </nav>
  )
}

export default Navbar
