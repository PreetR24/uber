import React from 'react'
import { ChevronDown } from 'lucide-react';

const ConfirmRide = (props) => {
    const vehicle = {
        "car": "../src/images/car.jpg",
        "motorbike": "../src/images/bike.png",
        "auto": "../src/images/auto.png"
    }

    return (
        <div className="bg-white rounded-t-xl shadow-lg p-6 relative">
            <button 
                className="absolute -top-2 left-0 right-0 mx-auto w-12 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => {props.setConfirmRidePanel(false)}}
                aria-label="Close vehicle selection panel"
            >
                <ChevronDown size={30} />
            </button>
            <h3 className='text-2xl font-semibold mb-5 text-center'>Confirm your Ride</h3>

            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src={vehicle[props.vehicleType]} alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <p className='text-lg -mt-1 text-gray-700'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <p className='text-lg -mt-1 text-gray-700'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-xl font-medium'>₹{props.fare[ props.vehicleType ]}</h3>
                        </div>
                    </div>
                </div>
                <button onClick={() => {
                    props.setVehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.setVehiclePanel(false)
                    props.createRide()
                }} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Confirm</button>
            </div>
        </div>
    )
}

export default ConfirmRide