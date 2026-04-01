import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import curtainProducts from "./curtainData";

export default function CurtainSection() {
  const navigate = useNavigate();

  return (
    <section style={styles.section}>
      <div style={styles.top}>
        <p style={styles.subheading}>CURTAIN COLLECTION</p>
        <h2 style={styles.heading}>Premium Curtains</h2>
        <p style={styles.desc}>
          Elegant made-to-order curtain designs from your product collection
        </p>
      </div>

      <div style={styles.grid}>
        {curtainProducts.map((item, index) => (
          <motion.div
            key={item.product_id}
            style={styles.card}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true }}
          >
            <div style={styles.imageWrap}>
              <img
                src={item.image}
                alt={item.fabric_color}
                style={styles.image}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1000&q=80";
                }}
              />
            </div>

            <div style={styles.content}>
              <h3 style={styles.title}>{item.product_id}</h3>
              <p style={styles.text}>
                <strong>Fabric Color:</strong> {item.fabric_color}
              </p>
              <p style={styles.text}>
                <strong>Price 7ft:</strong> {item.price_7ft}
              </p>
              <p style={styles.text}>
                <strong>Price 9ft:</strong> {item.price_9ft}
              </p>

              <button
                style={styles.button}
                onClick={() => navigate(`/curtain/${item.product_id}`)}
              >
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "70px 40px",
    background: "#f7f4f1",
    minHeight: "100vh",
  },
  top: {
    textAlign: "center",
    marginBottom: "50px",
  },
  subheading: {
    letterSpacing: "4px",
    color: "#b07d62",
    fontSize: "14px",
    marginBottom: "14px",
  },
  heading: {
    fontSize: "60px",
    fontWeight: "800",
    color: "#2f211c",
    margin: "0 0 18px",
  },
  desc: {
    fontSize: "18px",
    color: "#7a6355",
    margin: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "#fff",
    borderRadius: "26px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    transition: "0.3s",
  },
  imageWrap: {
    width: "100%",
    height: "360px",
    overflow: "hidden",
    background: "#eee",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  content: {
    padding: "22px",
  },
  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#2f211c",
    marginBottom: "12px",
  },
  text: {
    fontSize: "16px",
    color: "#5b4b42",
    margin: "8px 0",
  },
  button: {
    marginTop: "16px",
    padding: "12px 22px",
    border: "none",
    borderRadius: "12px",
    background: "#2f211c",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
};