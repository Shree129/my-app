// ================= HELPERS =================

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  const cleaned = String(value).replace(/[₹,\s`]/g, "");
  const num = Number(cleaned);
  return Number.isNaN(num) ? null : num;
}

function toTagsArray(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

// ================= COLOR =================

function extractColor(text = "") {
  const lower = String(text).toLowerCase();

  if (lower.includes("multicolor")) return "Multicolor";
  if (lower.includes("beige")) return "Beige";
  if (lower.includes("brown")) return "Brown";
  if (lower.includes("blue")) return "Blue";
  if (lower.includes("grey") || lower.includes("gray")) return "Grey";
  if (lower.includes("green")) return "Green";
  if (lower.includes("red")) return "Red";
  if (lower.includes("purple")) return "Purple";
  if (lower.includes("pink")) return "Pink";
  if (lower.includes("white")) return "White";
  if (lower.includes("black")) return "Black";
  if (lower.includes("yellow")) return "Yellow";
  if (lower.includes("orange")) return "Orange";
  if (lower.includes("teal")) return "Teal";
  if (lower.includes("cream")) return "Cream";
  if (lower.includes("gold")) return "Gold";

  return "";
}

function getColorFamily(color = "") {
  const c = String(color).toLowerCase();

  if (["red", "orange", "yellow", "brown", "beige", "cream", "gold"].includes(c)) {
    return "warm";
  }

  if (["blue", "green", "purple", "teal"].includes(c)) {
    return "cool";
  }

  if (["white", "black", "grey", "gray"].includes(c)) {
    return "neutral";
  }

  return "mixed";
}

function extractPattern(text = "") {
  const lower = String(text).toLowerCase();

  if (lower.includes("floral")) return "Floral";
  if (lower.includes("geometric")) return "Geometric";
  if (lower.includes("stripe")) return "Striped";
  if (lower.includes("striped")) return "Striped";
  if (lower.includes("textured")) return "Textured";
  if (lower.includes("chevron")) return "Chevron";
  if (lower.includes("zigzag")) return "Zigzag";
  if (lower.includes("plain")) return "Plain";
  if (lower.includes("abstract")) return "Abstract";
  if (lower.includes("block print")) return "Block Print";
  if (lower.includes("botanical")) return "Botanical";
  if (lower.includes("leaf")) return "Leaf";
  if (lower.includes("quilted")) return "Quilted";
  if (lower.includes("honeycomb")) return "Honeycomb";
  if (lower.includes("hexagonal")) return "Hexagonal";
  if (lower.includes("medallion")) return "Medallion";
  if (lower.includes("crosshatch")) return "Crosshatch";
  if (lower.includes("plaid")) return "Plaid";
  if (lower.includes("solid")) return "Solid";

  return "";
}

// ================= DOORMAT =================

function normalizeDoormat(product) {
  const text = `
    ${product.description || ""}
    ${product.design_details || ""}
    ${product.material || ""}
    ${product.tags || ""}
  `;

  const color = extractColor(text);
  const pattern = extractPattern(text);

  return {
    product_id: product.product_id || "",
    category: "doormat",
    model_name: product.model_name || "",
    image: product.image || "",

    color,
    color_family: getColorFamily(color),
    pattern,

    material: product.material || "",
    size: product.size || "",

    price: toNumber(product.price),
    mrp: toNumber(product.mrp),

    room_type: ["entrance", "living_room"],

    tags: toTagsArray(product.tags || "doormat,entrance,home"),

    attributes: {
      water_resistant: product.water_resistant || "",
      stock_status: product.stock_status || "",
      design_details: product.design_details || "",
      quantity: product.quantity || 1,
    },

    raw_category_data: { ...product },
  };
}

// ================= CURTAIN =================

function parseRoomTypes(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((v) => v.trim().toLowerCase().replace(/\s+/g, "_"))
    .filter(Boolean);
}

function normalizeCurtain(product) {
  const text = `${product.description || ""} ${product.style || ""} ${product.fabric_color || ""}`;

  const color = product.fabric_color || extractColor(text);
  const pattern = extractPattern(text);

  return {
    product_id: product.product_id || "",
    category: "curtain",
    model_name: product.model_name || "",
    image: product.image || "",

    color,
    color_family: getColorFamily(color),
    pattern,

    material: product.material || "",
    style: product.style || "",
    height_option: product.height_option || "",

    price_7ft: toNumber(product.price_7ft),
    price_9ft: toNumber(product.price_9ft),

    room_type: parseRoomTypes(product.suitable_for),

    tags: toTagsArray(product.tags || "curtain,window"),

    raw_category_data: { ...product },
  };
}

// ================= BEDSHEET =================

function normalizeBedsheet(product) {
  const text = `${product.fabric_color || ""} ${product.pattern || ""} ${product.description || ""}`;

  const color = extractColor(text);

  return {
    product_id: product.product_id || "",
    category: "bedsheet",
    model_name: product.model_name || "",
    image: product.image || "",

    color,
    color_family: getColorFamily(color),
    pattern: product.pattern || extractPattern(text),

    material: product.material || "",
    size: product.size || "",

    price: toNumber(product.rate),
    mrp: toNumber(product.MRP),

    room_type: ["bedroom"],

    tags: toTagsArray(product.tags || "bedsheet,bedroom,linen"),

    attributes: {
      feature_1: product.feature_1 || "",
      feature_2: product.feature_2 || "",
      quantity: product.quantity || 1,
    },

    raw_category_data: { ...product },
  };
}

// ================= SOFA =================

function normalizeSofa(product) {
  const text = `${product.fabric_color || ""} ${product.fabric_pattern || ""}`;

  const color = extractColor(text);
  const pattern = extractPattern(text);

  return {
    product_id: product.product_id || "",
    category: "sofa",
    model_name: product.model_name || "",
    image: product.main_image || product.image || "",

    color,
    color_family: getColorFamily(color),
    pattern,

    style: product.style || "",
    material: product.frame_material || product.material || "",
    fabric_type: product.fabric_type || "",

    dimensions: {
      length_cm: product.length_cm || null,
      depth_cm: product.depth_cm || null,
      height_cm: product.height_cm || null,
    },

    price: toNumber(product.price),
    mrp: toNumber(product.mrp),
    contact_for_price: String(product.contact_for_price).toLowerCase() === "yes",

    room_type: ["living_room"],

    made_to_order: product.made_to_order === "Yes",
    customization_available: product.customization_available === "Yes",
    lead_time_days: product.lead_time_days || null,

    tags: toTagsArray(product.tags || "sofa,living room"),

    attributes: {
      foam_type: product.foam_type || "",
      leg_material: product.leg_material || "",
    },

    raw_category_data: { ...product },
  };
}

// ================= CUSHION COVER =================

function normalizePillowCover(product) {
  const text = `
    ${product.description || ""}
    ${product.color || ""}
    ${product.pattern || ""}
    ${product.material || ""}
  `;

  const color = product.color || extractColor(text);
  const pattern = product.pattern || extractPattern(text);

  return {
    product_id: product.product_id || "",
    category: "cushion-cover",
    model_name: product.model_name || "",
    image: product.image || "",

    color,
    color_family: getColorFamily(color),
    pattern,

    material: product.material || "",
    size: product.size || "",

    price: toNumber(product.rate),
    mrp: toNumber(product.MRP),

    room_type: ["living_room", "bedroom"],

    tags: toTagsArray(product.tags || "cushion cover,cushion,decor,soft furnishing"),

    attributes: {
      quantity: product.quantity || 1,
      set_size: product.size || "",
    },

    raw_category_data: { ...product },
  };
}

// ================= EXPORT =================

export {
  normalizeDoormat,
  normalizeCurtain,
  normalizeBedsheet,
  normalizeSofa,
  normalizePillowCover,
};