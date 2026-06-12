const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Users = require('../models/User');
const fetchUser = require('../middleware/fetchUser');

// POST /api/order/create - Create a new order from cart
router.post('/create', fetchUser, async (req, res) => {
  try {
    const { items, totalAmount, address, paymentMethod, paymentStatus, razorpayOrderId } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "No items provided" });
    }

    if (!address) {
      return res.status(400).json({ success: false, message: "Delivery address is required" });
    }

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      address,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "Unpaid",
      razorpayOrderId: razorpayOrderId || null
    });

    await order.save();

    // Clear user cart after successful order placement
    const userData = await Users.findById(req.user.id);
    let emptyCart = {};
    for (let i = 0; i < 300; i++) {
      emptyCart[i] = 0;
    }
    userData.cartData = emptyCart;
    await userData.save();

    res.json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order Create Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /api/order/my-orders - Fetch user orders
router.get('/my-orders', fetchUser, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// GET /api/order/all-orders - Fetch all orders (Admin)
router.get('/all-orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ date: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch All Orders Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

// POST /api/order/status - Update order status (Admin)
router.post('/status', async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    order.status = status;
    await order.save();
    res.json({ success: true, message: "Order status updated successfully", order });
  } catch (error) {
    console.error("Update Status Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

module.exports = router;
