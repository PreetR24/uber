import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(null);  

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error("Geolocation is not supported by your browser");
            return;
        }

        // Get initial position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({ lat: latitude, lng: longitude });
            },
            (error) => console.error("Error getting location:", error),
            { enableHighAccuracy: true }
        );

        // Watch for live location updates
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Updated Location:", latitude, longitude);
                setCurrentPosition({ lat: latitude, lng: longitude });
            },
            (error) => console.error("Error watching location:", error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div style={{ height: '80%', width: '100%' }}>
            {currentPosition ? (
                <MapContainer center={currentPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
                    {/* OpenRouteService Tile Layer */}
                    <TileLayer 
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" 
                    />
                    <Marker position={currentPosition} />
                </MapContainer>
            ) : (
                <p>Loading location...</p>
            )}
        </div>
    );
};

export default LiveTracking;
