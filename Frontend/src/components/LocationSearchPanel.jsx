import React, {useState} from 'react'
import axios from 'axios'
import Alert from './Alert'

const LocationSearchPanel = ({ 
  suggestions, 
  setPanelOpen, 
  setPickup, 
  setDestination, 
  activeField,
}) => {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [showAlert, setShowAlert] = useState(false);

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') {
            setPickup(suggestion)
        } else if (activeField === 'destination') {
            setDestination(suggestion)
        }
        setPanelOpen(false)
    }

    const handleUseCurrentLocation = () => {
        setPanelOpen(false)
        if (navigator.geolocation) {
            setAlertMessage('Fetching current location, please wait...');
            setAlertType('success');
            setShowAlert(true);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    try {
                        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-address`, {
                            params: { lat, lng },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('userToken')}`
                            }
                        })
                        const location = response.data.address;
                        if (!location) {
                            setAlertMessage('Unable to fetch address for current location.');
                            setAlertType('error');
                            return;
                        }
                        setShowAlert(false);
                        handleSuggestionClick(location);
                    } catch (err) {
                        console.log(err);
                        setAlertMessage('Error fetching address. Try again.');
                        setAlertType('error');
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    setAlertMessage('Unable to fetch current location.');
                    setAlertType('error');
                }
            );
        } else {
            setAlertMessage('Geolocation is not supported by your browser.');
            setAlertType('error');
            setShowAlert(true);
        }
    };

    return (
        <div className="p-4 md:p-6">
            {showAlert && (
                <Alert 
                    message={alertMessage} 
                    type={alertType} 
                    duration={alertMessage === 'Fetching current location...' ? null : 3000}
                    onClose={() => setShowAlert(false)}
                />
            )}
            <div className="mb-4 border-b pb-2">
                <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    {activeField === 'pickup' ? 'Select pickup location' : 'Select destination'}
                </h3>
                <p className="text-sm text-gray-500">
                    {activeField === 'pickup' ? 'Choose where we should pick you up' : 'Choose where you want to go'}
                </p>
            </div>

            {/* Use current location */}
            <div className="mt-6 pt-4 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Quick access</h4>
                <div className="grid grid-cols-1">
                    <button
                        onClick={handleUseCurrentLocation}
                        className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                        <i className="ri-navigation-line text-gray-700"></i>
                        <span className="text-gray-800">Use Current Location</span>
                    </button>
                </div>
            </div>
            
            {(!suggestions || suggestions.length === 0) ? (
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="bg-gray-100 rounded-full p-3 mb-3">
                        <i className="ri-search-line text-gray-400 text-xl"></i>
                    </div>
                    <p className="text-gray-500 text-center">No locations found</p>
                    <p className="text-gray-400 text-sm text-center mt-1">Try adjusting your search</p>
                </div>
            ) : (
                <div className="max-h-[65vh] md:max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                    {suggestions.map((elem, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => handleSuggestionClick(elem.name)} 
                            className="flex cursor-pointer gap-3 p-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl items-center my-1 transition-all duration-200 border-l-4 border-transparent hover:border-gray-300 active:border-black"
                        >
                            <div className="bg-gray-100 h-10 w-10 flex items-center justify-center rounded-full text-gray-600">
                                {elem.type === 'recent' ? (
                                    <i className="ri-time-line"></i>
                                ) : elem.type === 'saved' ? (
                                    <i className="ri-star-line"></i>
                                ) : (
                                    <i className="ri-map-pin-line"></i>
                                )}
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <h4 className="font-medium text-gray-800 truncate">{elem.name}</h4>
                                {elem.address && (
                                    <p className="text-sm text-gray-500 truncate">{elem.address}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0,0,0,0.05);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0,0,0,0.2);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0,0,0,0.3);
                }
            `}</style>
        </div>
    )
}

export default LocationSearchPanel
