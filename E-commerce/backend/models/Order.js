const mongoose = require("mongoose");

const Order = mongoose.model("Order", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  items: [
    {
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  address: {
    type: Object,
    required: true,
  },
  paymentMethod: {
    type: String,
    default: "COD",
  },
  status: {
    type: String,
    default: "Processing",
  },
  paymentStatus: {
    type: String,
    default: "Unpaid",
  },
  razorpayOrderId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = Order;
