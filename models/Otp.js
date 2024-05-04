
const mongoose = require('mongoose');
const { Schema } = mongoose;

const otpSchema =new mongoose.Schema({
    userId: String,  
    otp: String,
    createdAt: { type: Date, default: Date.now },
    expires: { type: Date, default: Date.now, expires: 1500 },
  })
const Otp = mongoose.model('Otp', otpSchema);

module.exports = Otp;



