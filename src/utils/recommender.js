// ================= HELPERS =================

function normalizeCategory(category) {
  const c = String(category || "").trim().toLowerCase();

  if (
    [
      "pillow_cover",
      "pillow-cover",
      "cushion cover",
      "cushion_cover",
      "cushion-cover",
    ].includes(c)
  ) {
    return "cushion-cover";
  }

  if (["sofa_cover", "sofa-cover", "sofa cover"].includes(c)) {
    return "sofa";
  }

  if (["bedsheet", "bed_sheet", "bed-sheet"].includes(c)) {
    return "bedsheet";
  }

  if (["curtain", "curtains"].includes(c)) {
    return "curtain";
  }

  if (["doormat", "door_mat", "door-mat", "door mat"].includes(c)) {
    return "doormat";
  }

  return c;
}

function hasUsableImage(product) {
  const img = String(product?.image || "").trim();
  return (
    img.startsWith("http://") ||
    img.startsWith("https://") ||
    img.startsWith("/")
  );
}

function normalizeProduct(product) {
  return {
    ...product,
    category: normalizeCategory(product.category),
    final_price:
      product.final_price ??
      product.price ??
      product.rate ??
      product.mrp ??
      product.MRP ??
      0,
  };
}

function uniqueByProductId(products) {
  const seen = new Set();
  return products.filter((product) => {
    const id = String(product.product_id || "").trim();
    if (!id) return false;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

// ================= SCORE FUNCTION =================

function calculateScore(product, userInput) {
  let score = 0;

  if (
    userInput.color_family &&
    product.color_family === userInput.color_family
  ) {
    score += 40;
  }

  if (
    userInput.room_type &&
    Array.isArray(product.room_type) &&
    product.room_type.includes(userInput.room_type)
  ) {
    score += 20;
  }

  if (
    userInput.pattern &&
    product.pattern &&
    String(product.pattern)
      .toLowerCase()
      .includes(String(userInput.pattern).toLowerCase())
  ) {
    score += 20;
  }

  if (userInput.budget && product.final_price) {
    if (product.final_price <= userInput.budget) {
      score += 20;
    }
  }

  return score;
}

// ================= MAIN FUNCTION =================

export function recommendProducts(masterCatalog, userInput) {
  const normalizedCatalog = (masterCatalog || [])
    .map(normalizeProduct)
    .filter(hasUsableImage);

  return uniqueByProductId(
    normalizedCatalog
      .map((product) => ({
        ...product,
        score: calculateScore(product, userInput || {}),
      }))
      .sort((a, b) => b.score - a.score)
  ).slice(0, 10);
}