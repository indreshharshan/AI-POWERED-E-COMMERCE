const Coupon = require('../models/Coupon');

// Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const { code, discount, discountType, discountValue, minOrder, expiry } = req.body;

    if (!code || !discount || !discountValue || !expiry) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase(),
      discount,
      discountType: discountType || 'percentage',
      discountValue,
      minOrder: minOrder || 0,
      expiry: new Date(expiry),
      status: 'Active'
    });

    await coupon.save();
    res.json({ success: true, message: 'Coupon created successfully', coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Validate / Apply a coupon (called from frontend cart)
exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Promo code is required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid promo code' });
    }

    if (coupon.status === 'Expired') {
      return res.status(400).json({ success: false, message: 'This promo code has expired' });
    }

    if (new Date() > new Date(coupon.expiry)) {
      // Auto-expire
      coupon.status = 'Expired';
      await coupon.save();
      return res.status(400).json({ success: false, message: 'This promo code has expired' });
    }

    if (cartTotal < coupon.minOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is Rs. ${coupon.minOrder} to use this code`
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, cartTotal); // can't exceed cart total

    const finalAmount = cartTotal - discountAmount;

    res.json({
      success: true,
      message: `Promo code applied! You saved Rs. ${discountAmount.toFixed(2)}`,
      discountAmount: parseFloat(discountAmount.toFixed(2)),
      finalAmount: parseFloat(finalAmount.toFixed(2)),
      coupon: {
        code: coupon.code,
        discount: coupon.discount,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
