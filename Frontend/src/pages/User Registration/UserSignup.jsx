import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../../context/UserContext'

const UserSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [OtpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [sendotpbtn, setsendotpbtn] = useState(true);
    const [otp, setOtp] = useState('');

    const {user, setUser} = useContext(UserDataContext);
    const navigate = useNavigate();

    const SubmitEmailHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`, { email }, { withCredentials: true });
            setOtpSent(true);
            setsendotpbtn(false);
        } catch (error) {
            alert("User already exists");
        }
    };
    
    const SendOTPHandler = async (e) => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup/send-otp`, { email }, { withCredentials: true });
            setsendotpbtn(true)
            alert('OTP sent successfully!');
        } catch (err) {
            alert(err.response?.data?.message || 'Error sending OTP');
        }
    }
    
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup/verify-otp`, { email,otp }, { withCredentials: true });
            setVerified(true);
            alert('OTP verified successfully!');
        } catch (err) {
            alert("Otp is not correct");
        }
    };

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup/complete-registration`, {
                firstname: firstName,
                lastname: lastName,
                email,
                password,
            },
            { withCredentials: true }
        );
        const { userToken } = response.data;
        localStorage.setItem('userToken', userToken);
        localStorage.removeItem('newemail');
        alert('Registration successful!');
        setUser({ firstName, lastName, email, password});
        navigate('/home');   
        } catch (err) {
            alert(err.response?.data?.message || 'Error completing registration');
        }
    };

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>
            <div>
                <img className='w-16 ml-3' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s" alt="" />
                <h3 className="text-xl m-2">Sign Up</h3>
                {!OtpSent && (
                    <form onSubmit={SubmitEmailHandler}>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-gray-100 rounded px-4 py-2 border w-full text-lg"
                        />
                        <button type="submit" className="bg-black text-white px-4 py-2 mt-4 rounded">
                            Submit Email
                        </button>
                    </form>
                )}
                {OtpSent && !verified && (
                    <>
                        <button
                            className="bg-black text-white px-4 py-2 mt-4 rounded"
                            onClick={SendOTPHandler}
                        >
                        {sendotpbtn === false ? "Send OTP" : "Resend OTP"}
                        </button>
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
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="bg-gray-100 rounded px-4 py-2 border w-1/2 text-lg"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="bg-gray-100 rounded px-4 py-2 border w-1/2 text-lg"
                            />
                        </div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-gray-100 rounded px-4 py-2 border w-full text-lg mt-4"
                        />
                        <button type="submit" className="bg-black text-white px-4 py-2 mt-4 rounded w-full">
                            Complete Registration
                        </button>
                    </form>
                )}
            </div>
            <div>
                <Link
                to='/captain-signup'
                className='bg-slate-800 flex items-center justify-center text-white font-semibold mb-5 rounded-lg px-4 py-4 w-full text-xl placeholder:text-base'
                >Sign in as Captain</Link>
            </div>
        </div>
    )
}

export default UserSignup;