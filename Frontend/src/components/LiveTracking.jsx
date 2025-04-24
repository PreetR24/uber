import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Define custom marker icon
const customMarker = new L.Icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
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
    const [driverPosition, setDriverPosition] = useState(null);
    const [userPosition] = useState({ lat: 28.6139, lng: 77.2090 });
    const [shouldRecenter, setShouldRecenter] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error("Geolocation not supported");
            setErrorMsg("Geolocation not supported by this browser.");
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setDriverPosition({ lat: latitude, lng: longitude });
                setErrorMsg(""); // Clear any old errors
            },
            (error) => {
                console.error("Geolocation error:", error.message);
                if (error.code === 1) setErrorMsg("Permission denied for location access.");
                else if (error.code === 2) setErrorMsg("Location unavailable.");
                else if (error.code === 3) setErrorMsg("Location request timed out.");
                else setErrorMsg("Unknown geolocation error.");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return (
        <div style={{ height: "90vh", width: "100%" }}>
            {errorMsg && <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>}
            {driverPosition ? (
                <MapContainer
                    center={driverPosition}
                    zoom={15}
                    style={{ height: "100%", width: "100%" }}
                    whenCreated={(map) => {
                        map.on("dragstart", () => setShouldRecenter(false));
                    }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={driverPosition} icon={customMarker}>
                        <Popup>Driver</Popup>
                    </Marker>
                    <Marker position={userPosition} icon={customMarker}>
                        <Popup>User</Popup>
                    </Marker>
                    {shouldRecenter && <RecenterMap position={driverPosition} />}
                </MapContainer>
            ) : (
                <p style={{ textAlign: "center" }}>Fetching location...</p>
            )}
        </div>
    );
};

export default LiveTracking;
