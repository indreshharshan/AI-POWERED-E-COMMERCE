const Users = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sendEmail = require('../config/mailer');



exports.signup = async (req, res) => {
  try {
    const existingUser = await Users.findOne({
      email: req.body.email
    });

    // ✅ Case 1: User exists AND verified
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        errors: "User already registered. Please login."
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 3 * 60 * 1000;

    // ✅ Case 2: User exists but NOT verified → resend OTP
    if (existingUser && !existingUser.isVerified) {

      existingUser.otp = otp;
      existingUser.otpExpiry = otpExpiry;
      await existingUser.save();

      await sendEmail({
        to: existingUser.email,
        subject: "Verify Your Email Address",
        text: `Your OTP is: ${otp}`
      });

      return res.json({
        success: true,
        message: "OTP resent successfully"
      });
    }

    // ✅ Case 3: New User → Create account

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const user = new Users({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      cartData: cart,
      otp,
      otpExpiry,
      isVerified: false
    });

    await user.save();

    await sendEmail({
      to: req.body.email,
      subject: "Verify Your Email Address",
      text: `Your OTP is: ${otp}`
    });

    res.json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error"
    });
  }
};


exports.otpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await Users.findOne({
      email: email
    })
    if (!user) {
      return res.status(404).json({
        success: false,
        errors: "User not found"
      })
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        errors: "Invalid OTP"
      })
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        errors: "OTP has expired"
      })
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const data = {
      user: {
        id: user.id
      }
    }
    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
      message: "User verified successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error"
    })
  }
}

exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await Users.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        errors: "User not found"
      });
    }

    if (existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        errors: "User is already verified. Please login."
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = Date.now() + 3 * 60 * 1000;

    existingUser.otp = otp;
    existingUser.otpExpiry = otpExpiry;
    await existingUser.save();

    await sendEmail({
      to: existingUser.email,
      subject: "Verify Your Email Address - Resend OTP",
      text: `Your new OTP is: ${otp}`
    });

    res.json({
      success: true,
      message: "OTP resent successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      errors: "Internal Server Error"
    });
  }
};
















exports.login = async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });

  if (!user) {
    return res.json({
      success: false,
      errors: "Wrong Email-ID"
    });
  }

  if (!user.isVerified) {
    return res.json({
      success: false,
      errors: "Please verify your email first"
    });
  }

  const passCompare = await bcrypt.compare(req.body.password, user.password);

  if (!passCompare) {
    return res.json({
      success: false,
      errors: "Wrong Password"
    });
  }

  const data = {
    user: { id: user.id }
  };

  const token = jwt.sign(data, process.env.JWT_SECRET);

  res.json({
    success: true,
    token
  });
};
