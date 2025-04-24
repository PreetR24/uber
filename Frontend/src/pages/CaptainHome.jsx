import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopup'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'
import LiveTracking from '../components/LiveTracking'
import logo from "../images/logo.png"

const CaptainHome = () => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
    const [isOnline, setIsOnline] = useState(true)
    const [ride, setRide] = useState(null)
    const [isRideAccepted, setIsRideAccepted] = useState(false)

    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    const { socket } = useContext(SocketContext)
    const { captain } = useContext(CaptainDataContext)

    // Handle resize events for responsive design
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
        }
        
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Socket connection and location updates
    useEffect(() => {
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain'
        })

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                }, (error) => {
                    console.error("Error getting location:", error)
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        return () => clearInterval(locationInterval)
    }, [captain._id, socket])

    // Socket event listener for new rides
    useEffect(() => {
        const handleNewRide = (data) => {
            setRide(data)
            setRidePopupPanel(true)
        }
        
        socket.on('new-ride', handleNewRide)
        
        return () => {
            socket.off('new-ride', handleNewRide)
        }
    }, [socket])

    async function confirmRide() {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
                rideId: ride._id,
                captainId: captain._id,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('captainToken')}`
                }
            })
            setRidePopupPanel(false)
            setConfirmRidePopupPanel(true)
        } catch (error) {
            console.error("Error confirming ride:", error)
        }
    }

    const toggleOnlineStatus = () => {
        setIsOnline(prev => !prev)
        // Emit socket event to update status
        socket.emit('update-captain-status', {
            captainId: captain._id,
            isOnline: !isOnline
        })
    }

    // GSAP animations for ride popup
    useGSAP(() => {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [ridePopupPanel])

    // GSAP animations for confirmation popup
    useGSAP(() => {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.3,
                ease: 'power2.out'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power2.in'
            })
        }
    }, [confirmRidePopupPanel])

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-white shadow-md z-30 py-4 px-4 md:px-6 flex items-center justify-between">
                <img 
                    className="h-8 md:h-10" 
                    src={logo} 
                    alt="Logo" 
                />
                <div className="flex items-center gap-3">
                    <button 
                        onClick={toggleOnlineStatus}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            isOnline 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 text-gray-700'
                        }`}
                    >
                        {isOnline ? 'Online' : 'Offline'}
                    </button>
                    <Link 
                        to="/captains/logout" 
                        className="h-10 w-10 bg-gray-100 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <i className="text-lg ri-logout-box-r-line"></i>
                    </Link>
                </div>
            </header>

            {/* Main content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar - Always visible on desktop, collapsible on mobile */}
                <aside className={`${
                    isMobile ? 'absolute top-16 left-0 right-0 z-20 shadow-lg h-auto max-h-64 bg-white overflow-y-auto transition-transform' 
                             : 'w-80 bg-white shadow-md z-10'
                }`}>
                    <div className="p-4">
                        <CaptainDetails />
                        
                        {/* Desktop stats */}
                        {!isMobile && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold mb-3">Today's Stats</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Rides</p>
                                        <p className="text-xl font-bold">0</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Earnings</p>
                                        <p className="text-xl font-bold">$0.00</p>
                                    </div>
                                    <div className="bg-purple-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Hours</p>
                                        <p className="text-xl font-bold">0:00</p>
                                    </div>
                                    <div className="bg-yellow-50 p-3 rounded-lg">
                                        <p className="text-sm text-gray-600">Rating</p>
                                        <p className="text-xl font-bold">5.0</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Map container - Occupies remaining space */}
                <div className="flex-1 relative z-0">
                    <LiveTracking />
                </div>
            </div>

            {isRideAccepted && (
                <div className="fixed bottom-4 left-0 right-0 flex justify-center z-30 px-4">
                    <button 
                        className="w-full md:w-[32rem] bg-blue-500 text-white font-medium py-3 px-6 rounded-lg 
                            shadow-lg hover:bg-blue-600 active:bg-blue-700 transition-all duration-200
                            flex items-center justify-center gap-2"
                        onClick={() => setConfirmRidePopupPanel(true)}
                    >
                        <i className="ri-taxi-line text-lg"></i>
                        <span>View Ride Details</span>
                    </button>
                </div>
            )}

            {/* Ride popup - Fixed at bottom */}
            <div 
                ref={ridePopupPanelRef} 
                className="fixed left-0 right-0 bottom-0 mx-auto w-full md:w-[32rem] h-auto max-h-[70vh] z-40 translate-y-full bg-white rounded-t-xl shadow-xl overflow-hidden"
            >
                <div className="px-4 pb-4 overflow-y-auto">
                    {ride && (
                        <RidePopUp
                            ride={ride}
                            setRidePopupPanel={setRidePopupPanel}
                            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                            confirmRide={confirmRide}
                            setIsRideAccepted={setIsRideAccepted}
                        />
                    )}
                </div>
            </div>

            {/* Confirm ride popup - Fixed at bottom */}
            <div 
                ref={confirmRidePopupPanelRef} 
                className="fixed left-0 right-0 bottom-0 mx-auto w-full md:w-[32rem] h-[85vh] z-40 translate-y-full bg-white rounded-t-xl shadow-xl overflow-hidden"
            >
                <div className="px-4 pb-4 overflow-y-auto h-full">
                    {ride && (
                        <ConfirmRidePopUp
                            ride={ride}
                            setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                            setRidePopupPanel={setRidePopupPanel} 
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default CaptainHome