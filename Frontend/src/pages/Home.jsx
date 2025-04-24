import React, { useState, useRef, useContext, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel'
import ConfirmRide from '../components/ConfirmRide'
import WaitingForDriver from '../components/WaitingForDriver'
import LookingForDriver from '../components/LookingForDriver'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'
import LiveTracking from '../components/LiveTracking'
import logo from "../images/logo.png"
import Alert from '../components/Alert'

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [pickupSuggestions, setPickupSuggestions] = useState([])
    const [destinationSuggestions, setDestinationSuggestions] = useState([])
    const [activeField, setActiveField] = useState(null)
    const [fare, setFare] = useState({})
    const [vehicleType, setVehicleType] = useState(null)
    const [ride, setRide] = useState(null)
    const [selectedFromMap, setSelectedFromMap] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState(null); // 'success' or 'error'

    const navigate = useNavigate();

    const { socket } = useContext(SocketContext);
    const { user } = useContext(UserDataContext)

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [user])

    socket.on('ride-confirmed', ride => {
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

    socket.on('ride-started', ride => {
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } })
    })

    const handlePickupChange = async (e) => {
        setPickup(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            })
            setPickupSuggestions(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value)
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                }
            })
            setDestinationSuggestions(response.data)
        } catch (err) {
            // handle error
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '60%',
                padding: 4,
                duration: 0.5,
                ease: 'power2.inOut'
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%'
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePanel])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])

    async function findTrip() {
        if (!pickup || !destination) {
            setAlertMessage('Please enter both pickup and destination locations.');
            setAlertType('error');
            return;
        }
        if(pickup === destination) {
            setAlertMessage('Pickup and destination cannot be the same.');
            setAlertType('error');
            return;
        }
        setVehiclePanel(true)
        setPanelOpen(false)

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
            params: { pickup, destination },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
        setFare(response.data)
    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup, destination, vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
        })
    }

    useEffect(() => {
        const fetchAddress = async () => {
            if (selectedFromMap) {
                try {
                    const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-address`, {
                        params: selectedFromMap,
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("userToken")}`
                        }
                    });
                    const address = res.data.address;
                    if (activeField === 'pickup') {
                        setPickup(address);
                    } else {
                        setDestination(address);
                    }
                    setPanelOpen(false);
                } catch (error) {
                    console.error("Failed to reverse geocode location:", error);
                }
            }
        };
        fetchAddress();
    }, [selectedFromMap]);    

    return (
        <div className='h-screen relative overflow-hidden bg-gray-50'>
            {/* Map Background - Fixed z-index issue */}
            <div className='h-screen w-screen absolute top-0 left-0 z-10'>
                <LiveTracking/>
            </div>
            {alertMessage && (
                <Alert message={alertMessage} type={alertType} onClose={() => setAlertMessage(null)} />
            )}

            {/* Header */}
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-10 bg-white bg-opacity-90 shadow-sm'>
                <img className='w-20 h-auto' src={logo} alt="Uber logo" />
                <Link to='/users/logout' className='h-10 w-10 bg-white flex items-center justify-center rounded-full shadow-md hover:shadow-lg transition-all duration-300'>
                    <i className="text-lg text-gray-800 font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>

            {/* Main Content */}
            <div className='flex flex-col justify-end h-screen absolute top-0 w-full z-5'>
                {/* Bottom Card */}
                <div className='min-h-[30%] p-6 bg-white relative rounded-t-3xl shadow-lg z-10'>
                    <h5 
                        ref={panelCloseRef} 
                        onClick={() => setPanelOpen(false)} 
                        className='absolute cursor-pointer opacity-0 right-6 top-6 text-3xl text-gray-700 hover:text-black transition-colors duration-200'
                    >
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-bold text-gray-800'>Find a trip</h4>
                    
                    <form className='relative py-3 space-y-4' onSubmit={(e) => { submitHandler(e) }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('pickup')
                                }}
                                value={pickup}
                                onChange={handlePickupChange}
                                className='bg-gray-100 border border-gray-200 px-12 py-3 text-lg rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200'
                                type="text"
                                placeholder='Add a pick-up location'
                            />
                            {pickup && (
                                <button
                                    onClick={() => setPickup('')}
                                    className="text-2xl absolute right-4 top-6 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    <i class="ri-delete-bin-fill"></i>
                                </button>
                            )}
                        </div>
                        
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            </div>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('destination')
                                }}
                                value={destination}
                                onChange={handleDestinationChange}
                                className='bg-gray-100 border border-gray-200 px-12 py-3 text-lg rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:bg-white transition-all duration-200'
                                type="text"
                                placeholder='Enter your destination'
                            />
                            {destination && (
                                <button
                                    onClick={() => setDestination('')}
                                    className="text-2xl absolute right-4 top-6 -translate-y-1/2 text-gray-500 hover:text-black"
                                >
                                    <i class="ri-delete-bin-fill"></i>
                                </button>
                            )}
                        </div>
                    </form>
                    
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-6 py-4 rounded-xl w-full text-lg font-semibold mt-4 hover:bg-gray-800 transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2'
                    >
                        <i className="ri-taxi-line"></i>
                        Find Trip
                    </button>
                </div>

                {/* Search Panel */}
                <div ref={panelRef} className='bg-white h-0 rounded-t-3xl shadow-xl z-10'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>

                {/* Vehicle Panel */}
                <div ref={vehiclePanelRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-6 py-10 pt-12 rounded-t-3xl shadow-xl'>
                    <VehiclePanel
                        selectVehicle={setVehicleType}
                        fare={fare}
                        setConfirmRidePanel={setConfirmRidePanel}
                        setVehiclePanel={setVehiclePanel}
                    />
                </div>

                {/* Confirm Ride Panel */}
                <div ref={confirmRidePanelRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-6 py-8 pt-12 rounded-t-3xl shadow-xl'>
                    <ConfirmRide
                        createRide={createRide}
                        pickup={pickup}
                        destination={destination}
                        fare={fare}
                        vehicleType={vehicleType}
                        setVehiclePanel={setVehiclePanel}
                        setConfirmRidePanel={setConfirmRidePanel}
                        setVehicleFound={setVehicleFound}
                    />
                </div>

                {/* Looking For Driver */}
                <div ref={vehicleFoundRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-6 py-8 pt-12 rounded-t-3xl shadow-xl'>
                    <LookingForDriver
                        createRide={createRide}
                        pickup={pickup}
                        destination={destination}
                        fare={fare}
                        vehicleType={vehicleType}
                        setVehicleFound={setVehicleFound}
                    />
                </div>

                {/* Waiting For Driver */}
                <div ref={waitingForDriverRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-6 py-8 pt-12 rounded-t-3xl shadow-xl'>
                    <WaitingForDriver
                        ride={ride}
                        setWaitingForDriver={setWaitingForDriver}
                        waitingForDriver={waitingForDriver}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home