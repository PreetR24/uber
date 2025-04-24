import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../../context/UserContext';
import Alert from '../../components/Alert';
import logo from '../../images/logo.png'

const UserSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [OtpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [sendotpbtn, setsendotpbtn] = useState(true);
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [fadeIn, setFadeIn] = useState(true);
    const [slideDirection, setSlideDirection] = useState('right');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [resendTimer, setResendTimer] = useState(0);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('success');

    const {user, setUser} = useContext(UserDataContext);
    const navigate = useNavigate();

    // Handle step transitions with animations
    const goToStep = (step, direction = 'right') => {
        setFadeIn(false);
        setSlideDirection(direction);
        
        setTimeout(() => {
            setCurrentStep(step);
            if (step === 1) {
                setOtpSent(false);
                setVerified(false);
            } else if (step === 2) {
                setOtpSent(true);
                setVerified(false);
            } else if (step === 3) {
                setOtpSent(true);
                setVerified(true);
            }
            setFadeIn(true);
        }, 300);
    };

    // Password strength checker
    useEffect(() => {
        if (!password) {
            setPasswordStrength(0);
            return;
        }
        
        let strength = 0;
        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;
        
        setPasswordStrength(strength);
    }, [password]);

    // OTP resend timer
    useEffect(() => {
        let interval;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prevTimer => prevTimer - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const SubmitEmailHandler = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`, { email }, { withCredentials: true });
            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup/send-otp`, { email }, { withCredentials: true });
            setAlertMessage("OTP sent successfully!");
            setAlertType('success');
            goToStep(2);
            setsendotpbtn(false);
        } catch (error) {
            setAlertMessage(error.response?.data?.message || 'Error sending OTP');
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const SendOTPHandler = async () => {
        if (resendTimer > 0) return;
        
        setIsLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup/send-otp`, { email }, { withCredentials: true });
            setOtpSent(true);
            setAlertMessage("OTP sent successfully!");
            setAlertType('success');
            setResendTimer(30);
        } catch (err) {
            setAlertMessage(err.response?.data?.message || 'Error sending OTP');
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup/verify-otp`, { email, otp }, { withCredentials: true });
            setAlertMessage("OTP verified successfully!");
            setAlertType('success');
            goToStep(3);
        } catch (err) {
            setAlertMessage(err.response?.data?.message || 'Error verifying OTP');
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setIsLoading(true);
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
            
            // Show success animation before redirect
            setAlertMessage("Registration successful!");
            setAlertType('success');
            setCurrentStep(4); // Success step
            setTimeout(() => {
                setUser({ firstName, lastName, email, password});
                navigate('/home');
            }, 1500);
        } catch (err) {
            setAlertMessage(err.response?.data?.message || 'Error completing registration');
            setAlertType('error');
            setIsLoading(false);
        }
    };

    // Animation classes
    const getAnimationClasses = () => {
        let baseClasses = "transition-all duration-300 ease-in-out";
        
        if (!fadeIn) {
            return `${baseClasses} opacity-0 transform ${slideDirection === 'right' ? 'translate-x-10' : '-translate-x-10'}`;
        }
        
        return `${baseClasses} opacity-100 transform translate-x-0`;
    };

    // Success animation
    const SuccessCheck = () => (
        <div className="flex items-center justify-center flex-col">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Registration Successful!</h3>
            <p className="text-gray-600">Redirecting you to home page...</p>
        </div>
    );

    const LoadingSpinner = () => (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-between p-4 sm:p-6 md:p-8">
            {alertMessage && (
                <Alert message={alertMessage} type={alertType} onClose={() => setAlertMessage(null)} />
            )}
            <div className="flex-1 w-full max-w-md mx-auto">
                {/* Header with logo */}
                <div className="mb-6 pt-4 flex items-center">
                    <img 
                        className="w-12 h-auto md:w-16 filter drop-shadow-md transition-transform duration-300 hover:scale-110"
                        src={logo} 
                        alt="Logo" 
                    />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 ml-4 relative">
                        Sign Up
                        <span className="absolute -bottom-1 left-0 w-12 h-1 bg-blue-500 rounded-full"></span>
                    </h2>
                </div>

                {/* Progress steps */}
                <div className="flex justify-between mb-8 relative">
                    <div className="flex flex-col items-center z-10">
                        <div 
                            onClick={() => currentStep > 1 && goToStep(1, 'left')}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer transform hover:scale-110 ${currentStep >= 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}
                        >
                            {currentStep > 1 ? '✓' : '1'}
                        </div>
                        <span className="mt-1 text-xs text-gray-600">Email</span>
                    </div>
                    <div className="flex flex-col items-center z-10">
                        <div 
                            onClick={() => currentStep > 2 && goToStep(2, 'left')}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 2 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}
                        >
                            {currentStep > 2 ? '✓' : '2'}
                        </div>
                        <span className="mt-1 text-xs text-gray-600">Verify</span>
                    </div>
                    <div className="flex flex-col items-center z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${currentStep >= 3 ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'}`}>
                            {currentStep > 3 ? '✓' : '3'}
                        </div>
                        <span className="mt-1 text-xs text-gray-600">Details</span>
                    </div>
                    <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
                    <div 
                        className="absolute top-4 left-0 h-0.5 bg-blue-600 -z-0 transition-all duration-500 ease-in-out" 
                        style={{ width: `${(currentStep - 1) * 50}%` }}
                    ></div>
                </div>

                {/* Form Container with animations */}
                <div className={getAnimationClasses()}>
                    {/* Email form */}
                    {currentStep === 1 && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
                            <h3 className="text-lg font-medium mb-4 text-gray-800">Let's get started</h3>
                            <p className="text-gray-600 text-sm mb-6">Enter your email address to create your account</p>
                            
                            <form onSubmit={SubmitEmailHandler}>
                                <div className="mb-4 relative">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="email"
                                            type="email"
                                            placeholder="name@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="bg-gray-50 rounded-lg pl-10 pr-4 py-3 border border-gray-300 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="bg-black text-white w-full py-3 rounded-lg font-medium hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex justify-center items-center transform hover:translate-y-px hover:shadow-md"
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner />
                                            Processing...
                                        </>
                                    ) : "Continue with Email"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* OTP verification */}
                    {currentStep === 2 && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">Verify your email</h3>
                                <button 
                                    onClick={() => goToStep(1, 'left')}
                                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                            </div>
                            
                            <div className="px-4 py-3 bg-blue-50 rounded-lg border border-blue-100 mb-4">
                                <p className="text-gray-700 text-sm">
                                    We've sent a verification code to <span className="font-medium">{email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtp} className="mb-4">
                                <div className="mb-4">
                                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
                                    <input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 4-digit code"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} // Only allow digits and max 6
                                        className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center tracking-widest text-lg"
                                        maxLength={4}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isLoading || otp.length !== 4}
                                    className={`w-full py-3 rounded-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 flex justify-center items-center transform hover:translate-y-px hover:shadow-md ${otp.length !== 4 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800 focus:ring-black'}`}
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner />
                                            Verifying...
                                        </>
                                    ) : "Verify Code"}
                                </button>
                            </form>

                            <div className="text-center">
                                <button
                                    disabled={isLoading || resendTimer > 0}
                                    className={`text-blue-600 hover:text-blue-800 text-sm font-medium focus:outline-none transition-colors ${resendTimer > 0 ? 'cursor-not-allowed text-gray-400' : ''}`}
                                    onClick={SendOTPHandler}
                                >
                                    {resendTimer > 0 
                                        ? `Resend code in ${resendTimer}s` 
                                        : "Resend verification code"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Complete registration */}
                    {currentStep === 3 && (
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 transition-all hover:shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-800">Complete your profile</h3>
                                <button 
                                    onClick={() => goToStep(2, 'left')}
                                    className="text-sm text-gray-500 hover:text-gray-700 flex items-center"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Back
                                </button>
                            </div>
                            
                            <form onSubmit={handleCompleteRegistration}>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            required
                                            className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            required
                                            className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type="password"
                                            placeholder="Create a secure password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-gray-50 rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        
                                        {/* Password strength indicator */}
                                        {password && (
                                            <div className="mt-2">
                                                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-300 ${
                                                            passwordStrength === 0 ? 'bg-red-500 w-1/4' : 
                                                            passwordStrength === 1 ? 'bg-orange-500 w-2/4' :
                                                            passwordStrength === 2 ? 'bg-yellow-500 w-3/4' :
                                                            'bg-green-500 w-full'
                                                        }`}
                                                    ></div>
                                                </div>
                                                <p className="text-xs mt-1 text-gray-500">
                                                    {passwordStrength === 0 && "Weak: Use at least 8 characters"}
                                                    {passwordStrength === 1 && "Fair: Add uppercase letters"}
                                                    {passwordStrength === 2 && "Good: Add numbers"}
                                                    {passwordStrength === 3 && "Strong: Add special characters"}
                                                    {passwordStrength === 4 && "Excellent password strength!"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="bg-black text-white w-full py-3 rounded-lg font-medium hover:bg-gray-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black flex justify-center items-center transform hover:-translate-y-px hover:shadow-md"
                                >
                                    {isLoading ? (
                                        <>
                                            <LoadingSpinner />
                                            Creating Account...
                                        </>
                                    ) : "Complete Registration"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Success state */}
                    {currentStep === 4 && (
                        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 flex justify-center items-center transition-all duration-500 transform scale-100 animate-pulse">
                            <SuccessCheck />
                        </div>
                    )}
                </div>

                {/* Sign in link */}
                <div className="mt-6 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Sign in</Link>
                </div>
            </div>

            {/* Captain signup button */}
            <div className="mt-6 w-full max-w-md mx-auto">
                <Link
                    to='/captain-signup'
                    className='bg-slate-800 flex items-center justify-center text-white font-medium py-3 px-4 rounded-lg hover:bg-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transform hover:-translate-y-px hover:shadow-lg'
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Sign up as Captain
                </Link>
            </div>
        </div>
    );
};

export default UserSignup;