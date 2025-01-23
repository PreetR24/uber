const captainModel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.createCaptain = async ({firstname, lastname, email, password, model, plate, capacity, vehicleType}) => {
    try {
        if(!firstname || !lastname || !email || !password || !model || !plate || !capacity || !vehicleType) {
            throw new Error('All fields are required');
        }
        const captain = captainModel.create({
            fullname: {
                firstname,
                lastname,
            },
            email,
            password,
            vehicle: {
                model,
                plate,
                capacity,
                vehicleType,
            }
        });
        return captain;
    } catch (error) {
        throw new Error(error);
    }
}