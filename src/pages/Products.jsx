import React, { useRef } from "react";
import products from "../data/product";
import ProductCard from "../components/Common/ProductCard";
import "./Products.css";

function Products() {
  const scrollRef = useRef(null);

  const videos = [
    {
      id: 1,
      title: "Soft Sheer Curtains for Elegant Daylight",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      poster: "/image copy 2.png",
    },
    {
      id: 2,
      title: "Luxury Bedroom Styling with JP Curtains",
      video: "https://www.w3schools.com/html/movie.mp4",
      poster: "/image copy 3.png",
    },
    {
      id: 3,
      title: "Minimal Window Drapes for Modern Homes",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      poster: "/image copy 4.png",
    },
    {
      id: 4,
      title: "Premium Fabric Flow for Living Spaces",
      video: "https://www.w3schools.com/html/movie.mp4",
      poster: "/image copy 5.png",
    },
    {
      id: 5,
      title: "Graceful Curtain Looks for Every Corner",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      poster: "/image copy 6.png",
    },
  ];

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  return (
    <div className="products-page">
      <section style={styles.section}>
        <div style={styles.topRow}>
          <h2 style={styles.heading}>Scenes From Everyday Living</h2>

          <div style={styles.navButtons}>
            <button style={styles.arrowBtn} onClick={() => scroll("left")}>
              ←
            </button>
            <button style={styles.arrowBtn} onClick={() => scroll("right")}>
              →
            </button>
          </div>
        </div>

        <div ref={scrollRef} style={styles.scrollContainer}>
          {videos.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.videoWrap}>
                <video
                  key={item.poster}
                  style={styles.video}
                  src={item.video}
                  poster={item.poster}
                  muted
                  loop
                  playsInline
                  controls={false}
                  preload="none"
                  onLoadedData={(e) => e.target.pause()}
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                    e.target.load();
                  }}
                />
                <div style={styles.overlay} />
                <div style={styles.playIcon}>▶</div>
                <div style={styles.caption}>{item.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.scrollbarWrap}>
          <div style={styles.scrollHint}>Scroll to explore more</div>
        </div>
      </section>
    </div>
  );
}

const styles = {
  section: {
    padding: "70px 40px",
    background: "#f5f3ef",
    marginBottom: "40px",
  },

  topRow: {
    maxWidth: "1400px",
    margin: "0 auto 28px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  heading: {
    fontSize: "clamp(2rem, 4vw, 3.4rem)",
    fontWeight: 500,
    color: "#5b3a29",
    margin: 0,
    letterSpacing: "0.5px",
  },

  navButtons: {
    display: "flex",
    gap: "12px",
  },

  arrowBtn: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    border: "none",
    background: "#6b432c",
    color: "#fff",
    fontSize: "1.2rem",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
  },

  scrollContainer: {
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    gap: "18px",
    overflowX: "auto",
    paddingBottom: "18px",
    scrollBehavior: "smooth",
    scrollbarWidth: "thin",
    scrollbarColor: "#7a5235 #d8cdc3",
  },

  card: {
    flex: "0 0 320px",
  },

  videoWrap: {
    position: "relative",
    height: "600px",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#ddd",
    boxShadow: "0 14px 30px rgba(0,0,0,0.12)",
  },

  video: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.65), rgba(0,0,0,0.08), rgba(0,0,0,0.15))",
  },

  playIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "78px",
    height: "78px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.25)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "1.8rem",
    fontWeight: "bold",
  },

  caption: {
    position: "absolute",
    left: "18px",
    right: "18px",
    bottom: "18px",
    color: "#fff",
    fontSize: "1.4rem",
    fontWeight: 500,
    lineHeight: 1.2,
    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
  },

  scrollbarWrap: {
    maxWidth: "1400px",
    margin: "8px auto 0 auto",
    textAlign: "center",
  },

  scrollHint: {
    color: "#7b5b49",
    fontSize: "0.95rem",
    fontWeight: 500,
    letterSpacing: "0.4px",
  },
};

export default Products;