const Product = require('../models/Product');
const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.addProduct = async (req, res) => {
  try {
    let last = await Product.findOne().sort({ id: -1 });
    let id = last ? last.id + 1 : 1;
    const { name, description, image, category, occasion, new_price, old_price, rating, reviews } = req.body;
    const product = new Product({
      id, name, description, image, category, occasion, new_price, old_price, rating, reviews
    })
    await product.save();
    console.log(product);
    res.json({
      success: 1,
      name: name,
    })
  }
  catch (err) {
    console.log("error while adding product", err);
  }
}

exports.removeProduct = async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log('removed');
    res.json({
      success: true,
      name: req.body.name
    })
  }
  catch (err) {
    console.log("error while removing product", err);
  }

}

exports.getAllProducts = async (req, res) => {
  try {
    let products = await Product.find()
    res.json(products);
  }
  catch (err) {
    console.log("error while fetching products", err);
  }

}
exports.getNewCollections = async (req, res) => {
  try {
    let products = await Product.find({}).sort({ date: -1 }).limit(8);
    // console.log("New Collections fetched ");
    res.send(products);
  }
  catch (err) {
    console.log("error while fetching products", err);
  }
}
exports.getPopularWomen = async (req, res) => {
  try {

    let products = await Product.find({ category: "women" });
    let popular = products.slice(0, 4);
    // console.log('popular in women fetched');
    res.send(popular);
  }
  catch (err) {
    console.log("error while fetching products", err);
  }
}

exports.getOffers = async (req, res) => {
  try {
    let products = await Product.find({});
    let offers = products.filter(p => p.old_price > p.new_price);
    
    offers.sort((a, b) => {
      const discountA = ((a.old_price - a.new_price) / a.old_price) * 100;
      const discountB = ((b.old_price - b.new_price) / b.old_price) * 100;
      return discountB - discountA;
    });
    
    res.json(offers.slice(0, 12));
  } catch (err) {
    console.log("error while fetching offers", err);
    res.status(500).send("Server Error");
  }
}

exports.visualSearch = async (req, res) => {
  try {
    const { image } = req.body; // Expecting base64 string
    if (!image) return res.status(400).json({ success: 0, message: "No image provided" });

    // Use Groq Vision to analyze image
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analyze this clothing item. Return ONLY a JSON object with the following keys: 'category' (choose from: men, women, kid), 'product_type' (e.g., shirt, dress, jeans), 'color', 'style' (e.g., casual, formal, floral). Be concise.",
            },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      model: "llama-3.2-11b-vision-preview",
      response_format: { type: "json_object" },
    });

    const analysis = JSON.parse(chatCompletion.choices[0].message.content);
    console.log("AI Analysis:", analysis);

    // Build Search Query
    const searchKeywords = [analysis.product_type, analysis.color, analysis.style].join(" ");
    
    // Find products matching category and partially matching name/description
    const products = await Product.find({
      category: analysis.category,
      $or: [
        { name: { $regex: analysis.product_type, $options: "i" } },
        { description: { $regex: analysis.product_type, $options: "i" } },
        { name: { $regex: analysis.color, $options: "i" } }
      ]
    }).limit(12);

    res.json({
      success: 1,
      analysis,
      products
    });
  } catch (err) {
    console.error("--- Visual Search AI Error ---");
    if (err.response) {
      console.error("Groq API Error:", err.response.data || err.response);
    } else {
      console.error(err.message);
    }
    console.error("-------------------------------");
    res.status(500).json({ success: 0, message: "AI search failed: " + err.message });
  }
};
