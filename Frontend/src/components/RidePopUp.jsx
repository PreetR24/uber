import React from 'react'

const RidePopUp = (props) => {
    return (
        <div className='m-3'>
            <h5 className='p-1 text-center w-[93%] absolute -mt-8' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-500 cursor-pointer ri-arrow-down-wide-line"></i></h5>
            <h3 className='text-2xl font-semibold mt-8 text-center'>New Ride Available !</h3>
            <div className='flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-4'>
                <div className='flex items-center gap-3 '>
                    <img className='h-12 rounded-full object-cover w-12' src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" alt="" />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>
            <div className='flex gap-2 justify-between flex-col items-center'>
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
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
                <div className='mt-5 w-full flex justify-around'>
                    <button onClick={() => {
                        props.setRidePopupPanel(false)
                    }} className='bg-gray-300 w-[30%] text-black font-semibold p-2 rounded-lg'>Ignore</button>
                    <button onClick={() => {
                        props.setConfirmRidePopupPanel(true)
                        props.confirmRide()
                    }} className='bg-green-600 w-[30%] text-white font-bold p-2 rounded-lg'>Confirm</button>
                </div>
            </div>
        </div>
    )
}

export default RidePopUp