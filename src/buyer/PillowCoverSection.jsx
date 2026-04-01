import React from "react";
import { useNavigate } from "react-router-dom";
import pillowCovers from "./pillowCover";

export default function PillowCoverSection() {
  const navigate = useNavigate();

  const handleViewDetails = (item) => {
    navigate(`/pillow-cover/${item.product_id}`, {
      state: item,
    });
  };

  return (
    <section style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <p style={styles.smallTitle}>JP FURNISHING HOUSE</p>
          <h1 style={styles.heading}>Cushion Covers</h1>
          <p style={styles.subText}>
            Premium cushion covers with elegant prints, soft fabric, and modern
            designs.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {pillowCovers.map((item) => {
          const price =
            item.price ||
            item.rate ||
            item.mrp ||
            item.selling_price ||
            item.price_1 ||
            "";

          return (
            <div key={item.product_id} style={styles.card}>
              <div style={styles.imageWrap}>
                <img
                  src={item.image}
                  alt={item.model_name || `cushion ${item.product_id}`}
                  style={styles.image}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80";
                  }}
                />
              </div>

              <div style={styles.cardBody}>
                <h3 style={styles.productId}>
                  {String(item.product_id).padStart(2, "0")}
                </h3>

                <p style={styles.price}>
                  {price ? `₹ ${price}` : "₹"}
                </p>

                <button
                  style={styles.button}
                  onClick={() => handleViewDetails(item)}
                >
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f1ed",
    padding: "40px 64px 60px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  topBar: {
    marginBottom: "34px",
  },
  smallTitle: {
    fontSize: "15px",
    fontWeight: 700,
    letterSpacing: "0.6px",
    color: "#b56a2d",
    marginBottom: "18px",
    textTransform: "uppercase",
  },
  heading: {
    fontSize: "64px",
    fontWeight: 800,
    color: "#2b1205",
    margin: "0 0 18px 0",
    lineHeight: 1.05,
  },
  subText: {
    fontSize: "18px",
    color: "#7a685d",
    margin: 0,
    maxWidth: "760px",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "28px",
    marginTop: "30px",
  },
  card: {
    background: "#fff",
    borderRadius: "28px",
    padding: "20px",
    boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
    border: "1px solid rgba(90,50,20,0.08)",
  },
  imageWrap: {
    width: "100%",
    height: "265px",
    overflow: "hidden",
    borderRadius: "22px",
    background: "#f3f3f3",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  cardBody: {
    padding: "18px 4px 4px",
  },
  productId: {
    fontSize: "52px",
    fontWeight: 800,
    color: "#17365d",
    margin: "0 0 8px 0",
    lineHeight: 1,
  },
  price: {
    fontSize: "30px",
    fontWeight: 700,
    color: "#9b5c1f",
    margin: "0 0 20px 0",
  },
  button: {
    background: "#5e2d0f",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "12px 22px",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
  },
};