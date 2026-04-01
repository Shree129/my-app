/**
 * Recommendation Engine (Client-Side)
 * Content-based + collaborative filtering for product recommendations
 */

const API_BASE = '';

/**
 * Normalize category names across old/new data
 */
function normalizeCategory(category) {
  const c = String(category || '').trim().toLowerCase();

  if (['pillow_cover', 'pillow-cover', 'cushion cover', 'cushion_cover', 'cushion-cover'].includes(c)) {
    return 'cushion-cover';
  }

  if (['sofa_cover', 'sofa-cover', 'sofa cover'].includes(c)) {
    return 'sofa';
  }

  if (['bedsheet', 'bed_sheet', 'bed-sheet'].includes(c)) {
    return 'bedsheet';
  }

  if (['curtain', 'curtains'].includes(c)) {
    return 'curtain';
  }

  if (['doormat', 'door_mat', 'door-mat', 'door mat'].includes(c)) {
    return 'doormat';
  }

  return c;
}

/**
 * Only keep products that have at least some usable image path
 */
function hasUsableImage(product) {
  const img = String(product?.image || '').trim();
  return img.startsWith('http://') || img.startsWith('https://') || img.startsWith('/');
}

/**
 * Normalize catalog objects before any recommendation logic
 */
function normalizeCatalog(catalog = []) {
  return catalog.map((p) => ({
    ...p,
    category: normalizeCategory(p.category),
    final_price:
      p.final_price ??
      p.price ??
      p.rate ??
      p.mrp ??
      p.MRP ??
      0,
  }));
}

/**
 * Get personalized recommendations from server
 */
export async function fetchRecommendations(userId, catalog, type = 'personalized', currentProductId = null) {
  try {
    const normalizedCatalog = normalizeCatalog(catalog);

    const res = await fetch(`${API_BASE}/api/recommendations/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        catalog: normalizedCatalog.map((p) => ({
          product_id: p.product_id,
          category: p.category,
          model_name: p.model_name,
          image: p.image,
          color: p.color,
          color_family: p.color_family,
          pattern: p.pattern,
          final_price: p.final_price,
        })),
        type,
        currentProductId,
      }),
    });

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();

    return (data.recommendations || [])
      .map((p) => ({
        ...p,
        category: normalizeCategory(p.category),
        final_price:
          p.final_price ??
          p.price ??
          p.rate ??
          p.mrp ??
          p.MRP ??
          0,
      }))
      .filter(hasUsableImage);
  } catch (error) {
    return getClientRecommendations(catalog, type, currentProductId);
  }
}

/**
 * Pure client-side recommendation fallback
 */
export function getClientRecommendations(catalog, type = 'personalized', currentProductId = null) {
  const normalizedCatalog = normalizeCatalog(catalog);
  if (!normalizedCatalog || normalizedCatalog.length === 0) return [];

  switch (type) {
    case 'similar':
      return getSimilar(normalizedCatalog, currentProductId);
    case 'because_you_viewed':
      return getBecauseViewed(normalizedCatalog);
    case 'also_bought':
      return getAlsoBought(normalizedCatalog);
    case 'trending':
      return getTrending(normalizedCatalog);
    default:
      return getPersonalized(normalizedCatalog);
  }
}

/**
 * Similar products to a given product
 */
function getSimilar(catalog, productId) {
  const current = catalog.find((p) => p.product_id === productId);
  if (!current) return shuffled(catalog).filter(hasUsableImage).slice(0, 10);

  return catalog
    .filter((p) => p.product_id !== productId)
    .filter(hasUsableImage)
    .map((p) => ({ ...p, _score: similarity(current, p) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 10);
}

/**
 * Based on localStorage browsing history
 */
function getBecauseViewed(catalog) {
  try {
    const stored = JSON.parse(localStorage.getItem('jp_user_activity') || '{}');
    const views = stored.views || [];
    if (views.length === 0) return getTrending(catalog);

    const viewedCategories = views
      .slice(-5)
      .map((v) => normalizeCategory(v.category))
      .filter(Boolean);

    const viewedIds = new Set(views.map((v) => v.productId));

    return catalog
      .filter((p) => !viewedIds.has(p.product_id))
      .filter(hasUsableImage)
      .map((p) => {
        let score = 0;
        if (viewedCategories.includes(normalizeCategory(p.category))) score += 20;
        score += Math.random() * 10;
        return { ...p, _score: score };
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);
  } catch {
    return getTrending(catalog);
  }
}

/**
 * Complementary product recommendations
 */
function getAlsoBought(catalog) {
  const complementary = {
    curtain: ['cushion-cover', 'bedsheet'],
    bedsheet: ['cushion-cover', 'curtain'],
    sofa: ['cushion-cover', 'doormat'],
    'cushion-cover': ['bedsheet', 'curtain', 'sofa'],
    doormat: ['sofa', 'curtain'],
  };

  try {
    const stored = JSON.parse(localStorage.getItem('jp_user_activity') || '{}');
    const cartItems = stored.cart || [];

    if (cartItems.length === 0) return getTrending(catalog);

    const targetCategories = new Set();

    cartItems.forEach((item) => {
      const normalized = normalizeCategory(item.category);
      const comps = complementary[normalized] || [];
      comps.forEach((c) => targetCategories.add(c));
    });

    return shuffled(
      catalog
        .filter((p) => targetCategories.has(normalizeCategory(p.category)))
        .filter(hasUsableImage)
    ).slice(0, 10);
  } catch {
    return getTrending(catalog);
  }
}

/**
 * Personalized mix of signals
 */
function getPersonalized(catalog) {
  try {
    const stored = JSON.parse(localStorage.getItem('jp_user_activity') || '{}');
    const views = stored.views || [];
    const cart = stored.cart || [];

    if (views.length === 0 && cart.length === 0) return getTrending(catalog);

    const catWeights = {};

    views.forEach((v) => {
      const cat = normalizeCategory(v.category);
      if (cat) catWeights[cat] = (catWeights[cat] || 0) + 1;
    });

    cart.forEach((c) => {
      const cat = normalizeCategory(c.category);
      if (cat) catWeights[cat] = (catWeights[cat] || 0) + 3;
    });

    const viewedIds = new Set(views.map((v) => v.productId));

    return catalog
      .filter((p) => !viewedIds.has(p.product_id))
      .filter(hasUsableImage)
      .map((p) => ({
        ...p,
        _score: (catWeights[normalizeCategory(p.category)] || 0) * 10 + Math.random() * 8,
      }))
      .sort((a, b) => b._score - a._score)
      .slice(0, 10);
  } catch {
    return getTrending(catalog);
  }
}

/**
 * Trending / popular picks (diverse selection)
 */
function getTrending(catalog) {
  const catCount = {};
  const result = [];
  const shuffledList = shuffled(catalog).filter(hasUsableImage);

  for (const p of shuffledList) {
    if (result.length >= 10) break;

    const cat = normalizeCategory(p.category) || 'other';
    catCount[cat] = (catCount[cat] || 0) + 1;

    if (catCount[cat] <= 3) {
      result.push({
        ...p,
        category: cat,
      });
    }
  }

  return result;
}

/**
 * Similarity score between two products (0-100)
 */
function similarity(a, b) {
  let score = 0;

  if (normalizeCategory(a.category) === normalizeCategory(b.category)) score += 30;
  if (a.color_family && a.color_family === b.color_family) score += 25;
  if (a.color && a.color === b.color) score += 15;
  if (a.pattern && b.pattern && a.pattern === b.pattern) score += 15;

  const pA = a.final_price ?? a.price ?? a.rate ?? 0;
  const pB = b.final_price ?? b.price ?? b.rate ?? 0;

  if (pA > 0 && pB > 0) {
    score += (Math.min(pA, pB) / Math.max(pA, pB)) * 15;
  }

  return score;
}

/**
 * Fisher-Yates shuffle
 */
function shuffled(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}