import React from 'react'
import { ChevronDown } from 'lucide-react';

const LookingForDriver = (props) => {
    const vehicle = {
        "car": "../src/images/car.jpg",
        "motorbike": "../src/images/bike.png",
        "auto": "../src/images/auto.png"
    }

    function CancelRide() {
        props.setVehicleFound(false)
    }

    return (
        <div className="bg-white rounded-t-xl shadow-lg p-6 relative">
            <button 
                className="absolute -top-2 left-0 right-0 mx-auto w-12 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => {props.setVehicleFound(false)}}
                aria-label="Close vehicle selection panel"
            >
                <ChevronDown size={30} />
            </button>
            <h3 className='text-2xl font-semibold mb-5 text-center'>Looking for a Driver</h3>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <img className='h-20' src={vehicle[props.vehicleType]} alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <p className='text-l -mt-1'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            <p className='text-l -mt-1'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-xl font-medium'>₹{props.fare[ props.vehicleType ]} </h3>
                        </div>
                    </div>
                </div>
                <button onClick={CancelRide} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Cancel the Ride</button>
            </div>
        </div>
    )
}

export default LookingForDriver