import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../../context/UserContext'

const CaptainForgotPSD = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [OtpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [otp, setOtp] = useState('');

    const {user, setUser} = useContext(UserDataContext);
    const navigate = useNavigate();

    const SendOTPHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login/send-otp`,{ email }, {withCredentials: true });
            setOtpSent(true);
            alert('OTP sent successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error sending OTP');
        }
    }
    
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login/verify-otp`, { otp }, { withCredentials: true });
            setVerified(true);
            alert('OTP verified successfully!');
        } catch (err) {
            alert("Otp is not correct");
        }
    };

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login/set-psd`, {
                email,
                password,
            },
            { withCredentials: true }
        );
        const { captainToken } = response.data;
        localStorage.setItem('captainToken', captainToken);
        alert('Registration successful!');
        setUser((prev) => ({ ...prev, email, password }));
        navigate('/captain-login');   
        } catch (err) {
            alert(err.response?.data?.message || 'Error completing registration');
        }
    };

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-16 ml-3 mb-5' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />
                {!OtpSent && (
                    <form onSubmit={SendOTPHandler}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-100 rounded px-4 py-2 border w-full text-lg"
                        />
                        <button
                            className="bg-black text-white px-4 py-2 mt-4 rounded"
                            disabled={OtpSent}
                        >
                            {OtpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                    </form>
                )}
                {OtpSent && !verified && (
                    <>
                        <form onSubmit={handleVerifyOtp} className="mt-4">
                            <input
                                type="number"
                                placeholder="Enter OTP"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="bg-gray-100 rounded px-4 py-2 border w-full text-lg"
                            />
                            <button type="submit" className="bg-black text-white px-4 py-2 mt-4 rounded">
                                Verify OTP
                            </button>
                        </form>
                    </>
                )}
                {verified && (
                    <form onSubmit={handleCompleteRegistration} className="mt-4">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-gray-100 rounded px-4 py-2 border w-full text-lg mt-4"
                        />
                        <button type="submit" className="bg-black text-white px-4 py-2 mt-4 rounded w-full">
                            Update Password
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}

export default CaptainForgotPSD;