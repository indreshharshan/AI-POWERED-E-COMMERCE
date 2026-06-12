const Users = require('../models/User');

exports.addtoCart = async (req, res) => {
  let userData = await Users.findOne({
    _id: req.user.id
  });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({ _id: req.user.id }, {
    cartData:userData.cartData
  });
  res.json({ success: true, message: "Added" });
}

exports.getCart = async (req, res) => {
  let userData = await Users.findOne({
    _id: req.user.id
  });
  res.json(userData.cartData);
}

exports.removefromCart = async (req, res) => {
  let userData = await Users.findOne({
    _id: req.user.id
  });
  const itemId = req.body.itemId || req.body.id; // Handle both 'itemId' and 'id'
  if (userData.cartData[itemId] > 0) {
    userData.cartData[itemId] -= 1;
  }
  await Users.findOneAndUpdate({ _id: req.user.id }, {
    cartData:userData.cartData
  });
  res.json({ success: true, message: "Removed" });
}