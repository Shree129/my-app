// src/pages/AboutJPFurnishing.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AboutJPFurnishing() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <section style={styles.heroSection}>
        <div style={styles.left}>
          <p style={styles.tag}>About Us</p>
          <h1 style={styles.heading}>About JP Furnishing</h1>
          <p style={styles.description}>
            At JP Furnishing, we bring together comfort, elegance, and everyday
            practicality through thoughtfully selected home furnishing
            collections. Our focus is on creating beautiful living spaces with
            quality curtains, bedsheets, sofa covers, and pillow covers that
            reflect warmth, style, and durability.
          </p>
          <p style={styles.description}>
            We believe a home should feel personal and inviting. That is why our
            collection is designed to balance aesthetics with functionality,
            helping customers create interiors that feel refined, cozy, and
            timeless.
          </p>

          <div style={styles.buttonRow}>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/products")}
            >
              Explore Products
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() => navigate("/team-dashboard")}
            >
              Team
            </button>
          </div>
        </div>

        <div style={styles.right}>
          <div style={styles.imageCard}>
            <img
              src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
              alt="JP Furnishing"
              style={styles.image}
            />
          </div>
        </div>
      </section>

      <section style={styles.valuesSection}>
        <div style={styles.valueCard}>
          <div style={styles.icon}>🏠</div>
          <h3 style={styles.cardTitle}>Elegant Living</h3>
          <p style={styles.cardText}>
            Furnishing collections curated to enhance bedrooms, living rooms,
            and modern home spaces.
          </p>
        </div>

        <div style={styles.valueCard}>
          <div style={styles.icon}>🧵</div>
          <h3 style={styles.cardTitle}>Quality Fabrics</h3>
          <p style={styles.cardText}>
            Carefully chosen materials that blend softness, durability, and
            long-lasting appeal.
          </p>
        </div>

        <div style={styles.valueCard}>
          <div style={styles.icon}>✨</div>
          <h3 style={styles.cardTitle}>Modern Style</h3>
          <p style={styles.cardText}>
            Designs made to suit contemporary tastes while keeping comfort at
            the center.
          </p>
        </div>

        <div style={styles.valueCard}>
          <div style={styles.icon}>🤝</div>
          <h3 style={styles.cardTitle}>Trusted Service</h3>
          <p style={styles.cardText}>
            A customer-first approach focused on satisfaction, support, and
            reliable shopping experience.
          </p>
        </div>
      </section>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8f4ef 0%, #f3ece5 100%)",
    padding: "50px 30px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  heroSection: {
    maxWidth: "1300px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "40px",
    alignItems: "center",
    background: "#fffaf6",
    borderRadius: "30px",
    padding: "50px",
    boxShadow: "0 18px 40px rgba(90, 60, 35, 0.10)",
    border: "1px solid #eee1d5",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  tag: {
    margin: 0,
    color: "#9c6b43",
    fontWeight: "700",
    fontSize: "13px",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
  },
  heading: {
    margin: "12px 0 20px",
    fontSize: "48px",
    color: "#3f2b1d",
    lineHeight: "1.15",
  },
  description: {
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#6e5647",
    marginBottom: "16px",
  },
  buttonRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
    marginTop: "14px",
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #5a3d2b, #8b5e3c)",
    color: "#fff",
    border: "none",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(90, 61, 43, 0.20)",
  },
  secondaryBtn: {
    background: "#fff",
    color: "#5a3d2b",
    border: "1px solid #d8c2b2",
    padding: "14px 24px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },
  right: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  imageCard: {
    width: "100%",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
  },
  image: {
    width: "100%",
    height: "480px",
    objectFit: "cover",
    display: "block",
  },
  valuesSection: {
    maxWidth: "1300px",
    margin: "32px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "22px",
  },
  valueCard: {
    background: "#fff",
    borderRadius: "22px",
    padding: "28px",
    border: "1px solid #ede0d5",
    boxShadow: "0 12px 28px rgba(90, 60, 35, 0.08)",
  },
  icon: {
    fontSize: "34px",
    marginBottom: "14px",
  },
  cardTitle: {
    margin: "0 0 10px",
    fontSize: "22px",
    color: "#3f2b1d",
  },
  cardText: {
    margin: 0,
    color: "#6f5a4d",
    lineHeight: "1.7",
    fontSize: "15px",
  },
};