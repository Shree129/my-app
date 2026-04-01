/**
 * Client-Side Search Engine
 * Fuzzy search with NLP intent parsing and synonym expansion
 */

// ─── SYNONYM MAP ───
const CATEGORY_SYNONYMS = {
  curtain: ['curtains', 'drape', 'drapes', 'window', 'sheer', 'blackout', 'blind'],
  bedsheet: ['bedsheets', 'bed sheet', 'bed sheets', 'bedding', 'sheets', 'linen', 'bed cover'],
  sofa_cover: ['sofa cover', 'sofa covers', 'couch cover', 'slipcover', 'sofa protector'],
  pillow_cover: ['pillow cover', 'pillow covers', 'cushion cover', 'pillowcase', 'cushion'],
  doormat: ['doormats', 'door mat', 'floor mat', 'entrance mat', 'rug', 'foot mat'],
};

const COLOR_MAP = {
  red: ['red', 'maroon', 'crimson', 'scarlet', 'ruby', 'burgundy'],
  blue: ['blue', 'navy', 'azure', 'cobalt', 'teal', 'turquoise', 'indigo', 'royal blue'],
  green: ['green', 'olive', 'emerald', 'lime', 'sage', 'forest', 'mint'],
  brown: ['brown', 'chocolate', 'coffee', 'tan', 'mocha', 'walnut'],
  beige: ['beige', 'cream', 'ivory', 'off-white', 'champagne', 'sand', 'vanilla'],
  black: ['black', 'charcoal', 'ebony', 'jet', 'onyx'],
  white: ['white', 'snow', 'pearl', 'ivory white'],
  grey: ['grey', 'gray', 'silver', 'ash', 'slate', 'steel'],
  pink: ['pink', 'rose', 'blush', 'magenta', 'salmon', 'coral pink'],
  purple: ['purple', 'violet', 'lavender', 'plum', 'mauve', 'lilac'],
  yellow: ['yellow', 'gold', 'golden', 'mustard', 'amber', 'sunflower'],
  orange: ['orange', 'coral', 'peach', 'tangerine', 'apricot'],
  multicolor: ['multicolor', 'multi color', 'multi-color', 'colorful', 'rainbow', 'mixed'],
};

const PATTERN_MAP = {
  floral: ['floral', 'flower', 'flowers', 'botanical', 'rose pattern'],
  geometric: ['geometric', 'geometry', 'diamond', 'triangle', 'hexagon'],
  striped: ['striped', 'stripe', 'stripes', 'lines', 'lined'],
  plain: ['plain', 'solid', 'simple', 'minimal', 'minimalist'],
  textured: ['textured', 'texture', 'woven', 'embossed'],
  printed: ['printed', 'print', 'graphic', 'digital print'],
  embroidered: ['embroidered', 'embroidery', 'handwork'],
  checkered: ['checkered', 'checked', 'check', 'plaid'],
};

/**
 * Parse a natural language search query into structured filters
 */
export function parseSearchQuery(query) {
  const lower = query.toLowerCase().trim();
  const result = {
    text: query,
    category: null,
    color: null,
    pattern: null,
    minPrice: null,
    maxPrice: null,
    material: null,
    keywords: [],
  };

  // Extract category
  for (const [cat, syns] of Object.entries(CATEGORY_SYNONYMS)) {
    if (syns.some(s => lower.includes(s))) {
      result.category = cat;
      break;
    }
  }

  // Extract color
  for (const [color, syns] of Object.entries(COLOR_MAP)) {
    if (syns.some(s => lower.includes(s))) {
      result.color = color;
      break;
    }
  }

  // Extract pattern
  for (const [pattern, syns] of Object.entries(PATTERN_MAP)) {
    if (syns.some(s => lower.includes(s))) {
      result.pattern = pattern;
      break;
    }
  }

  // Extract price
  const pricePatterns = [
    { regex: /under\s*₹?\s*(\d+)/i, fn: (m) => ({ maxPrice: parseInt(m[1]) }) },
    { regex: /below\s*₹?\s*(\d+)/i, fn: (m) => ({ maxPrice: parseInt(m[1]) }) },
    { regex: /less\s*than\s*₹?\s*(\d+)/i, fn: (m) => ({ maxPrice: parseInt(m[1]) }) },
    { regex: /above\s*₹?\s*(\d+)/i, fn: (m) => ({ minPrice: parseInt(m[1]) }) },
    { regex: /over\s*₹?\s*(\d+)/i, fn: (m) => ({ minPrice: parseInt(m[1]) }) },
    { regex: /₹?\s*(\d+)\s*[-–to]+\s*₹?\s*(\d+)/i, fn: (m) => ({ minPrice: parseInt(m[1]), maxPrice: parseInt(m[2]) }) },
    { regex: /budget\s*₹?\s*(\d+)/i, fn: (m) => ({ maxPrice: parseInt(m[1]) }) },
  ];

  for (const { regex, fn } of pricePatterns) {
    const match = lower.match(regex);
    if (match) {
      Object.assign(result, fn(match));
      break;
    }
  }

  // Budget keywords
  if (/\b(cheap|affordable|budget|economical)\b/i.test(lower)) {
    result.maxPrice = result.maxPrice || 1000;
  }
  if (/\b(luxury|premium|expensive|high.?end)\b/i.test(lower)) {
    result.minPrice = result.minPrice || 2000;
  }

  // Extract material
  const materials = ['cotton', 'polyester', 'silk', 'satin', 'velvet', 'linen', 'microfiber', 'sheer', 'blackout', 'jacquard'];
  for (const m of materials) {
    if (lower.includes(m)) {
      result.material = m;
      break;
    }
  }

  return result;
}

/**
 * Search products using parsed filters
 * Uses Levenshtein-inspired fuzzy matching
 */
export function searchProducts(catalog, query) {
  if (!query.trim()) return [];

  const parsed = parseSearchQuery(query);
  let results = [...catalog];

  // Apply hard filters
  if (parsed.category) {
    results = results.filter(p => p.category === parsed.category);
  }

  if (parsed.minPrice) {
    results = results.filter(p => {
      const price = p.final_price || p.price || p.price_7ft || 0;
      return price >= parsed.minPrice;
    });
  }

  if (parsed.maxPrice) {
    results = results.filter(p => {
      const price = p.final_price || p.price || p.price_7ft || 0;
      return price > 0 && price <= parsed.maxPrice;
    });
  }

  // Score remaining results
  results = results.map(product => {
    let score = 0;

    // Color match (+30)
    if (parsed.color) {
      const productColor = (product.color || '').toLowerCase();
      const productFamily = (product.color_family || '').toLowerCase();
      if (productColor === parsed.color || productFamily.includes(parsed.color)) {
        score += 30;
      } else if (productColor.includes(parsed.color) || parsed.color.includes(productColor)) {
        score += 15;
      }
    }

    // Pattern match (+20)
    if (parsed.pattern) {
      const productPattern = (product.pattern || '').toLowerCase();
      if (productPattern === parsed.pattern || productPattern.includes(parsed.pattern)) {
        score += 20;
      }
    }

    // Material match (+15)
    if (parsed.material) {
      const productMaterial = (product.material || product.fabric_type || '').toLowerCase();
      if (productMaterial.includes(parsed.material)) {
        score += 15;
      }
    }

    // Text fuzzy match on model_name (+10)
    const name = (product.model_name || '').toLowerCase();
    const queryWords = query.toLowerCase().split(/\s+/);
    for (const word of queryWords) {
      if (word.length > 2 && name.includes(word)) {
        score += 10;
      }
    }

    // Category bonus for category match (+5)
    if (parsed.category && product.category === parsed.category) {
      score += 5;
    }

    return { ...product, _searchScore: score };
  });

  // Sort by score descending
  results.sort((a, b) => b._searchScore - a._searchScore);

  return results;
}

/**
 * Generate autocomplete suggestions
 */
export function getAutocompleteSuggestions(query, catalog) {
  if (!query || query.length < 2) return [];

  const lower = query.toLowerCase();
  const suggestions = new Set();

  // Category suggestions
  for (const [cat, syns] of Object.entries(CATEGORY_SYNONYMS)) {
    if (cat.includes(lower) || syns.some(s => s.includes(lower))) {
      suggestions.add(cat.replace(/_/g, ' '));
    }
  }

  // Color + category combos
  for (const [color] of Object.entries(COLOR_MAP)) {
    if (color.includes(lower)) {
      suggestions.add(`${color} curtains`);
      suggestions.add(`${color} bedsheets`);
    }
  }

  // Product name matches
  catalog.forEach(p => {
    const name = (p.model_name || '').toLowerCase();
    if (name.includes(lower)) {
      suggestions.add(p.model_name);
    }
  });

  return Array.from(suggestions).slice(0, 8);
}

/**
 * Get trending/popular search terms
 */
export function getTrendingSearches() {
  return [
    'Blue curtains',
    'Cotton bedsheets',
    'Floral sofa covers',
    'Premium pillow covers',
    'Anti-slip doormats',
    'Sheer curtains',
    'King size bedsheets',
    'Velvet cushion covers',
  ];
}
