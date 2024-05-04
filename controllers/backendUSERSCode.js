const User = require("../models/backendUSERSModels.js");
 bcrypt = require('bcrypt');
 jwt = require ('jsonwebtoken');
 
         const Otp = require('../models/Otp.js');

         twilio = require ('twilio');

         otpGenerator = require ('otp-generator')
         
            exports.login = async function (req, res, next) {
                User.findOne({ name: req.body.name })
                .then(user => {
                    if (!user) {
                        return res.status(401).json({ message: 'User is not registered' });
                    }
            
                    bcrypt.compare(req.body.password, user.password)
                        .then(valid => {
                            if (!valid) {
                                return res.status(401).json({ message: 'Password incorrect' });
                            } else {
                                const maxAge = 1 * 60 * 60;
                                const token = jwt.sign(
                                    { userId: user._id, role: user.role, numTel: user.numTel },
                                    "" + process.env.JWT_SECRET,
                                    { expiresIn: maxAge } // 1hr in sec
                                );
                                res.cookie("jwt", token, {
                                    httpOnly: true,
                                    maxAge: maxAge * 1000, // 1hr in ms
                                    Secure: true,
                                });
            
                                res.status(200).json({
                                    userId: user._id,
                                    message: "User successfully Logged in",
                                    jwt: token,
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error in bcrypt.compare:', error);
                            res.status(500).json({ error: 'Internal Server Error' });
                        });
                })
                .catch(error => {
                    console.error('Error in User.findOne:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                });
            
            }
            
            exports.Register = async function (req, res, next) {
                try {
                    const hash = await bcrypt.hash(req.body.password, 10);
                    const existingUser = await User.findOne({
                        numTel: req.body.numTel,
                    });
                    if (existingUser) {
                        return res.status(400).json({ message: "It seems you already have an account, please log in instead." });
                    }
            
            
            
                    const user = new User({
                        username: req.body.username,
                        email: req.body.email,
                        password: hash,
                        numTel: req.body.numTel,
            
                    });
            
                    await user.save();
            
                    return res.status(200).json({ message: 'User created' });
            
                } catch (error) {
                    return res.status(500).json({ error: error.message });
                }
            }
            
            exports.forgetPassword = async function (req, res, next) {
                try {
                    // Extract numTel from the request body
                    const { numTel } = req.body;
                
                    // Check if the user is registered
                    const user = await User.findOne({ numTel });
                
                    if (!user) {
                      return res.status(401).json({ message: 'User is not registered' });
                    }
                
                    // Generate OTP
                    const otp = otpGenerator.generate(6, {
                      secret: process.env.JWT_SECRET,
                      digits: 6,
                      algorithm: 'sha256',
                      epoch: Date.now(),
                      upperCaseAlphabets: false,
                      specialChars: false,
                      lowerCaseAlphabets: false,
                    });
                
                    // Save OTP in the database
                    const otpDocument = new Otp({
                      userId: numTel,
                      otp,
                    });
                    await otpDocument.save();
                //     const accountSid = ' ';
                //     const authToken = ' ';
                //     const twilioPhoneNumber = '+ numTel';
                
                //     const client = twilio(accountSid, authToken);
                    
                //     const phoneNumberE164  ="+216" + req.body.numTel
                
                //     console.log('Sending SMS to:', phoneNumberE164);
                //     // Send SMS using Twilio
                //     const message = await client.messages.create({
                //       body: 'Strapi Welcome you!
                //                 Your OTP is: {otp}'', // add '$ befor the {otp} '
                //       from: twilioPhoneNumber,
                //       to: phoneNumberE164,
                //     });
                
                //     console.log('SMS sent with SID: {message.sid}'');
                //    // sendSMS(numTel, otp);
                
                    return res.status(200).json({ otp });
                  } catch (error) {
                    console.error('Error in forgetPasssword:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }
            }
            
            exports.sendOtp = async function (req, res, next) {
                try {
                    const existingUser = await User.findOne(
                      { numTel: req.body.numTel },
                    );
                
                    if (existingUser) {
                      return res.status(400).json({ message: "It seems you already have an account, please log in instead." });
                    }
                    const otp = otpGenerator.generate(6,{
                      secret: process.env.JWT_SECRET,
                      digits: 6,
                      algorithm: 'sha256',
                      epoch: Date.now(),
                      upperCaseAlphabets: false, specialChars: false,
                      lowerCaseAlphabets: false,
                  });
                        const otpDocument = new Otp({
                            userId: req.body.numTel, 
                            otp
                        });
                
                         otpDocument.save();
                       /*  const Tnumtel ="+216" + req.body.numTel
                        sendSMS(Tnumtel,otp)*/
                        res.status(200).json({ message: "OTP Sent"});
                
                } catch (error) {
                    console.error('Error generating OTP:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
            exports.verifyOtp = async function (req, res, next) {
                try {
                    const { numTel, otp } = req.body;
                    const otpDocument = await Otp.findOne({ userId: numTel });
                
                    if (!otpDocument) {
                      return res.status(404).json({ error: 'OTP not found' });
                    }
                
                    // Verify the OTP
                    if (otp === otpDocument.otp) {
                      // Delete the OTP document
                      await otpDocument.deleteOne();
                
                      return res.status(200).json({ message: 'OTP verified' });
                    } else {
                      return res.status(401).json({ error: 'Invalid OTP' });
                    }
                  } catch (error) {
                    console.error('Error in verifyOtp:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                  }
            }
            
            exports.resetPassword = async function (req, res, next) {
                try {
                   
                    const hash = await bcrypt.hash(req.body.newPassword, 10);
                  
                    const user = await User.findOneAndUpdate(
                      { numTel: req.body.numTel },
                      { password: hash },
                      { new: true } 
                      );             
                      if (!user) {
                       return res.status(404).json({ error: 'User not found' });
                       }
                                     
                      return res.status(200).json({ message: 'Password changed !', user });
                  } catch (error) {
                    console.error('Error resetting password:', error);
                    return res.status(500).json({ error: 'Internal Server Error' });
                  }            }
            
            