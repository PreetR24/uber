import React, { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'

const Home = () => {
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if(panelOpen){
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24,
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

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='h-screen w-screen'>
                {/* image for temporary use  */}
                {/* <LiveTracking /> */}
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute cursor-pointer opacity-0 right-6 top-6 text-3xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => { submitHandler(e) }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                //     setActiveField('pickup')
                                }}
                                value={pickup}
                                // onChange={handlePickupChange}
                                className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                                type="text"
                                placeholder='Add a pick-up location'
                            />
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                //     setActiveField('destination')
                                }}
                                value={destination}
                                // onChange={handleDestinationChange}
                                className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
                                type="text"
                                placeholder='Enter your destination'
                            />
                    </form>
                    <button
                        // onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg w-full text-lg'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white-500 h-0'>
                    <LocationSearchPanel
                        // suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        // setPanelOpen={setPanelOpen}
                        // setVehiclePanel={setVehiclePanel}
                        // setPickup={setPickup}
                        // setDestination={setDestination}
                        // activeField={activeField}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home