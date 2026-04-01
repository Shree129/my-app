import React from "react";
import { motion } from "framer-motion";

function Gallery() {
  const images = [
    {
      src: "/image copy 2.png",
      title: "Our Shop",
    },
    {
      src: "/image copy 3.png",
      title: "Luxury Bedroom Styling",
    },
    {
      src: "/image copy 4.png",
      title: "Comfortable Mattress",
    },
    {
      src: "/image copy 5.png",
      title: "Soft Home Furnishing Look",
    },
    {
      src: "/image copy 6.png",
      title: "Modern Interior Drapes",
    },
    {
      src: "/image copy 7.png",
      title: "Classic  Styling",
    },
    {
      src: "/image copy 8.png",
      title: "Warm Bedroom Ambience",
    },
    {
      src: "/image copy 9.png",
      title: "Designer Sofa Cover Display",
    },
    {
      src: "/image copy 10.png",
      title: "Graceful Living Room Decor",
    },
    {
      src: "/image copy 11.png",
      title: "Minimal Home Styling",
    },
    {
      src: "/image copy 12.png",
      title: " Curtain Finish",
    },
    {
      src: "/image copy 13.png",
      title: "Modern Furnishing Inspiration",
    },
    {
      src: "/image copy 14.png",
      title: "Soft Fabric Elegance",
    },
    {
      src: "/image copy 15.png",
      title: "Stylish Interior Mood",
    },
    {
      src: "/image copy 16.png",
      title: "Luxury Home Comfort",
    },
  ];

  return (
    <div style={styles.page}>
      <motion.h1
        style={styles.heading}
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Gallery
      </motion.h1>

      <motion.p
        style={styles.subheading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Explore our elegant furnishing collection crafted to elevate every
        corner of your home.
      </motion.p>

      <div style={styles.grid}>
        {images.map((item, index) => (
          <motion.div
            key={index}
            style={styles.card}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div style={styles.imageWrapper}>
              <motion.img
                src={item.src}
                alt={item.title}
                style={styles.image}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
              />

              <div style={styles.overlay}>
                <p style={styles.caption}>{item.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: "1450px",
    margin: "0 auto",
    padding: "70px 30px",
    background: "#f8f5f0",
  },

  heading: {
    textAlign: "center",
    fontSize: "3rem",
    marginBottom: "14px",
    color: "#4b3427",
    fontWeight: "700",
    letterSpacing: "0.5px",
  },

  subheading: {
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#7a6253",
    maxWidth: "760px",
    margin: "0 auto 50px auto",
    lineHeight: 1.7,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "26px",
  },

  card: {
    borderRadius: "22px",
    overflow: "hidden",
    cursor: "pointer",
    background: "#fff",
    boxShadow: "0 12px 30px rgba(0,0,0,0.10)",
  },

  imageWrapper: {
    position: "relative",
    overflow: "hidden",
    height: "420px",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "22px 18px",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.18), rgba(0,0,0,0.02))",
  },

  caption: {
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: "600",
    margin: 0,
    lineHeight: 1.4,
  },
};

export default Gallery;