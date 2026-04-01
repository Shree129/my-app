/**
 * Search Route — NLP-powered smart search
 * Parses natural language queries into structured filters
 */

import { Router } from 'express';
import OpenAI from 'openai';

const router = Router();

// Synonym map for common search terms
const SYNONYMS = {
  'curtain': ['curtains', 'drape', 'drapes', 'window covering', 'blinds', 'sheer'],
  'bedsheet': ['bedsheets', 'bed sheet', 'bed sheets', 'bed linen', 'bedding', 'sheets'],
  'sofa cover': ['sofa covers', 'couch cover', 'couch covers', 'slip cover', 'slipcover'],
  'pillow cover': ['pillow covers', 'cushion cover', 'cushion covers', 'pillowcase'],
  'doormat': ['doormats', 'door mat', 'floor mat', 'entrance mat', 'rug'],
};

// Color synonym map
const COLOR_MAP = {
  'red': ['red', 'maroon', 'crimson', 'scarlet', 'ruby', 'burgundy'],
  'blue': ['blue', 'navy', 'azure', 'cobalt', 'teal', 'turquoise', 'indigo'],
  'green': ['green', 'olive', 'emerald', 'lime', 'sage', 'forest', 'mint'],
  'brown': ['brown', 'chocolate', 'coffee', 'tan', 'mocha', 'chestnut'],
  'beige': ['beige', 'cream', 'ivory', 'off-white', 'champagne', 'sand'],
  'black': ['black', 'charcoal', 'ebony', 'jet'],
  'white': ['white', 'snow', 'pearl'],
  'grey': ['grey', 'gray', 'silver', 'ash', 'slate'],
  'pink': ['pink', 'rose', 'blush', 'magenta', 'salmon'],
  'purple': ['purple', 'violet', 'lavender', 'plum', 'mauve'],
  'yellow': ['yellow', 'gold', 'golden', 'mustard', 'amber'],
  'orange': ['orange', 'coral', 'peach', 'tangerine'],
};

/**
 * POST /api/search/parse
 * Body: { query: string }
 * Returns structured search intent from natural language
 */
router.post('/parse', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });

    const apiKey = process.env.VITE_OPENAI_API_KEY;

    // Try OpenAI parsing first, fallback to rule-based
    if (apiKey) {
      try {
        const parsed = await parseWithAI(query, apiKey);
        return res.json(parsed);
      } catch (err) {
        console.warn('⚠️ OpenAI parse failed, using fallback:', err.message);
      }
    }

    // Rule-based fallback parsing
    const parsed = parseQueryRuleBased(query);
    res.json(parsed);
  } catch (error) {
    console.error('❌ Search parse error:', error.message);
    res.status(500).json({ error: 'Failed to parse search query' });
  }
});

/**
 * Parse with OpenAI for complex natural language queries
 */
async function parseWithAI(query, apiKey) {
  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a search query parser for a home furnishing store (JP Furnishing). 
Parse the user's natural language query into structured JSON.

Products: curtains, bedsheets, sofa covers, pillow covers, doormats

Return JSON with these fields (omit if not found):
{
  "category": "curtain|bedsheet|sofa_cover|pillow_cover|doormat",
  "color": "color name",
  "minPrice": number,
  "maxPrice": number,
  "material": "fabric type",
  "pattern": "floral|geometric|striped|plain|textured",
  "room": "bedroom|living_room|entrance|bathroom",
  "size": "size info",
  "keywords": ["additional", "search", "terms"],
  "intent": "browse|specific_product|comparison|recommendation"
}

ONLY return valid JSON, no explanation.`
      },
      { role: 'user', content: query }
    ],
    max_tokens: 200,
    temperature: 0,
  });

  const text = completion.choices[0]?.message?.content || '{}';
  return JSON.parse(text);
}

/**
 * Rule-based query parsing (no AI required)
 */
function parseQueryRuleBased(query) {
  const lower = query.toLowerCase().trim();
  const result = { keywords: [], intent: 'browse' };

  // Extract category
  for (const [category, synonyms] of Object.entries(SYNONYMS)) {
    if (synonyms.some(s => lower.includes(s)) || lower.includes(category)) {
      result.category = category.replace(/\s+/g, '_');
      break;
    }
  }

  // Extract color
  for (const [color, synonyms] of Object.entries(COLOR_MAP)) {
    if (synonyms.some(s => lower.includes(s))) {
      result.color = color;
      break;
    }
  }

  // Extract price range
  const underMatch = lower.match(/under\s*₹?\s*(\d+)/);
  const belowMatch = lower.match(/below\s*₹?\s*(\d+)/);
  const maxMatch = lower.match(/less\s*than\s*₹?\s*(\d+)/);
  const aboveMatch = lower.match(/above\s*₹?\s*(\d+)/);
  const overMatch = lower.match(/over\s*₹?\s*(\d+)/);
  const rangeMatch = lower.match(/₹?\s*(\d+)\s*[-–to]+\s*₹?\s*(\d+)/);
  const budgetMatch = lower.match(/budget\s*₹?\s*(\d+)/);

  if (rangeMatch) {
    result.minPrice = parseInt(rangeMatch[1]);
    result.maxPrice = parseInt(rangeMatch[2]);
  } else if (underMatch) {
    result.maxPrice = parseInt(underMatch[1]);
  } else if (belowMatch) {
    result.maxPrice = parseInt(belowMatch[1]);
  } else if (maxMatch) {
    result.maxPrice = parseInt(maxMatch[1]);
  } else if (aboveMatch) {
    result.minPrice = parseInt(aboveMatch[1]);
  } else if (overMatch) {
    result.minPrice = parseInt(overMatch[1]);
  } else if (budgetMatch) {
    result.maxPrice = parseInt(budgetMatch[1]);
  }

  // Extract pattern
  const patterns = ['floral', 'geometric', 'stripe', 'striped', 'plain', 'textured', 'printed', 'embroidered'];
  for (const p of patterns) {
    if (lower.includes(p)) {
      result.pattern = p.replace('striped', 'stripe');
      break;
    }
  }

  // Extract material
  const materials = ['cotton', 'polyester', 'silk', 'satin', 'velvet', 'linen', 'microfiber', 'sheer', 'blackout'];
  for (const m of materials) {
    if (lower.includes(m)) {
      result.material = m;
      break;
    }
  }

  // Extract room
  const rooms = { 'bedroom': 'bedroom', 'living': 'living_room', 'kitchen': 'kitchen', 'entrance': 'entrance', 'bathroom': 'bathroom' };
  for (const [key, value] of Object.entries(rooms)) {
    if (lower.includes(key)) {
      result.room = value;
      break;
    }
  }

  // Cheap/expensive/luxury intent
  if (lower.includes('cheap') || lower.includes('affordable') || lower.includes('budget')) {
    result.maxPrice = result.maxPrice || 1000;
    result.intent = 'browse';
  }
  if (lower.includes('luxury') || lower.includes('premium') || lower.includes('expensive')) {
    result.minPrice = result.minPrice || 2000;
    result.intent = 'browse';
  }

  // Remaining words as keywords
  const stopWords = new Set(['a', 'an', 'the', 'for', 'in', 'on', 'with', 'and', 'or', 'i', 'want', 'need', 'show', 'me', 'find', 'get', 'looking', 'search', 'buy', 'under', 'below', 'above', 'over', 'less', 'than', 'cheap', 'affordable', 'budget', 'luxury', 'premium', 'expensive']);
  const words = lower.split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
  result.keywords = words.slice(0, 5);

  return result;
}

export { router as searchRoute };
