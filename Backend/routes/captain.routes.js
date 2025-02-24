const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/signup', [
    body('email').isEmail().withMessage('Invalied email'),
], captainController.registerCaptain)
router.post('/signup/send-otp',captainController.SendOTPForRegister);
router.post('/signup/verify-otp',captainController.VerifyOTP);
router.post('/signup/complete-registration',[
    body('firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 chaarcters long'),
    body('email').isEmail().withMessage('Invalied email'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 8 characters long'),
    body('model').isLength({ min: 3 }).withMessage('Model must be at least 3 characters'),
    body('plate').isLength({ min: 3 }).withMessage('License Plate must be at least 3 characters'),
    body('capacity').isInt({ min:1 }).withMessage('Capcity must be at least 1'),
    body('vehicleType').isIn([ 'car', 'motorbike', 'auto' ]).withMessage('Type must be at least 3 characters'),
],captainController.EnterCaptainDetails);

router.post('/login',[
    body('email').isEmail().withMessage('Enter a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters'),
],captainController.loginCaptain);
router.post('/login/send-otp',captainController.SendOtpForLogin);
router.post('/login/verify-otp',captainController.VerifyOTP);
router.post('/login/set-psd',captainController.SetPassword);

router.get('/profile',authMiddleware.authCaptain, captainController.getCaptainProfile);
router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = router;