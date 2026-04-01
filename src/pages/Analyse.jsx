import React, { useState, useEffect, useRef, useCallback } from "react";
import masterCatalog from "../buyer/masterCatalog";
import SEOHead from "../components/SEO/SEOHead";

export default function Analyse() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catalogReady, setCatalogReady] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Preparing AI catalog...");
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const CLIP_API = import.meta.env.VITE_CLIP_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    initCatalog();
  }, []);

  useEffect(() => {
    let timer;

    if (!catalogReady) {
      timer = setInterval(async () => {
        try {
          const res = await fetch(`${CLIP_API}/status`);
          const data = await res.json();

          if (data.ready) {
            setCatalogReady(true);
            setStatusMessage(`AI ready • ${data.count} products indexed`);
            clearInterval(timer);
          } else if (data.is_building) {
            setStatusMessage("Preparing AI catalog... embeddings are building in background");
          } else {
            setStatusMessage("Preparing AI catalog...");
          }
        } catch (err) {
          console.error("❌ Status check failed:", err);
          setStatusMessage("Could not connect to AI backend");
        }
      }, 3000);
    }

    return () => clearInterval(timer);
  }, [catalogReady, CLIP_API]);

  const initCatalog = async () => {
    try {
      const statusRes = await fetch(`${CLIP_API}/status`);
      const statusData = await statusRes.json();

      if (statusData.ready) {
        setCatalogReady(true);
        setStatusMessage(`AI ready • ${statusData.count} products indexed`);
        return;
      }

      const updatedCatalog = masterCatalog
        .filter((p) => p && p.product_id && p.image)
        .map((p) => ({
          product_id: p.product_id,
          model_name: p.model_name,
          image: p.image,
          category: p.category,
          final_price:
            p.final_price ??
            p.price ??
            p.price_7ft ??
            p.price_9ft ??
            p.mrp ??
            0,
        }));

      const res = await fetch(`${CLIP_API}/load-catalog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCatalog),
      });

      const data = await res.json();
      console.log("✅ Catalog init response:", data);

      if (data.ready) {
        setCatalogReady(true);
        setStatusMessage(`AI ready • ${data.valid_products} products indexed`);
      } else if (data.is_building) {
        setCatalogReady(false);
        setStatusMessage("Preparing AI catalog... embeddings are building in background");
      } else {
        setCatalogReady(false);
        setStatusMessage("Preparing AI catalog...");
      }
    } catch (err) {
      console.error("❌ Catalog init error:", err);
      setCatalogReady(false);
      setStatusMessage("Could not connect to AI backend");
    }
  };

  const processImage = useCallback(
    async (file) => {
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);

      if (!catalogReady) {
        alert("AI catalog is not ready yet. Please wait a moment and try again.");
        return;
      }

      setLoading(true);
      setResults([]);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`${CLIP_API}/recommend`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        console.log("✅ Recommend response:", data);

        if (Array.isArray(data?.results) && data.results.length > 0) {
          setResults(data.results);
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error("❌ Upload error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [CLIP_API, catalogReady]
  );

  const handleChooseFileClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleCameraClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    processImage(file);
  };

  const handleCameraSelect = (e) => {
    const file = e.target.files?.[0];
    processImage(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const resetSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPreviewImage(null);
    setResults([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <>
      <SEOHead
        title="AI Visual Search — Find Similar Products"
        description="Upload an image and let our AI find visually similar furnishing products using CLIP embeddings."
        keywords="visual search, AI, CLIP embeddings, image similarity, furniture finder"
      />

      <div style={S.page}>
        <section style={S.hero}>
          <div style={S.heroContent}>
            <span style={S.badge}>AI-Powered</span>
            <h1 style={S.heroTitle}>Visual Search with CLIP Embeddings</h1>
            <p style={S.heroSubtitle}>
              Upload any furnishing image and our AI will find the most visually similar products from our catalog.
            </p>
            <p style={S.heroStatus}>{statusMessage}</p>
          </div>
        </section>

        <div style={S.container}>
          <div
            style={{
              ...S.uploadZone,
              borderColor: isDragOver ? "#6b432c" : "#d4b896",
              background: isDragOver ? "#fdf8f3" : "#fff",
              transform: isDragOver ? "scale(1.01)" : "scale(1)",
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
            />

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleCameraSelect}
              style={{ display: "none" }}
            />

            {previewImage ? (
              <div style={S.previewContainer}>
                <img src={previewImage} alt="Uploaded" style={S.previewImg} />
                <button type="button" style={S.changeBtn} onClick={resetSearch}>
                  Change Image
                </button>
              </div>
            ) : (
              <div style={S.uploadContent}>
                <div style={S.uploadIcon}>📷</div>
                <h3 style={S.uploadTitle}>Upload a furnishing image</h3>
                <p style={S.uploadSubtext}>
                  Click a button below or drag and drop • JPG, PNG, WebP supported
                </p>

                <div style={S.uploadActions}>
                  <button type="button" style={S.uploadBtn} onClick={handleChooseFileClick}>
                    📁 Choose File
                  </button>

                  <button type="button" style={S.cameraBtn} onClick={handleCameraClick}>
                    📸 Camera
                  </button>
                </div>

                {!catalogReady && (
                  <p style={S.waitText}>
                    AI catalog is still loading. On the first run this can take time. Later it will load from cache.
                  </p>
                )}
              </div>
            )}
          </div>

          {loading && (
            <div style={S.loadingSection}>
              <div style={S.spinner}></div>
              <p style={S.loadingText}>Analyzing your image with CLIP...</p>
              <p style={S.loadingSubtext}>Finding visually similar products from our catalog</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <section style={S.resultsSection}>
              <div style={S.resultsHeader}>
                <h2 style={S.resultsTitle}>🎯 {results.length} Similar Products Found</h2>
                <p style={S.resultsSubtitle}>Ranked by visual similarity score</p>
              </div>

              <div style={S.resultsGrid}>
                {results.map((item, i) => (
                  <div key={`${item.product_id}-${i}`} style={S.card}>
                    <div
                      style={{
                        ...S.scoreBadge,
                        background:
                          item.score > 0.8
                            ? "linear-gradient(135deg, #22c55e, #16a34a)"
                            : item.score > 0.6
                            ? "linear-gradient(135deg, #f59e0b, #d97706)"
                            : "linear-gradient(135deg, #6b432c, #a07844)",
                      }}
                    >
                      {(item.score * 100).toFixed(0)}% match
                    </div>

                    <div style={S.imageWrap}>
                      <img
                        key={item.image}
                        src={item.image}
                        alt={item.model_name}
                        style={S.image}
                        referrerPolicy="no-referrer"
                        onLoad={() => console.log("✅ Loaded:", item.image)}
                        onError={(e) => {
                        console.log("❌ Failed:", item.image);
                        e.target.src = "https://via.placeholder.com/300";
                        }}
                        />
                    </div>

                    <div style={S.cardContent}>
                      <h3 style={S.cardTitle}>{item.model_name}</h3>
                      <p style={S.cardCategory}>{(item.category || "").replace(/_/g, " ")}</p>
                      {item.final_price ? (
                        <p style={S.price}>₹{item.final_price}</p>
                      ) : (
                        <p style={S.priceMuted}>Price on request</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {!loading && previewImage && results.length === 0 && (
            <div style={S.noResults}>
              <div style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</div>
              <h3 style={{ color: "#3f2b20", marginBottom: 8 }}>No similar products found</h3>
              <p style={{ color: "#78716c" }}>
                Try uploading a clearer furnishing image. Curtains, bedsheets, cushion covers, doormats, and sofas work best.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const S = {
  page: { background: "#f7f4ef", minHeight: "100vh" },
  hero: {
    background: "linear-gradient(135deg, #3f2b20, #6b432c, #8b6538)",
    padding: "60px 24px 50px",
    textAlign: "center",
  },
  heroContent: { maxWidth: 750, margin: "0 auto" },
  badge: {
    display: "inline-block",
    padding: "6px 18px",
    background: "rgba(207,163,44,0.2)",
    color: "#cfa32c",
    borderRadius: 20,
    fontSize: "0.82rem",
    fontWeight: 700,
    letterSpacing: "1px",
    marginBottom: 18,
    textTransform: "uppercase",
    border: "1px solid rgba(207,163,44,0.3)",
  },
  heroTitle: {
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
    color: "#fff",
    fontWeight: 800,
    marginBottom: 14,
    lineHeight: 1.15,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  heroSubtitle: {
    fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
    color: "rgba(255,255,255,0.78)",
    maxWidth: 580,
    margin: "0 auto",
    lineHeight: 1.7,
  },
  heroStatus: {
    marginTop: 14,
    color: "#f3e4d4",
    fontSize: "0.95rem",
    fontWeight: 600,
  },
  container: { maxWidth: 1100, margin: "0 auto", padding: "0 24px 80px" },
  uploadZone: {
    marginTop: -30,
    border: "2px dashed #d4b896",
    borderRadius: 24,
    padding: 0,
    textAlign: "center",
    transition: "all 0.3s ease",
    overflow: "hidden",
    background: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
  },
  uploadContent: { padding: "50px 32px" },
  uploadIcon: { fontSize: "3.5rem", marginBottom: 14 },
  uploadTitle: {
    fontSize: "1.3rem",
    color: "#3f2b20",
    marginBottom: 8,
    fontWeight: 700,
  },
  uploadSubtext: {
    color: "#78716c",
    fontSize: "0.92rem",
    marginBottom: 24,
  },
  uploadActions: {
    display: "flex",
    justifyContent: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  uploadBtn: {
    padding: "12px 28px",
    background: "linear-gradient(135deg, #6b432c, #a07844)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  cameraBtn: {
    padding: "12px 28px",
    background: "#fff",
    color: "#6b432c",
    border: "2px solid #6b432c",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "0.95rem",
    cursor: "pointer",
  },
  waitText: {
    marginTop: 16,
    color: "#8a6a4b",
    fontSize: "0.9rem",
    fontWeight: 500,
  },
  previewContainer: { position: "relative", padding: 0 },
  previewImg: {
    width: "100%",
    maxHeight: 400,
    objectFit: "contain",
    display: "block",
    background: "#faf9f7",
  },
  changeBtn: {
    position: "absolute",
    bottom: 16,
    right: 16,
    padding: "10px 20px",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: "0.88rem",
    fontWeight: 600,
    cursor: "pointer",
    backdropFilter: "blur(4px)",
  },
  loadingSection: { textAlign: "center", padding: "48px 24px" },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid #e8d5c0",
    borderTopColor: "#6b432c",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 20px",
  },
  loadingText: {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#3f2b20",
    marginBottom: 6,
  },
  loadingSubtext: {
    color: "#78716c",
    fontSize: "0.92rem",
  },
  resultsSection: { marginTop: 48 },
  resultsHeader: { marginBottom: 28 },
  resultsTitle: {
    fontSize: "clamp(1.4rem, 3vw, 2rem)",
    color: "#3f2b20",
    fontWeight: 700,
    marginBottom: 6,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  resultsSubtitle: { color: "#78716c", fontSize: "0.95rem" },
  resultsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 22,
  },
  card: {
    position: "relative",
    background: "#fff",
    borderRadius: 20,
    overflow: "hidden",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },
  scoreBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: "5px 12px",
    borderRadius: 20,
    color: "#fff",
    fontSize: "0.75rem",
    fontWeight: 700,
    zIndex: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  },
  imageWrap: {
    height: 210,
    overflow: "hidden",
    background: "#f5ece1",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardContent: { padding: "16px 18px 20px" },
  cardTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#292524",
    marginBottom: 6,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  cardCategory: {
    fontSize: "0.82rem",
    color: "#78716c",
    textTransform: "capitalize",
    marginBottom: 10,
  },
  price: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#6b432c",
    margin: 0,
  },
  priceMuted: {
    fontSize: "0.92rem",
    color: "#a8a29e",
    margin: 0,
  },
  noResults: {
    textAlign: "center",
    padding: "48px 24px",
    background: "#fff",
    borderRadius: 20,
    marginTop: 32,
    boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
  },
};