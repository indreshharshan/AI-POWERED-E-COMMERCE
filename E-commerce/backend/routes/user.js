const express = require('express');
const UserRouter = express.Router();
const { signup, login, otpVerify, resendOtp } = require('../controllers/User');


UserRouter.post('/signup', signup);
UserRouter.post('/otp-verify', otpVerify);
UserRouter.post('/login', login);
UserRouter.post('/resend-otp', resendOtp);

module.exports = UserRouter;
