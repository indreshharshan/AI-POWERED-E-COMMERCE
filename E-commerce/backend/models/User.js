const mongoose = require("mongoose");

const Users = mongoose.model('Users', {
  name: {
    type: String,
    
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    
  },
  cartData: {
    type: Object
  },
  date: {
    type: Date,
    default: Date.now()
  },
  otp: {
    type:String
  },
  otpExpiry: {
    type:Date
  },
  isVerified: {
    type:Boolean,
    default:false
  }



});

module.exports = Users;
