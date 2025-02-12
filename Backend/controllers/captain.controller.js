const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const OTP = require('../models/otp');
const { sendEmail } = require('../utils/sendEmail');

module.exports.registerCaptain = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    
    try {
        console.log(email);
        const captainExists = await captainModel.findOne({ email });
        if (captainExists) {
            return res.status(400).json({ message: 'Captain already exists' });
        }
        res.cookie('email', email, {
            httpOnly: true,    // Prevent client-side JS access to the cookie
            secure: process.env.NODE_ENV === 'production', // Secure cookie in production (requires HTTPS)
            sameSite: 'strict', // Ensures cookie is sent only to same-origin requests
            maxAge: 24 * 60 * 60 * 1000, // 1 day expiration time
        });
        res.status(200).json({ message: 'Email fetched' });
    }
    catch (error) {
        console.error(error);
        return;
    }
}

module.exports.SendOTPForRegister = async(req, res, next) => {
    try {
        const email = req.cookies.email;
        await OTP.deleteOne({ email });
        if(!email){
            return res.status(401).json({ message: 'Email not found' });
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for email verification of Uber Account for Captain registration',
            text: `Your OTP is ${otp}, valid for 5 minutes`
        };
        await sendEmail(mailOptions);
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await OTP.create({ email, otp, expiresAt });
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}

module.exports.VerifyOTP = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { otp } = req.body;
    let email = req.cookies.email;
    try {
        const otpExists = await OTP.findOne({ email, otp });
        if (!otpExists) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }
        return res.status(200).json({ message: 'Otp verified successfully'});
    }
    catch (error) {
        console.error(error);
        return;
    }
}       

module.exports.EnterCaptainDetails = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors);
            return res.status(400).json({ errors: errors.array() });
        }
        const { firstname, lastname, email, password, model, plate, capacity, vehicleType } = req.body;
    
        const hashedPassword = await captainModel.hashPassword(password);
    
        const captain = await captainService.createCaptain({
            firstname,
            lastname,
            email,
            password: hashedPassword,
            model,
            plate,
            capacity,
            vehicleType
        })
    
        const captainToken = captain.generateAuthToken();
        res.clearCookie('email');
        return res.status(201).json({ captainToken, captain });
    } catch (error) {
        console.log(error);
    }
}

module.exports.loginCaptain = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        const captain = await captainModel.findOne({ email }).select('+password');
        if (!captain) {
            return res.status(400).json({ error: 'Captain does not exist' });
        }

        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const captainToken = captain.generateAuthToken();
        res.cookie('captainToken', captainToken);
        res.status(200).json({ captainToken, captain });
    } catch (error) {
        res.status(400).json({ message: 'An error occurred', error: error.message });
    }
}

module.exports.SendOtpForLogin = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
        const captainExists = await captainModel.findOne({ email });
        if (!captainExists) {
            return res.status(401).json({ message: 'Captain does not exists' });
        }
        await OTP.deleteOne({ email });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for password reset of Uber Account for captain',
            text: `Your OTP is ${otp}, valid for 5 minutes`
        };
        await sendEmail(mailOptions);
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await OTP.create({ email, otp, expiresAt });
        res.cookie('email', email);
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        return;
    }
}

module.exports.SetPassword = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const captain = await captainModel.findOne({ email });  // Find user by email
        if (!captain) {
            return res.status(404).json({ message: "Captain not found" });
        }

        const hashedPassword = await captainModel.hashPassword(password);

        // Update only the password
        await captainModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating password' });
    }
}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    res.clearCookie('captainToken');
    const captainToken = req.cookies.captainToken || req.headers.authorization.split(' ')[ 1 ];
    await blacklistTokenModel.create({ token: captainToken });
    res.status(200).json({ message: 'Logged out successfully' });
}