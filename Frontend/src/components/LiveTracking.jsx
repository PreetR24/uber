import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define custom marker icon
const customMarker = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41], // Width, height
    iconAnchor: [12, 41], // Position anchor
    popupAnchor: [1, -34], // Popup position
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    shadowSize: [41, 41], 
});

const RecenterMap = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, map.getZoom());
    }, [position, map]);
    return null;
};

const LiveTracking = () => {
    const [currentPosition, setCurrentPosition] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
        console.error("Geolocation is not supported by your browser");
        return;
        }

        const watchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error watching location:", error),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div style={{ height: "90vh", width: "100%" }}>
        {currentPosition ? (
            <MapContainer center={currentPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={currentPosition} icon={customMarker} />
                <RecenterMap position={currentPosition} />
            </MapContainer>
        ) : (
            <p>Loading location...</p>
        )}
        </div>
    );
};

export default LiveTracking;
