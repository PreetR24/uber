import React from 'react';
import { ChevronDown, User } from 'lucide-react';

const VehiclePanel = (props) => {
    // Default fares to use if props.fare is undefined
    const defaultFares = {
        car: 150,
        motorbike: 80,
        auto: 120
    };

    // Use props.fare if available, otherwise use default values
    const fares = props.fare || defaultFares;

    const vehicles = [
        {
            id: 'car',
            name: 'UberGo',
            capacity: 4,
            eta: '2 mins away',
            description: 'Affordable, compact rides',
            image: "../src/images/car.jpg",
            fare: fares.car
        },
        {
            id: 'motorbike',
            name: 'Moto',
            capacity: 1,
            eta: '3 mins away',
            description: 'Affordable motorcycle rides',
            image: "../src/images/bike.png",
            fare: fares.motorbike
        },
        {
            id: 'auto',
            name: 'UberAuto',
            capacity: 3,
            eta: '3 mins away',
            description: 'Affordable Auto rides',
            image: "../src/images/auto.png",
            fare: fares.auto
        }
    ];

    // Safely handle functions that might be undefined
    const handleClosePanel = () => {
        if (props.setVehiclePanel) {
        props.setVehiclePanel(false);
        }
    };

    const handleSelectVehicle = (vehicleId) => {
        if (props.setConfirmRidePanel) {
        props.setConfirmRidePanel(true);
        }
        if (props.selectVehicle) {
        props.selectVehicle(vehicleId);
        }
    };

    return (
        <div className="bg-white rounded-t-xl shadow-lg p-6 relative">
        <button 
            className="absolute top-2 left-0 right-0 mx-auto w-12 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            onClick={handleClosePanel}
            aria-label="Close vehicle selection panel"
        >
            <ChevronDown size={28} />
        </button>
        
        <h3 className="text-2xl font-semibold mb-6 mt-4 text-center">Choose a Vehicle</h3>
        
        <div className="space-y-4">
            {vehicles.map((vehicle) => (
            <button
                key={vehicle.id}
                onClick={() => handleSelectVehicle(vehicle.id)}
                className="flex w-full border-2 border-gray-200 hover:border-black hover:bg-gray-50 rounded-xl p-4 transition-all items-center justify-between focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            >
                <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-lg flex items-center justify-center overflow-hidden">
                    <img className="w-50 h-50 object-cover" src={vehicle.image} alt={vehicle.name} />
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center">
                    <h4 className="font-medium text-lg">{vehicle.name}</h4>
                    <div className="ml-2 px-2 py-1 rounded-full flex items-center text-sm">
                        <User size={14} className="mr-1" />
                        <span>{vehicle.capacity}</span>
                    </div>
                    </div>
                    <h5 className="font-medium text-sm text-green-600">{vehicle.eta}</h5>
                    <p className="text-sm text-gray-500">{vehicle.description}</p>
                </div>
                </div>
                
                <div className="text-lg font-bold text-right">
                ₹{vehicle.fare}
                </div>
            </button>
            ))}
        </div>
        </div>
    );
};

export default VehiclePanel;