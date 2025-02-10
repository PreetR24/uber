const axios = require('axios');
const captainModel = require('../models/captain.model')

module.exports.getAddressCoordinates = async (address) => {
    const apiKey = process.env.MAP_API;
    const url = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url);
        const { features } = response.data;

        if (features.length === 0) {
            throw new Error('No coordinates found for the given address');
        }

        const [lng, lat] = features[0].geometry.coordinates;
        return [ lat, lng ];
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

module.exports.getDistanceTime = async (start, end) => {
    if (!start || !end) {
        throw new Error('Start and end points are required');
    }

    const [startLat, startLng] = start;
    const [endLat, endLng] = end;

    const apiKey = process.env.MAP_API;
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';

    try {
        const response = await axios.get(url, {
            params: {
                api_key: apiKey,
                start: `${startLng},${startLat}`,
                end: `${endLng},${endLat}`
            }
        });

        const route = response.data.features[0];
        if (!route || !route.properties) {
            throw new Error('Invalid response format: Missing route properties');
        }

        const { distance, duration } = route.properties.summary;
        return { distance, duration };
    } catch (error) {
        console.error('Error fetching directions:', error.message);
        return null;
    }
};

module.exports.getAddressSuggestions = async (input) => {
    if (!input) {
        throw new Error('Address is required');
    }
    const apiKey = process.env.MAP_API;
    const url = `https://api.openrouteservice.org/geocode/autocomplete?api_key=${apiKey}&text=${encodeURIComponent(input)}`;
    try {
        const response = await axios.get(url);
        const { features } = response.data;
        if (features.length === 0) {
            throw new Error('No suggestions found for the given address');
        }
        return features.map((feature) => feature.properties);
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) =>{
    const captains = await captainModel.find({
        $and: [
            { "location.ltd": { $gte: ltd - 0.1, $lte: ltd + 0.1 } },
            { "location.lng": { $gte: lng - 0.1, $lte: lng + 0.1 } }
        ]
    });
    return captains;
}