import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../../context/CaptainContext';
import axios from 'axios';
import logo from '../../images/logo.png'

const CaptainSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vehiclemodel, setVehiclemodel] = useState('');
    const [vehicleplate, setVehiclePlate] = useState('');
    const [vehiclecapacity, setVehicleCapacity] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [OtpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [sendotpbtn, setsendotpbtn] = useState(true);
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { captain, setCaptain } = useContext(CaptainDataContext);
    const navigate = useNavigate();

    const SubmitEmailHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/signup`, { email }, { withCredentials: true });
            setOtpSent(true);
            setsendotpbtn(false);
        } catch (error) {
            setError("Captain already exists");
        } finally {
            setLoading(false);
        }
    };

    const SendOTPHandler = async () => {
        setLoading(true);
        setError('');
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/signup/send-otp`, { email }, { withCredentials: true });
            setError('OTP sent successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending OTP');
        } finally {
            setLoading(false);
        }
    };
    
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/signup/verify-otp`, { email, otp }, { withCredentials: true });
            setVerified(true);
            setError('OTP verified successfully!');
        } catch (err) {
            setError("OTP is not correct");
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteRegistration = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const captainData = {
                firstname: firstName,
                lastname: lastName,
                email,
                password,
                model: vehiclemodel,
                plate: vehicleplate,
                capacity: vehiclecapacity,
                vehicleType: vehicleType
            };
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/captains/signup/complete-registration`, 
                captainData, 
                { withCredentials: true }
            );

            const data = response.data;
            setCaptain(data.captain);
            localStorage.setItem('captainToken', data.captainToken);
            setError('Registration successful!');
            navigate('/captain-home');   
        } catch (err) {
            setError(err.response?.data?.message || 'Error completing registration');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4 md:p-8">
            <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-lg">
                <div className="p-6 md:p-8">
                    <div className="flex items-center mb-6">
                        <img className="w-16 h-auto md:w-20" src={logo} alt="Logo" />
                        <h3 className="text-2xl font-bold ml-4 text-gray-800">Captain Sign Up</h3>
                    </div>
                    
                    {error && (
                        <div className={`p-3 rounded-lg mb-4 text-center ${error.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {error}
                        </div>
                    )}

                    {!OtpSent && (
                        <form onSubmit={SubmitEmailHandler}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg shadow-md flex justify-center items-center"
                                disabled={loading}
                            >
                                {loading ? 
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg> 
                                    : 'Submit Email'
                                }
                            </button>
                        </form>
                    )}

                    {OtpSent && !verified && (
                        <div>
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg shadow-md flex justify-center items-center mb-4"
                                onClick={SendOTPHandler}
                                disabled={loading}
                            >
                                {loading ? 
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg> 
                                    : sendotpbtn === false ? "Send OTP" : "Resend OTP"
                                }
                            </button>
                            
                            <form onSubmit={handleVerifyOtp} className="mt-4">
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="otp">
                                        Verification Code
                                    </label>
                                    <input
                                        id="otp"
                                        type="number"
                                        placeholder="Enter OTP"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg shadow-md flex justify-center items-center"
                                    disabled={loading}
                                >
                                    {loading ? 
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg> 
                                        : 'Verify OTP'
                                    }
                                </button>
                            </form>
                        </div>
                    )}

                    {verified && (
                        <form onSubmit={handleCompleteRegistration} className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="w-full md:w-1/2">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="firstName">
                                        First Name
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lastName">
                                        Last Name
                                    </label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4">
                                <h4 className="font-medium text-gray-700 mb-3">Vehicle Details</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="vehiclemodel">
                                            Vehicle Model
                                        </label>
                                        <input
                                            id="vehiclemodel"
                                            type="text"
                                            placeholder="e.g. Toyota Camry"
                                            value={vehiclemodel}
                                            onChange={(e) => setVehiclemodel(e.target.value)}
                                            required
                                            className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="vehicleplate">
                                            License Plate
                                        </label>
                                        <input
                                            id="vehicleplate"
                                            type="text"
                                            placeholder="e.g. ABC123"
                                            value={vehicleplate}
                                            onChange={(e) => setVehiclePlate(e.target.value)}
                                            required
                                            className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="w-full md:w-1/2">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="vehiclecapacity">
                                                Capacity
                                            </label>
                                            <input
                                                id="vehiclecapacity"
                                                type="number"
                                                placeholder="Number of seats"
                                                value={vehiclecapacity}
                                                onChange={(e) => setVehicleCapacity(e.target.value)}
                                                required
                                                className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="w-full md:w-1/2">
                                            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="vehicleType">
                                                Vehicle Type
                                            </label>
                                            <select
                                                id="vehicleType"
                                                value={vehicleType}
                                                onChange={(e) => setVehicleType(e.target.value)}
                                                required
                                                className="bg-gray-50 focus:bg-white rounded-lg px-4 py-3 border border-gray-300 w-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="auto">Auto</option>
                                                <option value="car">Car</option>
                                                <option value="motorbike">Motorbike</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-3 rounded-lg shadow-md mt-6 flex justify-center items-center"
                                disabled={loading}
                            >
                                {loading ? 
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg> 
                                    : 'Complete Registration'
                                }
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="w-full max-w-md mx-auto mt-6">
                <Link
                    to='/signup'
                    className='bg-gray-800 hover:bg-gray-900 flex items-center justify-center text-white font-medium rounded-lg px-4 py-3 w-full text-lg shadow-md'
                >
                    Sign in as User
                </Link>
                <p className="text-center text-gray-600 mt-4 text-sm">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default CaptainSignup;