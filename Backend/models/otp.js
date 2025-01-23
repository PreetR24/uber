const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    otp: String,
    expiresAt: { type: Date, required: true },
});

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model('otp', OTPSchema);
module.exports = OTP;