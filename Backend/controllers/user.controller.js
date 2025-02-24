const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');
const OTP = require('../models/otp');
const { sendEmail } = require('../utils/sendEmail');

module.exports.registerUser = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        res.status(200).json({ message: 'Email fetched' });
    }
    catch (error) {
        console.error(error);
        return;
    }
}

module.exports.SendOTPForRegister = async(req, res, next) => {
    try {
        const { email } = req.body;
        if(!email){
            return res.status(401).json({ message: 'Email not found' });
        }
        await OTP.deleteOne({ email });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for email verification of Uber Account',
            text: `Your OTP is ${otp}, valid for 1 minutes`
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
    const { email,otp } = req.body;
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

module.exports.EnterUserDetails = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { firstname, lastname, password, email } = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname,
        lastname,
        email,
        password: hashedPassword
    })

    const userToken = user.generateAuthToken();
    res.clearCookie('email');
    return res.status(201).json({ userToken, user });
}

module.exports.loginUser = async(req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;

        const user = await userModel.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        const userToken = user.generateAuthToken();
        return res.status(201).json({ userToken, user });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'An error occurred', error: error.message });
    }
}

module.exports.SendOtpForLogin = async(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;
    try {
        const userExists = await userModel.findOne({ email });
        if (!userExists) {
            return res.status(401).json({ message: 'User does not exists' });
        }
        await OTP.deleteOne({ email });
        const otp = Math.floor(1000 + Math.random() * 9000);
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP for password reset of Uber Account',
            text: `Your OTP is ${otp}, valid for 5 minutes`
        };
        await sendEmail(mailOptions);
        const expiresAt = new Date(Date.now() + 1 * 60 * 1000);
        await OTP.create({ email, otp, expiresAt });
        return res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error(error);
        return;
    }
}

module.exports.SetPassword = async(req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });  // Find user by email
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Hash password before saving it
        const hashedPassword = await userModel.hashPassword(password);

        // Update only the password
        await userModel.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

        return res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating password' });
    }
}

module.exports.getUserProfile = async(req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async(req, res, next) => {
    res.clearCookie('userToken');
    const userToken = req.cookies.userToken || req.headers.authorization.split(' ')[ 1 ];
    await blacklistTokenModel.create({ token: userToken });
    res.status(200).json({ message: 'Logged out successfully' });
}