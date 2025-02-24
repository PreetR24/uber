const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware')

router.post('/signup', [
    body('email').isEmail().withMessage('Invalied email'),
], userController.registerUser)
router.post('/signup/send-otp',userController.SendOTPForRegister);
router.post('/signup/verify-otp',userController.VerifyOTP);
router.post('/signup/complete-registration',[
    body('firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 chaarcters long'),
    body('email').isEmail().withMessage('Invalied email'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 8 characters long') 
],userController.EnterUserDetails);

router.post('/login', [
    body('email').isEmail().withMessage('Invalied email'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 8 characters long') 
], userController.loginUser)
router.post('/login/send-otp',userController.SendOtpForLogin);
router.post('/login/verify-otp',userController.VerifyOTP);
router.post('/login/set-psd',userController.SetPassword);

router.get('/profile',authMiddleware.authUser, userController.getUserProfile);
router.get('/logout',authMiddleware.authUser, userController.logoutUser);

module.exports = router;