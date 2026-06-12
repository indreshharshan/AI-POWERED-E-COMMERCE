require("dotenv").config();
const express = require('express');
const app = express();
const multer = require('multer')
const path = require('path');
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const passport = require('passport');
require('./auth/google');
const connectDB = require('./config/db');
const productRouter = require('./routes/product');
const UserRouter = require('./routes/user');
const cartRouter = require('./routes/cart');
const googleAuthRouter = require("./routes/googleAuth");
const chatbotRouter = require("./routes/chatbot");
const orderRouter = require('./routes/order');
const paymentRouter = require('./routes/payment');
const couponRouter = require('./routes/coupon');


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
app.use(passport.initialize());
connectDB();
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'shopper_products',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    public_id: (req, file) => `${file.fieldname}_${Date.now()}`,
  },
});

const upload = multer({
  storage,
});

app.use('/images', express.static('upload/images')); // Keep for existing local images
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: req.file.path // Cloudinary URL
  });
});

app.use('/products', productRouter);
app.use('/user', UserRouter);
app.use('/cart', cartRouter);
app.use('/', googleAuthRouter);
app.use('/chatbot', chatbotRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/order', orderRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/coupon', couponRouter);


app.get("/", (req, res) => {
  res.send("Shopper Backend is Running 🚀");
});



app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server running on Port" + PORT);
  }
  else {
    console.log("errror while runnig server " + error)
  }
})
