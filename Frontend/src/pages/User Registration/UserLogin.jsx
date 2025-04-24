import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserDataContext } from '../../context/UserContext'
import axios from 'axios'
import Alert from '../../components/Alert'
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import logo from '../../images/logo.png'

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { user, setUser } = useContext(UserDataContext);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleAlertClose = () => {
        setAlertMessage(null);
        if (user) {
            navigate("/home");
        }
    };

    const SubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, {
                email,
                password,
            })
            const { userToken } = response.data;
            localStorage.setItem("userToken", userToken);
            setAlertMessage("Login successful!");
            setAlertType("success");
            setUser(response.data.user);
        } catch (err) {
            setAlertMessage(err.response?.data?.message || "Error logging in");
            setAlertType("error");
        }
    };

    const handleGoogleLogin = async (credentialResponse) => {
        try {
            const decoded = jwtDecode(credentialResponse.credential);
            const { email } = decoded;
    
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/google-login`, { email });
            
            if (response.data.userExists) {
                localStorage.setItem("userToken", response.data.userToken); // Optional: store token if you return it
                setAlertType("success");
                setAlertMessage("Logged in successfully!");
                navigate("/home"); // 👈 Redirect here
                setUser(response.data.user); // Save user context
            } else {
                setAlertType("error");
                setAlertMessage("No user found with this email.");
            }
        } catch (err) {
            setAlertType("error");
            setAlertMessage("Google login failed");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col justify-between p-4 sm:p-6 md:p-8 lg:max-w-md lg:mx-auto">
            {alertMessage && <Alert message={alertMessage} type={alertType} onClose={handleAlertClose}/>}
            <div className="flex-1 w-full max-w-sm mx-auto">
                {/* Header with logo */}
                <div className="mb-8 pt-4 md:pt-6">
                    <img
                        className="w-16 h-auto md:w-20"
                        src={logo}
                        alt="Logo"
                    />
                </div>

                {/* Welcome text */}
                <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back User</h2>
                    <p className="text-gray-600 mt-2">Please sign in to continue</p>
                </div>

                {/* Login form */}
                <form className="space-y-6" onSubmit={SubmitHandler}>
                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div className="space-y-1 relative">
                        <div className="flex justify-between items-center">
                            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                            <Link to="/login/forgot-psd" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white rounded-lg px-4 py-3 border border-gray-300 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                                placeholder="Enter your password"
                                />
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white text-base font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex justify-center items-center"
                    >
                        {isLoading ? (
                            <span className="inline-flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing in...
                            </span>
                        ) : "Sign in"}
                    </button>
                </form>

                <div className="mt-4">
                    <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() => {
                            setAlertType("error");
                            setAlertMessage("Google login failed");
                        }}
                        clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                        />
                </div>

                {/* Divider */}
                <div className="my-6 flex items-center">
                    <div className="flex-grow border-t border-gray-500"></div>
                    <span className="mx-4 text-sm text-gray-500">OR</span>
                    <div className="flex-grow border-t border-gray-500"></div>
                </div>

                {/* Sign up link */}
                <div className="mt-6 text-center text-gray-600">
                    New here? <Link to="/signup" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Create an account</Link>
                </div>
            </div>

            {/* Captain login button */}
            <div className="mt-8 w-full max-w-sm mx-auto pb-4">
                <Link
                    to="/captain-login"
                    className="flex items-center justify-center w-full bg-slate-800 text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sign in as Captain
                </Link>
            </div>
        </div>
    )
}

export default UserLogin