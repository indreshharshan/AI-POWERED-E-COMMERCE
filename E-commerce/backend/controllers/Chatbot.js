const Groq = require("groq-sdk");
const Product = require("../models/Product");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

exports.handleChat = async (req, res) => {
  try {
    const { message, chatHistory } = req.body;

    // Fetch all products to give context to the AI
    // In a real production app, you'd use vector search or better filtering
    // but for this MERN project, we'll provide the catalog summary.
    const products = await Product.find({ available: true }).select(
      "name description category new_price old_price rating reviews id image"
    );

    const catalogContext = products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      price: p.new_price,
      rating: p.rating,
      description: p.description.substring(0, 100) + "...",
      image: p.image
    }));

    const systemPrompt = `
You are "Shopper AI", a premium fashion assistant for the "Shopper" online store.
Your goal is to help users find clothes, shoes, and accessories.

STRICT RULES:
1. You are the "Shopper AI" store assistant.
2. YOU CAN DISPLAY IMAGES. When you recommend or mention a product, you MUST use this exact format: {{PRODUCT_1}}. 
3. DO NOT say "I am a text assistant" or "I cannot show images". Instead, say "Here is the {{PRODUCT_1}}" and the system will show the card.
4. If a user asks to see something (e.g., "show me men shirts"), you MUST find all matching products in the catalog and list them with their tags.
5. Always check the "CATALOG DATA" below before answering.

CATALOG DATA:
${JSON.stringify(catalogContext, null, 2)}

FEW-SHOT EXAMPLES:
User: "show me men neck tshirts"
Assistant: "I found this great Men Rounded Neck T-Shirt for you! {{PRODUCT_1}} It's a high-quality product for just $330. Would you like to add it to your cart?"

User: "do you have anything for women?"
Assistant: "Yes! We have several popular items for women. Check these out: {{PRODUCT_2}}, {{PRODUCT_5}}."
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory.map(ch => ({
        role: ch.role === "user" ? "user" : "assistant",
        content: ch.content
      })),
      { role: "user", content: message }
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const botResponse = chatCompletion.choices[0].message.content;

    // Extract product IDs from response {{PRODUCT_1}}
    const productIds = [];
    const regex = /{{PRODUCT_(\d+)}}/gi;
    let match;
    while ((match = regex.exec(botResponse)) !== null) {
      productIds.push(parseInt(match[1]));
    }

    // Fetch full product details for the mentioned products
    const mentionedProducts = await Product.find({ id: { $in: productIds } });

    res.json({
      success: true,
      message: botResponse,
      products: mentionedProducts
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({
      success: false,
      message: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later."
    });
  }
};
