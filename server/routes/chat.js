/**
 * Chat Route — OpenAI-powered shopping assistant
 * Handles conversation with context-aware product knowledge
 */

import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// System prompt that gives the AI knowledge about JP Furnishing
const SYSTEM_PROMPT = `You are JP Furnishing's AI Shopping Assistant — a friendly, knowledgeable expert in home furnishing.

ABOUT JP FURNISHING:
- Premium home furnishing brand
- Products: Curtains, Bedsheets, Sofa Covers, Pillow Covers, Doormats
- Known for quality fabrics, elegant designs, and affordable luxury
- Based in India

YOUR CAPABILITIES:
1. Answer questions about products (materials, sizes, care instructions)
2. Recommend products based on room type, color preference, budget
3. Help with order tracking (use mock data if no real tracking available)
4. Assist with returns/refunds policy
5. Provide interior design tips

PRODUCT KNOWLEDGE:
- Curtains: Available in 7ft and 9ft lengths. Fabrics include polyester, cotton blend, sheer, blackout. 
  Price range: ₹400-₹2500 per panel.
- Bedsheets: King and Queen sizes. Materials: Cotton, Satin, Microfiber. 
  Price range: ₹500-₹3000.
- Sofa Covers: Custom sizes available. Stretchable and non-stretchable options. 
  Price range: ₹800-₹4000.
- Pillow Covers: Standard and Euro sizes. Decorative and functional. 
  Price range: ₹150-₹800 per pair.
- Doormats: Various sizes, anti-slip backing. Price range: ₹200-₹1200.

RETURNS POLICY:
- 7-day return window from delivery
- Product must be unused and in original packaging
- Refund processed within 5-7 business days

RESPONSE STYLE:
- Be warm, helpful, and concise
- Use emojis sparingly but naturally
- When recommending products, mention specific features
- If asked about something outside your scope, politely redirect
- Always format prices in ₹ (Indian Rupees)
- If the user mentions a product, try to link them to explore it on the website`;

/**
 * POST /api/chat
 * Body: { messages: [{role, content}], context?: string }
 */
router.post('/', async (req, res) => {
  try {
    const { messages, context } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array required' });
    }

    const apiKey = process.env.VITE_OPENAI_API_KEY;

    // If no API key, use intelligent fallback responses
    if (!apiKey) {
      const fallbackResponse = generateFallbackResponse(messages);
      return res.json({ reply: fallbackResponse });
    }

    const openai = new OpenAI({ apiKey });

    // Build system message with optional product context
    let systemMessage = SYSTEM_PROMPT;
    if (context) {
      systemMessage += `\n\nCURRENT PAGE CONTEXT:\n${context}`;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        ...messages.slice(-10), // Keep last 10 messages for context window
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t process that. Please try again!';

    res.json({ reply });
  } catch (error) {
    console.error('❌ Chat error:', error.message);

    if (error.code === 'insufficient_quota') {
      return res.json({ reply: 'Our AI assistant is temporarily unavailable. Please try again later or contact us directly!' });
    }

    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

/**
 * Intelligent fallback when no OpenAI key is available
 */
function generateFallbackResponse(messages) {
  const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

  // Greeting patterns
  if (/^(hi|hello|hey|good\s?(morning|evening|afternoon))/.test(lastMessage)) {
    return "Hello! 👋 Welcome to JP Furnishing! I'm your shopping assistant. How can I help you today? I can help with product recommendations, sizing, care instructions, or order inquiries!";
  }

  // Product queries
  if (lastMessage.includes('curtain')) {
    return "🪟 We have a beautiful collection of curtains! Available in 7ft and 9ft lengths, with fabrics like polyester, cotton blend, sheer, and blackout. Prices range from ₹400-₹2500 per panel. Would you like me to help you find the perfect curtain for your room?";
  }

  if (lastMessage.includes('bedsheet') || lastMessage.includes('bed sheet')) {
    return "🛏️ Our bedsheet collection features King and Queen sizes in Cotton, Satin, and Microfiber. Prices range from ₹500-₹3000. We have beautiful prints and solid colors. What size and style are you looking for?";
  }

  if (lastMessage.includes('sofa') || lastMessage.includes('cover')) {
    return "🛋️ Our sofa covers come in stretchable and non-stretchable options, custom-sized to fit perfectly. Prices range from ₹800-₹4000. Available in various colors and patterns! What's your sofa size?";
  }

  if (lastMessage.includes('pillow')) {
    return "✨ We have decorative and functional pillow covers in Standard and Euro sizes. Prices range from ₹150-₹800 per pair. Looking for something specific?";
  }

  if (lastMessage.includes('doormat')) {
    return "🚪 Our doormats feature anti-slip backing and come in various sizes. Prices range from ₹200-₹1200. Great for entrances and living areas!";
  }

  // Order/return queries
  if (lastMessage.includes('return') || lastMessage.includes('refund')) {
    return "📦 Our return policy: You can return unused products within 7 days of delivery in original packaging. Refunds are processed within 5-7 business days. Need help with a specific return?";
  }

  if (lastMessage.includes('track') || lastMessage.includes('order') || lastMessage.includes('delivery')) {
    return "📍 To track your order, please provide your order ID and I'll check the status for you! Typical delivery takes 5-10 business days depending on your location.";
  }

  // Price queries
  if (lastMessage.includes('price') || lastMessage.includes('cost') || lastMessage.includes('cheap') || lastMessage.includes('budget')) {
    return "💰 Here's a quick price guide:\n• Curtains: ₹400-₹2500/panel\n• Bedsheets: ₹500-₹3000\n• Sofa Covers: ₹800-₹4000\n• Pillow Covers: ₹150-₹800/pair\n• Doormats: ₹200-₹1200\n\nWould you like recommendations within a specific budget?";
  }

  // Default
  return "Thanks for reaching out! 😊 I can help you with:\n\n• 🛍️ Product recommendations\n• 📏 Size & material guidance\n• 💰 Pricing information\n• 📦 Order tracking & returns\n• 🎨 Interior design tips\n\nWhat would you like to know?";
}

export { router as chatRoute };
