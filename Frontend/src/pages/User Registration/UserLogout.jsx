import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const UserLogout = () => {
    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken');
    const [logoutStatus, setLogoutStatus] = useState('loading'); // loading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const performLogout = async () => {
            // If no token exists, just redirect to login
            if (!userToken) {
                localStorage.removeItem('userToken'); // Just to be safe
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/logout`, 
                    { 
                        headers: { Authorization: `Bearer ${userToken}` },
                        timeout: 10000 // Add a timeout to prevent indefinite loading
                    }
                );
                
                if (response.status === 200) {
                    localStorage.removeItem('userToken');
                    setLogoutStatus('success');
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000); // Redirect after showing success message
                }
            } catch (error) {
                console.error('Logout error:', error);
                
                // Clear token anyway - best practice for logout errors
                localStorage.removeItem('userToken');
                
                // Set appropriate error message
                if (error.response) {
                    // Server responded with an error status
                    setErrorMessage(`Server error: ${error.response.status}`);
                } else if (error.request) {
                    // Request made but no response received
                    setErrorMessage('No response from server. Please check your connection.');
                } else {
                    // Error setting up the request
                    setErrorMessage(error.message || 'An unknown error occurred');
                }
                
                setLogoutStatus('error');
            }
        };
        
        performLogout();
    }, [navigate, userToken]);

    const handleManualRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
                {logoutStatus === 'loading' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-black"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Logging Out</h2>
                        <p className="text-gray-600">Please wait while we sign you out...</p>
                    </>
                )}
                
                {logoutStatus === 'success' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center">
                                <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Successfully Logged Out</h2>
                        <p className="text-gray-600">You'll be redirected to the login page shortly.</p>
                    </>
                )}
                
                {logoutStatus === 'error' && (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">Logout Issue</h2>
                        <p className="text-gray-600 mb-5">
                            {errorMessage || "There was a problem signing you out."}
                        </p>
                        <p className="text-gray-500 mb-6 text-sm">
                            Don't worry, we've cleared your local session for security.
                        </p>
                        <button 
                            onClick={handleManualRedirect}
                            className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                        >
                            Return to Login
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

export default UserLogout