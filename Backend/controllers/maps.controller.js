const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getAddressCoordinates = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { address } = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinates(address);
        res.status(200).json(coordinates);
    } catch (error) {
        console.error(error);
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res) => {
    // Validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error("Validation errors:", errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { start, end } = req.body;

    // Ensure `start` and `end` parameters are provided
    if (!start || !end) {
        console.error("Start and end coordinates are missing.");
        return res.status(400).json({ message: "Start and end coordinates are required." });
    }

    try {
        // Call the mapService to fetch distance and time
        const distanceTime = await mapService.getDistanceTime(start, end);

        if (!distanceTime) {
            console.error("No data received from map service.");
            return res.status(404).json({ message: "Distance and time not found." });
        }

        console.log("Distance and time retrieved successfully:", distanceTime);
        res.status(200).json(distanceTime);
    } catch (error) {
        console.error("Error occurred while fetching distance and time:", error.message);

        // Differentiate between client and server errors for better responses
        if (error.response) {
            // Error from the API (e.g., 400 or 500 response)
            res.status(error.response.status).json({
                message: "Error fetching distance and time.",
                details: error.response.data,
            });
        } else {
            // Other server errors (e.g., network issues)
            res.status(500).json({
                message: "An unexpected error occurred while fetching distance and time.",
                details: error.message,
            });
        }
    }
};

module.exports.getAddressFromCoordinates = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { lat, lng } = req.query;
        const address = await mapService.getAddressFromCoordinates(lat, lng);
        res.status(200).json({ address });
    } catch (error) {
        console.error("Error occurred while fetching address from coordinates:", error.message);
        res.status(500).json({ message: "An unexpected error occurred while fetching address from coordinates." });
    }
};

module.exports.getAddressSuggestions = async (req, res) => {
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { input } = req.query;
        const suggestions = await mapService.getAddressSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        console.error("Error occurred while fetching address suggestions:", error.message);
        res.status(500).json({ message: "An unexpected error occurred while fetching address suggestions." });
    }
}