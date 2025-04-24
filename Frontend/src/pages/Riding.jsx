import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/SocketContext'
import LiveTracking from '../components/LiveTracking'
import logo from "../images/logo.png"

const Riding = () => {
    const location = useLocation()
    const { ride } = location.state || {}
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()

    useEffect(() => {
        // Set up socket listener when component mounts
        socket.on("ride-ended", () => {
            navigate('/home')
        })
        
        // Clean up socket listener when component unmounts
        return () => {
            socket.off("ride-ended")
        }
    }, [socket, navigate])

    return (
        <div className='h-screen w-full relative flex flex-col'>
            {/* Map Background */}
            <div className='fixed inset-0 z-0'>
                <LiveTracking/>
            </div>
            
            {/* Top Navigation */}
            <div className='fixed top-0 left-0 right-0 p-4 z-10 flex justify-end items-center'>
                <div className='bg-white shadow-md py-2 px-4 rounded-full'>
                    <p className='font-medium'>Ride in Progress</p>
                </div>
            </div>
            
            {/* Ride Information Panel */}
            <div className='fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-xl z-10 transition-all duration-300 max-h-[50vh] overflow-y-auto'>
                {/* Pull indicator */}
                <div className='flex justify-center py-2'>
                    <div className='w-12 h-1 bg-gray-300 rounded-full'></div>
                </div>
                
                {/* Captain and Vehicle Info */}
                <div className='px-5 pt-2 pb-4 border-b border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-4'>
                            <div className='relative'>
                                <img 
                                    className='w-20 h-auto' 
                                    src={logo} 
                                    alt="Driver" 
                                />
                                <div className='absolute -bottom-1 -right-1 bg-green-500 h-4 w-4 rounded-full border-2 border-white'></div>
                            </div>
                            <div>
                                <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname || 'Driver'}</h2>
                                <div className='flex items-center gap-1 text-yellow-500'>
                                    <i className="ri-star-fill"></i>
                                    <span className='text-sm text-gray-700'>4.8</span>
                                </div>
                            </div>
                        </div>
                        <div className='text-right'>
                            <h4 className='text-xl font-semibold'>{ride?.captain.vehicle.plate}</h4>
                            <p className='text-sm text-gray-600'>{ride?.captain.vehicle.model}</p>
                        </div>
                    </div>
                </div>
                
                {/* Ride Details */}
                <div className='px-5 py-4 flex justify-evenly items-center border-b border-gray-100'>
                    <div className='flex items-start gap-4 md:col-span-2'>
                        <div className='flex flex-col items-center mt-2'>
                            <div className='h-3 w-3 rounded-full bg-green-500'></div>
                            <div className='h-10 w-0.5 bg-gray-300 my-1'></div>
                            <div className='h-3 w-3 rounded-full bg-red-500'></div>
                        </div>
                        <div className='flex-1'>
                            <div className='mb-3'>
                                <p className='text-xs text-gray-500'>PICKUP</p>
                                <p className='text-sm text-gray-600 truncate'>{ride?.pickup || '123 Main Street'}</p>
                            </div>
                            <div>
                                <p className='text-xs text-gray-500'>DESTINATION</p>
                                <p className='text-sm text-gray-600 truncate'>{ride?.destination || 'Downtown'}</p>
                            </div>
                        </div>
                    </div>
                    <div className='bg-gray-50 rounded-xl p-4'>
                        <div className='flex items-center gap-3'>
                            <i className="ri-currency-line text-lg text-gray-600"></i>
                            <div>
                                <h3 className='text-sm font-medium'>Fare</h3>
                                <p className='text-lg font-semibold'>₹{ride?.fare || '350'}</p>
                                <p className='text-xs text-gray-500'>Cash Payment</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className='px-5 pb-8 pt-2 grid gap-3'>
                    <button className='flex items-center justify-center gap-2 bg-green-600 py-3 rounded-xl hover:bg-green-700 transition-colors text-white font-medium'>
                        <i className="ri-wallet-3-line"></i>
                        <span>Make Payment</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Riding