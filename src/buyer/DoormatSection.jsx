import React from "react";
import { useNavigate } from "react-router-dom";
import doormatProducts from "./doormatProducts";

export default function DoormatSection() {
  const navigate = useNavigate();

  return (
    <section style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <p style={styles.smallTitle}>JP FURNISHING HOUSE</p>
          <h1 style={styles.heading}>Doormats</h1>
          <p style={styles.subText}>
            Stylish doormats with premium fabric, elegant prints, and easy maintenance.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {doormatProducts.map((item) => (
          <div key={item.product_id} style={styles.card}>
            <div style={styles.imageWrap}>
              <img
                src={item.image}
                alt={item.model_name}
                style={styles.image}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>

            <div style={styles.cardBody}>
              <h2 style={styles.title}>{item.model_name}</h2>
              <p style={styles.price}>₹ {item.price}</p>

              <button
                style={styles.button}
                onClick={() =>
                  navigate(`/doormat/${item.product_id}`, { state: item })
                }
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f4efe9",
    padding: "50px 60px",
    fontFamily: "Arial, sans-serif",
  },
  topBar: {
    marginBottom: "40px",
  },
  smallTitle: {
    fontSize: "18px",
    color: "#a16b3a",
    fontWeight: "700",
    letterSpacing: "1px",
    marginBottom: "10px",
  },
  heading: {
    fontSize: "58px",
    margin: 0,
    color: "#2c1608",
    fontWeight: "800",
  },
  subText: {
    fontSize: "28px",
    color: "#6a5a4d",
    marginTop: "18px",
    maxWidth: "900px",
    lineHeight: 1.5,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },
  card: {
    background: "#fff",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  },
  imageWrap: {
    width: "100%",
    height: "320px",
    overflow: "hidden",
    background: "#f7f7f7",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardBody: {
    padding: "22px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "800",
    color: "#2c1608",
    marginBottom: "10px",
  },
  price: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#8b5e34",
    marginBottom: "18px",
  },
  button: {
    padding: "12px 22px",
    background: "#4b2511",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
  },
};