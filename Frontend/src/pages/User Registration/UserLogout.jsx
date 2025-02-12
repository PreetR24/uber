import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`, { headers: { Authorization: `Bearer ${userToken}` } })
        .then((response) => {
            if(response.status === 200){
                localStorage.removeItem('userToken');
                navigate('/login');
            }
        })
    }, [navigate, userToken])

    return (
        <div>UserLogout</div>
    )
}

export default UserLogout