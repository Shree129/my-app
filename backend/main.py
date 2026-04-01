import os
import pickle
import threading
from io import BytesIO

import clip
import numpy as np
import requests
import torch
from fastapi import Body, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError

# ================= INIT =================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= MODEL =================
device = "cuda" if torch.cuda.is_available() else "cpu"
print("✅ Using device:", device)

model, preprocess = clip.load("ViT-B/32", device=device)

# ================= CACHE =================
CACHE_FILE = "catalog_cache.pkl"

# 🔥 CHANGE THIS AFTER DEPLOYMENT
BASE_URL = "http://127.0.0.1:5173"
# Example for Netlify:
# BASE_URL = "https://your-site.netlify.app"

# ================= STORAGE =================
catalog_products = []
product_embeddings = []
is_building = False
last_build_error = None


# ================= HELPERS =================
def normalize_vector(vec):
    norm = np.linalg.norm(vec)
    return vec if norm == 0 else vec / norm


def cosine_similarity(a, b):
    denom = np.linalg.norm(a) * np.linalg.norm(b)
    return 0.0 if denom == 0 else float(np.dot(a, b) / denom)


def save_cache():
    try:
        with open(CACHE_FILE, "wb") as f:
            pickle.dump(
                {
                    "catalog_products": catalog_products,
                    "product_embeddings": product_embeddings,
                },
                f,
            )
        print("✅ Cache saved")
    except Exception as e:
        print("❌ Cache save error:", e)


def load_cache():
    global catalog_products, product_embeddings

    if not os.path.exists(CACHE_FILE):
        return False

    try:
        with open(CACHE_FILE, "rb") as f:
            data = pickle.load(f)

        catalog_products = data.get("catalog_products", [])
        product_embeddings = data.get("product_embeddings", [])
        print("✅ Cache loaded:", len(product_embeddings))
        return len(product_embeddings) > 0

    except Exception as e:
        print("❌ Cache load error:", e)
        return False


def load_image_from_url(url):
    try:
        response = requests.get(url, timeout=10)

        if response.status_code != 200:
            return None

        if "image" not in response.headers.get("Content-Type", "").lower():
            return None

        return Image.open(BytesIO(response.content)).convert("RGB")

    except Exception:
        return None


def get_embedding(image_input, is_bytes=False, is_url=False):
    try:
        if is_bytes:
            image = Image.open(BytesIO(image_input)).convert("RGB")
        elif is_url:
            image = load_image_from_url(image_input)
        else:
            image = Image.open(image_input).convert("RGB")

        if image is None:
            return None

        image_tensor = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            emb = model.encode_image(image_tensor)

        emb = emb.cpu().numpy().flatten().astype(np.float32)
        return normalize_vector(emb)

    except Exception:
        return None


# ================= BUILD =================
def build_catalog_embeddings(products):
    global catalog_products, product_embeddings, is_building

    if is_building:
        return

    is_building = True

    temp_catalog = []
    temp_embeddings = []

    print("⏳ Building embeddings...")

    for p in products:
        img_url = p.get("image")
        if not img_url:
            continue

        emb = get_embedding(img_url, is_url=True)

        if emb is not None:
            clean = {
                "product_id": p.get("product_id"),
                "model_name": p.get("model_name"),
                "image": p.get("image"),
                "category": p.get("category"),
                "final_price": p.get("final_price"),
            }

            temp_catalog.append(clean)
            temp_embeddings.append({"product": clean, "embedding": emb})

    catalog_products = temp_catalog
    product_embeddings = temp_embeddings

    print("✅ Embeddings:", len(product_embeddings))

    if product_embeddings:
        save_cache()

    is_building = False


def start_background_build(products):
    threading.Thread(target=build_catalog_embeddings, args=(products,), daemon=True).start()


# load cache on start
load_cache()


# ================= ROUTES =================
@app.get("/")
def home():
    return {
        "ready": len(product_embeddings) > 0,
        "count": len(product_embeddings),
    }


@app.get("/status")
def status():
    return {
        "ready": len(product_embeddings) > 0,
        "count": len(product_embeddings),
        "is_building": is_building,
    }


@app.post("/load-catalog")
async def load_catalog(products: list = Body(...)):
    if product_embeddings:
        return {"ready": True, "cached": True}

    if load_cache():
        return {"ready": True, "cached": True}

    if not is_building:
        start_background_build(products)

    return {"ready": False, "is_building": True}


# ================= 🔥 RECOMMEND (FIXED) =================
@app.post("/recommend")
async def recommend(file: UploadFile = File(...)):
    if not product_embeddings:
        return {"results": []}

    contents = await file.read()
    img_emb = get_embedding(contents, is_bytes=True)

    if img_emb is None:
        return {"results": []}

    results = []

    for item in product_embeddings:
        sim = cosine_similarity(img_emb, item["embedding"])
        p = item["product"]

        # ================= 🔥 IMAGE FIX =================
        img = p.get("image")

        # fix broken like "htt"
        if img and not img.startswith("http"):
            img = None

        # fix relative path
        if img and img.startswith("/"):
            img = BASE_URL + img

        # final fallback
        if not img:
            img = "https://via.placeholder.com/300"

        img = img.strip()
        # ================= END FIX =================

        results.append(
            {
                "product_id": p.get("product_id"),
                "model_name": p.get("model_name"),
                "image": img,
                "category": p.get("category"),
                "final_price": p.get("final_price"),
                "score": float(sim),
            }
        )

    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "results": results[:10],
    }