const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/create', 
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min:3 }).withMessage('Invalid pickup coordinates'),
    body('destination').isString().isLength({ min:3 }).withMessage('Invalid destination coordinates'),
    body('vehicleType').isString().isIn(['auto', 'car', 'motorbike']).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min:3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min:3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride Id'),
    rideController.confirmRide
)

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride Id'),
    query('otp').isString().withMessage('Invalid otp'),
    rideController.startRide    
)

router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride Id'),
    rideController.endRide
)

module.exports = router;