import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const CaptainLogout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('captainToken');

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/logout`, { headers: { Authorization: `Bearer ${token}` } })
        .then((response) => {
            if(response.status === 200){
                localStorage.removeItem('captainToken');
                navigate('/captain-login');
            }
        })
        alert("Looged out")
    }, [navigate, token])

    return (
        <div>Logging out...</div>
    )
}

export default CaptainLogout