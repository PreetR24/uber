import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../../context/CaptainContext'
import Alert from '../../components/Alert'
import logo from '../../images/logo.png'

const CaptainForgotPSD = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [OtpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [resendLoading, setResendLoading] = useState(false);

    const {captain, setCaptain} = useContext(CaptainDataContext);
    const navigate = useNavigate();

    const SendOTPHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login/send-otp`,{ email }, {withCredentials: true });
            setOtpSent(true);
            setAlertMessage('OTP sent successfully! Check your email.');
            setAlertType('success');
        } catch (err) {
            setAlertMessage(err.response?.data?.message || 'Error sending OTP');
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login/verify-otp`, { email,otp }, { withCredentials: true });
            setVerified(true);
            setAlertMessage('OTP verified successfully! You can now set a new password.');
            setAlertType('success');
        } catch (err) {
            setAlertMessage(err.response?.data?.message || 'Error verifying OTP');
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login/send-otp`,{ email }, {withCredentials: true }); 
            setAlertMessage('New OTP sent successfully!');
            setOtp(''); // Clear previous OTP
        } catch (err) {
            setAlertMessage(err.response?.data?.message || 'Error resending OTP');
        } finally {
            setResendLoading(false);
        }
    };

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login/set-psd`, {
                email,
                password,
            },
            { withCredentials: true }
        );
        const { captainToken } = response.data;
        localStorage.setItem('captainToken', captainToken);
        setAlertMessage('Password updated successfully! Redirecting to home...');
        setAlertType('success');
        setCaptain((prev) => ({ ...prev, email, password }));
        setTimeout(() => {
            setAlertMessage('');
            navigate('/home');
        }, 3000);
        navigate('/captain-login');   
        } catch (err) {
            setAlertMessage(err.response?.data?.message || 'Error updating password');
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
            {alertMessage && (
                <Alert message={alertMessage} duration={3000} type={alertType} onClose={() => setAlertMessage('')} />
            )}
<div className="p-4 sm:p-6 md:p-8 max-w-md mx-auto w-full flex flex-col justify-between min-h-screen sm:min-h-0 sm:shadow-xl sm:my-10 sm:rounded-2xl sm:bg-white">
                <div className="flex-1">
                    {/* Header */}
                    <div className="mb-8 text-center sm:text-left">
                        <div className="flex justify-center sm:justify-start mb-6">
                            <img 
                                className="w-16 h-auto rounded-lg shadow-sm" 
                                src={logo}
                                alt="Logo" 
                            />
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                            {!verified ? 'Reset Password' : 'Create New Password'}
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            {!OtpSent ? 'Enter your email to receive a verification code' : 
                             !verified ? 'Enter the code sent to your email' : 
                             'Create a strong password for your account'}
                        </p>
                    </div>

                    {/* Forms */}
                    {!OtpSent && (
                        <form onSubmit={SendOTPHandler} className="space-y-5">
                            <div className="transition-all duration-300">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="example@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <span className="inline-block animate-pulse">Sending...</span>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="w-full text-gray-600 font-medium py-2 hover:text-black transition-colors focus:outline-none"
                            >
                                Back to Login
                            </button>
                        </form>
                    )}

                    {OtpSent && !verified && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div className="transition-all duration-300">
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                                <input
                                    id="otp"
                                    type="number"
                                    placeholder="Enter 4-digit code"
                                    required
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <span className="inline-block animate-pulse">Verifying...</span>
                                ) : (
                                    'Verify Code'
                                )}
                            </button>
                            <div className="flex flex-col gap-2">
                                <button
                                    type="button"
                                    disabled={resendLoading}
                                    onClick={handleResendOTP}
                                    className="w-full text-blue-600 font-medium py-2 hover:text-blue-800 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {resendLoading ? (
                                        <span className="inline-block animate-pulse">Resending...</span>
                                    ) : (
                                        'Resend Code'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setOtpSent(false)}
                                    className="w-full text-gray-600 font-medium py-2 hover:text-black transition-colors focus:outline-none"
                                >
                                    Back to Email Entry
                                </button>
                            </div>
                        </form>
                    )}

                    {verified && (
                        <form onSubmit={handleCompleteRegistration} className="space-y-5">
                            <div className="transition-all duration-300">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Create new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition shadow-sm"
                                />
                                <p className="text-xs text-gray-500 mt-2">Password must be at least 8 characters long with letters and numbers</p>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-70 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <span className="inline-block animate-pulse">Updating...</span>
                                ) : (
                                    'Update Password'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CaptainForgotPSD;