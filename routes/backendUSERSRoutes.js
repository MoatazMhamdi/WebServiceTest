const express = require('express');
const router = express.Router();

    const users = require('../controllers/backendUSERSCode.js');


        router.route("/login")
        .post(users.login);

      
      router.route("/register")
      .post(users.Register);


      
      router
      .route('/forgetPassword')
      .post(users.forgetPassword)

      
      router
      .route('/verifyOTP')
      .post(users.verifyOtp)
    
      router
      .route('/sendOTP')
      .post(users.sendOtp)

      
      router
      .route('/resetPassword')
      .post(users.resetPassword)

    
module.exports = router;