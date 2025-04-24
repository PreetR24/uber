const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapsController = require('../controllers/maps.controller');
const { query, body } = require('express-validator');

router.get('/get-coordinates',
    query('address').isString().notEmpty().isLength({min: 3}),
    authMiddleware.authUser, mapsController.getAddressCoordinates
);

router.post('/get-distance',
    body('start').isArray().withMessage('Start coordinates must be an array'),
    body('end').isArray().withMessage('Start coordinates must be an array'),
    authMiddleware.authUser, mapsController.getDistanceTime
)

router.get('/get-address',
    query('lat').isFloat().withMessage('Latitude must be a float'),
    query('lng').isFloat().withMessage('Longitude must be a float'),
    authMiddleware.authUser, mapsController.getAddressFromCoordinates
)

router.get('/get-suggestions',
    query('input').isString().notEmpty().isLength({min: 3}),
    authMiddleware.authUser, mapsController.getAddressSuggestions
)

module.exports = router;