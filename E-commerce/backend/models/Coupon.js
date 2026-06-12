const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discount: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat'],
    default: 'percentage'
  },
  discountValue: {
    type: Number,
    required: true
  },
  minOrder: {
    type: Number,
    default: 0
  },
  expiry: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Expired'],
    default: 'Active'
  }
}, { timestamps: true });

module.exports = mongoose.model('Coupon', CouponSchema);
