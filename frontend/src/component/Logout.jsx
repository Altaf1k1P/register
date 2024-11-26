import React from 'react';
import { logoutUser, clearUser } from '../Store/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logoutUser())
            .then(() => {
                dispatch(clearUser());
                navigate('/login', { replace: true });
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };

    return (
        <button
            onClick={handleLogout}
            className="text-white px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
            Logout
        </button>
    );
}

export default Logout;
