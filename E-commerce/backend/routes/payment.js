const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const Stripe = require('stripe');
const crypto = require('crypto');
const fetchUser = require('../middleware/fetchUser');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /api/payment/razorpay/order - Generate order ID for payment
router.post('/razorpay/order', fetchUser, async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ success: false, message: "Error creating Razorpay order" });
    }

    res.json({ success: true, orderId: order.id, amount: order.amount });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// POST /api/payment/razorpay/verify - Verify signature after payment
router.post('/razorpay/verify', fetchUser, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment is successful
      res.json({ success: true, message: "Payment Verified successfully", paymentId: razorpay_payment_id });
    } else {
      res.status(400).json({ success: false, message: "Payment Verification Failed" });
    }
  } catch (error) {
    console.error("Razorpay Verify Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// POST /api/payment/stripe/order - Create Stripe checkout session
router.post('/stripe/order', fetchUser, async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Shopper Order Checkout',
            },
            unit_amount: Math.round(amount * 100), // convert to paise / cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/orders?payment=stripe_success&orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });

    res.json({ success: true, sessionUrl: session.url });
  } catch (error) {
    console.error("Stripe Order Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// POST /api/payment/stripe/verify - Verify Stripe payment status and mark paid
router.post('/stripe/verify', fetchUser, async (req, res) => {
  try {
    const { orderId } = req.body;
    const Order = require('../models/Order');
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    // Check if the user owns the order
    if (order.userId.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    order.paymentStatus = 'Paid';
    await order.save();
    res.json({ success: true, message: "Stripe payment marked as Paid" });
  } catch (error) {
    console.error("Stripe Verify Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
