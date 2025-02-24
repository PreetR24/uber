const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/captain.model');

module.exports.authUser = async(req, res, next) => {
    const userToken = req.cookies.userToken || req.headers.authorization?.split(' ')[ 1 ];
    if(!userToken){
        return res.status(401).json({message: 'Unauthorized'});
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: userToken });
    if(isBlacklisted){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        req.user = user;
        return next();
    }catch(err){
        console.log(err)
        return res.status(401).json({message: 'Internal Server Error'});
    }
}

module.exports.authCaptain = async(req, res, next) => {
    const captainToken = req.cookies.captainToken || req.headers.authorization?.split(' ')[ 1 ];
    if(!captainToken){
        return res.status(401).json({message: 'Unauthorized'});
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token: captainToken });
    if(isBlacklisted){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const decoded = jwt.verify(captainToken, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        req.captain = captain;
        return next();
    }catch(err){
        return res.status(401).json({message: 'Internal Server Error'});
    }
}