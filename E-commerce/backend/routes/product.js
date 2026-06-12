const express = require("express");
const productRouter = express.Router();
const {addProduct} = require('../controllers/Product')
const { removeProduct } = require('../controllers/Product')
const { getAllProducts } = require('../controllers/Product')
const { getNewCollections } = require('../controllers/Product')
const { getPopularWomen } = require('../controllers/Product')
const { visualSearch } = require('../controllers/Product')
const { getOffers } = require('../controllers/Product')

productRouter.post('/addproduct', addProduct);
productRouter.post('/removeproduct', removeProduct);
productRouter.get('/allproducts', getAllProducts);
productRouter.get('/newcollections', getNewCollections);
productRouter.get('/popular', getPopularWomen);
productRouter.post('/visualsearch', visualSearch);
productRouter.get('/offers', getOffers);






module.exports = productRouter;
