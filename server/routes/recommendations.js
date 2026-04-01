/**
 * Recommendations Route — AI product recommendations
 * Content-based + collaborative filtering
 */

import { Router } from 'express';

const router = Router();

// In-memory store for user activity (production: use Redis/DB)
const userSessions = new Map();

/**
 * POST /api/recommendations/track
 * Track user activity for personalized recommendations
 */
router.post('/track', (req, res) => {
  const { userId, event, productId, category, metadata } = req.body;

  if (!userId || !event) {
    return res.status(400).json({ error: 'userId and event required' });
  }

  if (!userSessions.has(userId)) {
    userSessions.set(userId, { views: [], clicks: [], cart: [], purchases: [], wishlist: [] });
  }

  const session = userSessions.get(userId);
  const entry = { productId, category, timestamp: Date.now(), ...metadata };

  switch (event) {
    case 'view': session.views.push(entry); break;
    case 'click': session.clicks.push(entry); break;
    case 'add_to_cart': session.cart.push(entry); break;
    case 'purchase': session.purchases.push(entry); break;
    case 'wishlist': session.wishlist.push(entry); break;
  }

  // Keep only last 100 events per type to prevent memory bloat
  for (const key of Object.keys(session)) {
    if (session[key].length > 100) {
      session[key] = session[key].slice(-100);
    }
  }

  res.json({ success: true });
});

/**
 * POST /api/recommendations/get
 * Get personalized recommendations based on user activity
 */
router.post('/get', (req, res) => {
  const { userId, catalog, currentProductId, type = 'personalized' } = req.body;

  if (!catalog || !Array.isArray(catalog)) {
    return res.status(400).json({ error: 'catalog array required' });
  }

  const session = userSessions.get(userId) || { views: [], clicks: [], cart: [], purchases: [], wishlist: [] };

  let recommendations = [];

  switch (type) {
    case 'similar':
      recommendations = getSimilarProducts(currentProductId, catalog);
      break;
    case 'because_you_viewed':
      recommendations = getBecauseYouViewed(session, catalog);
      break;
    case 'also_bought':
      recommendations = getAlsoBought(session, catalog);
      break;
    case 'personalized':
    default:
      recommendations = getPersonalized(session, catalog);
  }

  res.json({ recommendations: recommendations.slice(0, 12) });
});

/**
 * Content-based: find similar products to the current one
 */
function getSimilarProducts(productId, catalog) {
  const current = catalog.find(p => p.product_id === productId);
  if (!current) return catalog.slice(0, 10);

  return catalog
    .filter(p => p.product_id !== productId)
    .map(p => ({
      ...p,
      _score: calculateSimilarity(current, p),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 12);
}

/**
 * "Because you viewed X" — find products similar to recently viewed
 */
function getBecauseYouViewed(session, catalog) {
  const recentViews = session.views.slice(-5);
  if (recentViews.length === 0) return getPopular(catalog);

  const viewedIds = new Set(recentViews.map(v => v.productId));
  const viewedProducts = catalog.filter(p => viewedIds.has(p.product_id));

  if (viewedProducts.length === 0) return getPopular(catalog);

  // Score all products by similarity to viewed ones
  return catalog
    .filter(p => !viewedIds.has(p.product_id))
    .map(p => {
      let totalScore = 0;
      for (const viewed of viewedProducts) {
        totalScore += calculateSimilarity(viewed, p);
      }
      return { ...p, _score: totalScore / viewedProducts.length };
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, 12);
}

/**
 * "Customers also bought" — collaborative signal from cart/purchase history
 */
function getAlsoBought(session, catalog) {
  const cartCategories = session.cart.map(c => c.category).filter(Boolean);
  const purchaseCategories = session.purchases.map(p => p.category).filter(Boolean);

  const relevantCategories = [...new Set([...cartCategories, ...purchaseCategories])];

  if (relevantCategories.length === 0) return getPopular(catalog);

  // Show products from complementary categories
  const complementary = {
    'curtain': ['pillow_cover', 'bedsheet'],
    'bedsheet': ['pillow_cover', 'curtain'],
    'sofa_cover': ['pillow_cover', 'doormat'],
    'pillow_cover': ['bedsheet', 'sofa_cover', 'curtain'],
    'doormat': ['sofa_cover', 'curtain'],
  };

  const targetCategories = new Set();
  for (const cat of relevantCategories) {
    const comps = complementary[cat] || [];
    comps.forEach(c => targetCategories.add(c));
  }

  return catalog
    .filter(p => targetCategories.has(p.category))
    .sort(() => Math.random() - 0.5) // Shuffle for variety
    .slice(0, 12);
}

/**
 * Personalized recommendations combining all signals
 */
function getPersonalized(session, catalog) {
  const allInteracted = new Set([
    ...session.views.map(v => v.productId),
    ...session.clicks.map(c => c.productId),
    ...session.cart.map(c => c.productId),
  ]);

  // Build user preference profile
  const categoryWeights = {};
  const colorWeights = {};

  // Views count less, cart/purchase count more
  for (const view of session.views) {
    if (view.category) categoryWeights[view.category] = (categoryWeights[view.category] || 0) + 1;
  }
  for (const cart of session.cart) {
    if (cart.category) categoryWeights[cart.category] = (categoryWeights[cart.category] || 0) + 3;
  }
  for (const purchase of session.purchases) {
    if (purchase.category) categoryWeights[purchase.category] = (categoryWeights[purchase.category] || 0) + 5;
  }

  if (Object.keys(categoryWeights).length === 0) {
    return getPopular(catalog);
  }

  // Score products based on user preference
  const scored = catalog
    .filter(p => !allInteracted.has(p.product_id))
    .map(p => {
      let score = 0;
      score += (categoryWeights[p.category] || 0) * 10;
      score += (colorWeights[p.color_family] || 0) * 5;
      // Recency boost — prefer items not yet seen
      score += Math.random() * 5; // Diversity injection
      return { ...p, _score: score };
    })
    .sort((a, b) => b._score - a._score);

  return scored.slice(0, 12);
}

/**
 * Fallback: popular/trending products
 */
function getPopular(catalog) {
  // Shuffle and pick diverse selection
  const shuffled = [...catalog].sort(() => Math.random() - 0.5);
  const categories = new Set();
  const result = [];

  for (const p of shuffled) {
    if (result.length >= 12) break;
    // Ensure category diversity
    if (categories.size < 4 || !categories.has(p.category) || result.length > 8) {
      result.push(p);
      categories.add(p.category);
    }
  }

  return result;
}

/**
 * Calculate similarity score between two products (0-100)
 */
function calculateSimilarity(a, b) {
  let score = 0;

  // Same category: +30
  if (a.category === b.category) score += 30;

  // Same color family: +25
  if (a.color_family && a.color_family === b.color_family) score += 25;

  // Same color: +15
  if (a.color && a.color === b.color) score += 15;

  // Same pattern: +15
  if (a.pattern && a.pattern === b.pattern) score += 15;

  // Price proximity: +15 (within 30% range)
  const priceA = a.final_price || a.price || 0;
  const priceB = b.final_price || b.price || 0;
  if (priceA > 0 && priceB > 0) {
    const ratio = Math.min(priceA, priceB) / Math.max(priceA, priceB);
    score += ratio * 15;
  }

  return score;
}

export { router as recommendationsRoute };
