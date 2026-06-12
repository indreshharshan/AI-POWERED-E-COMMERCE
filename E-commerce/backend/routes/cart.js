const express = require('express');
const cartRouter = express.Router();
const {addtoCart} = require('../controllers/Cart');
const {removefromCart} = require('../controllers/Cart');
const {getCart} = require('../controllers/Cart');
const fetchUser = require('../middleware/fetchUser');


cartRouter.post('/addtocart',fetchUser, addtoCart);
cartRouter.post('/removefromcart', fetchUser, removefromCart);
cartRouter.post('/getcart', fetchUser, getCart);


module.exports = cartRouter;