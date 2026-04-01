import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function BuyerDashboardSection() {
  const navigate = useNavigate();

  return (
    <section style={styles.section}>
      <div style={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          style={styles.content}
        >
          <p style={styles.subHeading}>BUYER AREA</p>
          <h2 style={styles.heading}>Manage Your Orders, Wishlist & Profile</h2>
          <p style={styles.description}>
            Access your personal buyer dashboard to view placed orders, saved
            products, cart details, profile information, and latest updates for
            your furnishing selections.
          </p>

          <div style={styles.cardGrid}>
            <div style={styles.card}>
              <div style={styles.icon}>🛒</div>
              <h3 style={styles.cardTitle}>My Cart</h3>
              <p style={styles.cardText}>
                Review selected products and proceed to checkout easily.
              </p>
            </div>

            <div style={styles.card}>
              <div style={styles.icon}>📦</div>
              <h3 style={styles.cardTitle}>My Orders</h3>
              <p style={styles.cardText}>
                Track placed orders and stay updated on delivery progress.
              </p>
            </div>

            <div style={styles.card}>
              <div style={styles.icon}>❤️</div>
              <h3 style={styles.cardTitle}>Wishlist</h3>
              <p style={styles.cardText}>
                Save your favorite products and revisit them anytime.
              </p>
            </div>

            <div style={styles.card}>
              <div style={styles.icon}>👤</div>
              <h3 style={styles.cardTitle}>Profile</h3>
              <p style={styles.cardText}>
                Manage your buyer information and preferences in one place.
              </p>
            </div>
          </div>

          <div style={styles.buttonWrap}>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              style={styles.button}
              onClick={() => navigate("/buyer-dashboard")}
            >
              Go to Buyer Dashboard
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "80px 20px",
    background: "linear-gradient(180deg, #fffaf5 0%, #f8efe7 100%)",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
  },
  content: {
    textAlign: "center",
  },
  subHeading: {
    margin: "0 0 10px",
    color: "#9a6b47",
    letterSpacing: "3px",
    fontSize: "13px",
    fontWeight: "700",
  },
  heading: {
    margin: "0 0 16px",
    fontSize: "42px",
    color: "#3f2a1d",
    fontWeight: "800",
  },
  description: {
    maxWidth: "760px",
    margin: "0 auto 36px",
    fontSize: "17px",
    lineHeight: "1.8",
    color: "#6b5648",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "22px",
    marginTop: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "22px",
    padding: "28px 22px",
    boxShadow: "0 14px 34px rgba(80, 45, 22, 0.10)",
    border: "1px solid #f0dfd2",
  },
  icon: {
    fontSize: "34px",
    marginBottom: "14px",
  },
  cardTitle: {
    margin: "0 0 10px",
    fontSize: "22px",
    color: "#3d291d",
    fontWeight: "700",
  },
  cardText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#6b5648",
  },
  buttonWrap: {
    marginTop: "34px",
  },
  button: {
    background: "#6b3c1b",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(107, 60, 27, 0.22)",
  },
};