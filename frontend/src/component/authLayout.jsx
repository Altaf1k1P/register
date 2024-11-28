import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectAuthStatus } from "../Store/authSlice.js";
import { useNavigate } from 'react-router-dom';

const AuthLayout = ({ children }) => {
    const authStatus = useSelector(selectAuthStatus);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    //console.log(authStatus);
    

    useEffect(() => {
        if (authStatus === 'succeeded') {
            setLoading(false);
        } else if (authStatus === 'idle' || authStatus === 'failed') {
            navigate('/login');
        }
    }, [authStatus, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return <div>{children}</div>;
};

export default AuthLayout;
