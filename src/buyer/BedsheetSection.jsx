import React from "react";
import { useNavigate } from "react-router-dom";
import bedsheetProducts from "./Bedsheet";

export default function BedsheetSection() {
  const navigate = useNavigate();

  return (
    <section style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <p style={styles.smallTitle}>JP Furnishing House</p>
          <h1 style={styles.heading}>Bedsheets</h1>
          <p style={styles.subText}>
            Premium cotton bedsheets with elegant patterns, soft fabric,
            and 2 pillow covers included for everyday comfort.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {bedsheetProducts.map((item) => (
          <div key={item.product_id} style={styles.card}>
            <div style={styles.imageWrap}>
              <img
                src={item.image}
                alt={item.model_name}
                style={styles.image}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>

            <div style={styles.content}>
              <h2 style={styles.id}>{item.product_id}</h2>

              <p style={styles.price}>
                ₹ {item.rate || item.price || item.MRP}
              </p>

              <div style={styles.buttonRow}>
                <button
                  style={styles.button}
                  onClick={() =>
                    navigate(`/bedsheets/${item.product_id}`)
                  }
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  page: {
    padding: "32px 20px 50px",
    background: "#f7f3ef",
    minHeight: "100vh",
  },

  topBar: {
    maxWidth: "1300px",
    margin: "0 auto 28px",
  },

  smallTitle: {
    margin: 0,
    color: "#8b5e3c",
    fontWeight: "700",
    letterSpacing: "1px",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  heading: {
    margin: "8px 0 10px",
    fontSize: "38px",
    color: "#2f1e14",
    fontWeight: "800",
  },

  subText: {
    margin: 0,
    color: "#6b5b52",
    fontSize: "16px",
    maxWidth: "760px",
    lineHeight: "1.7",
  },

  grid: {
    maxWidth: "1300px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "28px",
  },

  card: {
    background: "#fff",
    borderRadius: "26px",
    overflow: "hidden",
    boxShadow: "0 14px 35px rgba(46, 28, 18, 0.12)",
    border: "1px solid rgba(139, 94, 60, 0.10)",
  },

  imageWrap: {
    width: "100%",
    height: "380px",
    background: "#f3ede7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "18px",
  },

  content: {
    padding: "26px 28px 30px",
  },

  id: {
    fontSize: "42px",
    margin: "0 0 20px",
    color: "#2f1e14",
    fontWeight: "800",
  },

  price: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#8b5e3c",
    marginBottom: "16px",
  },

  buttonRow: {
    marginTop: "10px",
  },

  button: {
    background: "#2f1e14",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 28px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(47, 30, 20, 0.22)",
  },
};