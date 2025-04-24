import React from 'react'
import carImage from '../images/car.jpg'
import bikeImage from '../images/bike.png'
import autoImage from '../images/auto.png'

const WaitingForDriver = (props) => {
    const vehicleImages = {
        car: carImage,
        motorbike: bikeImage,
        auto: autoImage
    };

    // Get vehicle image based on type
    const getVehicleImage = (type) => {
        return vehicleImages[type] || carImage; // fallback to car if type not found
    };

    return (
        <div>
        <h5 className='p-1 text-center w-[93%] absolute top-0 cursor-pointer' onClick={() => {
            props.setWaitingForDriver(false)
        }}><i className="text-3xl text-gray-500 ri-arrow-down-wide-line"></i></h5>

        <div className='flex items-center justify-between'>
            <img className='h-12' src={getVehicleImage(props.ride?.captain.vehicle.vehicleType)} alt="" />
            <div className='text-right'>
            <h2 className='text-lg font-medium capitalize'>{props.ride?.captain.fullname.firstname}</h2>
            <h4 className='text-xl font-semibold -mt-1 -mb-1'>{props.ride?.captain.vehicle.plate}</h4>
            <p className='text-sm text-gray-600'>{props.ride?.captain.vehicle.model}</p>
            </div>
        </div>

        <div className='flex gap-2 justify-between flex-col items-center'>
            <h1 className='text-lg font-semibold mt-5'>OTP for fare: {props.ride?.otp} </h1>
            <div className='w-full mt-5'>
            <div className='flex items-center gap-5 p-3 border-b-2'>
                <i className="ri-map-pin-user-fill"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                </div>
            </div>
            <div className='flex items-center gap-5 p-3 border-b-2'>
                <i className="text-lg ri-map-pin-2-fill"></i>
                <div>
                <h3 className='text-lg font-medium'>562/11-A</h3>
                <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                </div>
            </div>
            <div className='flex items-center gap-5 p-3'>
                <i className="ri-currency-line"></i>
                <div>
                <h3 className='text-lg font-medium'>₹{props.ride?.fare} </h3>
                <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default WaitingForDriver