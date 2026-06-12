const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const Users = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      passReqToCallback: true
    },
    async function (req, accessToken, refreshToken, profile, cb) {
      try {             
        let user = await Users.findOne({
          email: profile.emails[0].value
        });

        if (!user) {
          let cart = {};
          for (let i = 0; i < 300; i++) {
            cart[i] = 0;
          }
          user = new Users({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: "",
            cartData: cart,
            date: Date.now(),
            otp: "",
            otpExpiry: "",
            isVerified: true
          });

          await user.save();
        }

        const token = jwt.sign(
          { user: { id: user.id } },
          process.env.JWT_SECRET,
          { expiresIn: "7d" }
        );

        return cb(null, { user, token });

      } catch (error) {
        return cb(error, null);
      }
    }
  )
);