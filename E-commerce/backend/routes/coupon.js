const express = require('express');
const router = express.Router();
const { createCoupon, getAllCoupons, deleteCoupon, validateCoupon } = require('../controllers/Coupon');

// Admin routes
router.post('/create', createCoupon);
router.get('/all', getAllCoupons);
router.delete('/:id', deleteCoupon);

// Frontend route
router.post('/validate', validateCoupon);

module.exports = router;
