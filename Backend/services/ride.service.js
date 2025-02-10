const { validationResult } = require('express-validator');
const rideModel = require('../models/ride.model');
const mapService = require('../services/maps.service');
const crypto = require('crypto');

async function getFare(pickup, destination){
    if(!pickup || !destination){
        throw new Error('Pickup and destination are required');
    }
    pickup = await mapService.getAddressCoordinates(pickup);
    destination = await mapService.getAddressCoordinates(destination);
    const distanceTime = await mapService.getDistanceTime(pickup, destination);

    if (!distanceTime) {
        throw new Error('Failed to fetch distance and duration');
    }

    const baseFare = {
        motorbike: 20,
        auto: 30,
        car: 50
    };
    const perKmRate = {
        motorbike: 5,
        auto: 10,
        car: 15
    };
    const perMinuteRate = {
        motorbike: 1.5,
        auto: 2,
        car: 3
    };

    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance / 1000) * perKmRate.auto) + ((distanceTime.duration / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance / 1000) * perKmRate.car) + ((distanceTime.duration / 60) * perMinuteRate.car)),
        motorbike: Math.round(baseFare.motorbike + ((distanceTime.distance / 1000) * perKmRate.motorbike) + ((distanceTime.duration / 60) * perMinuteRate.motorbike))
    };

    return fare;
}

module.exports.getFare = getFare;

function getOtp(){
    const otp = crypto.randomInt(Math.pow(10, 3), Math.pow(10, 4)).toString();
    return otp;
}

module.exports.createRide = async ({user, pickup, destination, vehicleType}) => {
    try {
        if(!user || !pickup || !destination || !vehicleType){
            throw new Error('All fields are required');
        }
        const fare = await getFare(pickup, destination);
        const ride = rideModel.create({
            user,
            pickup,
            destination,
            otp: getOtp(),
            fare: fare[vehicleType]
        });
        // ride.captain = captain;
        // await ride.save();
        // res.status(201).json(ride);
        return ride
    } catch (error) {
        console.error(error);
    }
}

module.exports.confirmRide = async ({rideId, captain})=> {
    try {
        if(!rideId){
            throw new Error('Ride ID is required');
        }

        await rideModel.findOneAndUpdate({ _id: rideId} ,{
            status: 'accepted',
            captain: captain._id
        })

        const ride = await rideModel.findOne({ _id: rideId}).populate('user').populate('captain').select('+otp');
        if(!ride){
            throw new Error('Ride not found');
        }
        return ride;
    } catch (error) {
        console.error(error);
    }
}

module.exports.startRide = async ({rideId, otp, captain}) => {
    if(!rideId, !otp) {
        throw new Error('Ride ID and OTP are required');
    }

    const ride = await rideModel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride; 
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await rideModel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}