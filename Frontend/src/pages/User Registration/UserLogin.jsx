import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../../context/UserContext'
import axios from 'axios'

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser } = useContext(UserDataContext);
    const navigate = useNavigate();

    const SubmitHandler = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, {
            email,
            password,
        })
        const { token } = response.data;
        localStorage.setItem("userToken", token);
        alert('Login successful!');
        setUser(response.data.user);
        navigate('/home');
    } catch (err) {
        alert(err.response?.data?.message || 'Error completing registration');
    }
};

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-16 ml-3' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />
                <form className='p-3' onSubmit={(e) => SubmitHandler(e)}>
                        <h3 className='text-xl mt-2 mb-4'>What's your email</h3>
                        <input
                            type="email"
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                            placeholder='Enter your email'
                            />
                        <h3 className='text-xl mt-5 mb-4'>Enter Password</h3>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base'
                            placeholder='password'
                            />
                        <button className='bg-black text-white text-xl w-full font-semibold p-4 block text-center mt-4'>Login</button>
                </form>
                <Link to='/login/forgot-psd' className='w-full font-semibold p-4 block text-center text-lg'>Forgot Password ?</Link>
                <p className='text-center'>New here? <Link to='/signup' className='text-blue-600'>Create new Account</Link></p>
            </div>
            <div>
                <Link
                to='/captain-login'
                className='bg-slate-800 flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-4 w-full text-xl placeholder:text-base'
                >Sign in as Captain</Link>
            </div>
        </div>
    )
}

export default UserLogin