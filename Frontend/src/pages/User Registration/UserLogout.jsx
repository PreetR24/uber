import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            if(response.status === 200){
                localStorage.removeItem('token');
                navigate('/login');
            }
        })
    }, [navigate, token])

    return (
        <div>UserLogout</div>
    )
}

export default UserLogout