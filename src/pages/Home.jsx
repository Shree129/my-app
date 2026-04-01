import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SEOHead from "../components/SEO/SEOHead";
import RecommendationCarousel from "../components/AI/RecommendationCarousel";
import AutoScrollSlider from "../components/Home/AutoScrollSlider";
import { getClientRecommendations } from "../utils/recommendationEngine";
import { useUserActivity } from "../context/UserActivityContext";
import masterCatalog from "../buyer/masterCatalog";

import backgroundImage from "/home-bg.jpg";

const featuredProducts = [
  {
    id: 1,
    name: "Our Collections",
    brand: "JP Furnishing",
    image: "/image copy 2.png",
  },
  {
    id: 2,
    name: "Curtain Collections",
    brand: "JP Furnishing",
    image: "/image copy 3.png",
  },
  {
    id: 3,
    name: "Our Mattress",
    brand: "JP Furnishing",
    image: "/image copy 4.png",
  },
];

const videos = [
  {
    id: 1,
    title: "Our products ",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "/image copy 5.png",
  },
  {
    id: 2,
    title: " Styling with JP Furnishing",
    video: "https://www.w3schools.com/html/movie.mp4",
    poster: "/image copy 6.png",
  },
  {
    id: 3,
    title: "Decor for Modern Homes",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "/image copy 7.png",
  },
  {
    id: 4,
    title: "Premium Fabric Flow for Living Spaces",
    video: "https://www.w3schools.com/html/movie.mp4",
    poster: "/image copy 8.png",
  },
  {
    id: 5,
    title: "Graceful  Looks for Every Corner",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    poster: "/image copy 9.png",
  },
];

const reviews = [
  {
    id: 1,
    name: "Shreeya",
    text: "Beautiful curtains. Highly recommended!",
    image: "/image copy 10.png",
  },
  {
    id: 2,
    name: "Manya",
    text: "Overall great quality and elegant look.",
    image: "/image copy 11.png",
  },
  {
    id: 3,
    name: "Ankita",
    text: "Great quality and beautiful design.",
    image: "/image copy 12.png",
  },
  {
    id: 4,
    name: "Bhai Aadya",
    text: "Curtain rods and rings package was perfect.",
    image: "/image copy 13.png",
  },
];

const features = [
  {
    id: 1,
    icon: "🏷️",
    title: "Transparent Pricing",
    text: "Clear product pricing and easy shopping flow help you choose premium furnishing without hidden costs or confusion.",
  },
  {
    id: 2,
    icon: "💎",
    title: "Luxury for Less",
    text: "We combine elegant aesthetics, quality materials, and value-driven collections to deliver comfort with affordability.",
  },
  {
    id: 3,
    icon: "🛍️",
    title: "Numerous Selections",
    text: "Explore a wide variety of curtains, bedsheets, sofa covers, and furnishing essentials tailored for every interior style.",
  },
];

const HomeStyle = {
  page: {
    backgroundColor: "#f7f4ef",
  },

  hero: {
    minHeight: "92vh",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.38), rgba(0,0,0,0.38)), url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "120px 20px 60px",
  },

  heroContent: {
    width: "100%",
    maxWidth: "1050px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "24px",
    padding: "70px 40px",
    textAlign: "center",
    backdropFilter: "blur(4px)",
  },

  heroTitle: {
    fontSize: "clamp(2.5rem, 6vw, 5.2rem)",
    fontWeight: 800,
    color: "#fff",
    marginBottom: "22px",
    lineHeight: 1.1,
    letterSpacing: "-1px",
  },

  heroSubtitle: {
    fontSize: "clamp(1.05rem, 2vw, 1.8rem)",
    color: "rgba(255,255,255,0.92)",
    marginBottom: "34px",
    fontWeight: 400,
  },

  heroBtn: {
    display: "inline-block",
    backgroundColor: "#7b5235",
    color: "#fff",
    textDecoration: "none",
    padding: "16px 36px",
    borderRadius: "10px",
    fontWeight: 700,
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
  },

  productsSection: {
    padding: "80px 24px",
    background: "#f7f4ef",
  },

  sectionHeader: {
    maxWidth: "1200px",
    margin: "0 auto 40px",
    textAlign: "center",
  },

  sectionSubTitle: {
    color: "#8a6a4f",
    fontSize: "0.95rem",
    textTransform: "uppercase",
    letterSpacing: "1.4px",
    marginBottom: "10px",
    fontWeight: 600,
  },

  sectionTitle: {
    fontSize: "clamp(2rem, 4vw, 3.3rem)",
    color: "#3f2b20",
    margin: 0,
    fontWeight: 700,
  },

  sectionText: {
    maxWidth: "760px",
    margin: "16px auto 0",
    color: "#666",
    fontSize: "1.05rem",
    lineHeight: 1.8,
  },

  productsGrid: {
    maxWidth: "1320px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "26px",
  },

  productCard: {
    position: "relative",
    height: "560px",
    overflow: "hidden",
    borderRadius: "22px",
    cursor: "pointer",
    boxShadow: "0 14px 32px rgba(0,0,0,0.10)",
    background: "#ece7e0",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
    transition: "transform 0.6s ease",
  },

  productOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    padding: "28px",
    background:
      "linear-gradient(to top, rgba(0,0,0,0.72), rgba(0,0,0,0.18), rgba(0,0,0,0.03))",
  },

  productBrand: {
    color: "rgba(255,255,255,0.82)",
    fontSize: "0.95rem",
    marginBottom: "8px",
    letterSpacing: "0.4px",
  },

  productName: {
    color: "#fff",
    fontSize: "2rem",
    lineHeight: 1.2,
    fontWeight: 600,
    margin: "0 0 18px",
  },

  productBtn: {
    width: "fit-content",
    border: "none",
    background: "#7b5235",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: "10px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },

  reelSection: {
    padding: "70px 40px",
    background: "#f5f3ef",
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

  reviewSection: {
    padding: "80px 40px",
    background: "#f7f4ef",
  },

  reviewHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },

  reviewTitle: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    color: "#5b3a29",
    marginBottom: "10px",
  },

  reviewSubtitle: {
    color: "#7b5b49",
    fontSize: "1rem",
    margin: 0,
  },

  reviewGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  reviewCard: {
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
  },

  reviewImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    display: "block",
  },

  reviewContent: {
    padding: "20px",
  },

  stars: {
    color: "#ffc400",
    fontSize: "28px",
    marginBottom: "12px",
    letterSpacing: "2px",
  },

  reviewUser: {
    fontWeight: "600",
    marginBottom: "10px",
    color: "#5b3a29",
    fontSize: "1.1rem",
  },

  verified: {
    background: "#5b3a29",
    color: "#fff",
    fontSize: "12px",
    padding: "4px 9px",
    borderRadius: "6px",
    marginLeft: "8px",
    verticalAlign: "middle",
  },

  reviewText: {
    color: "#6b6b6b",
    fontSize: "1rem",
    lineHeight: "1.6",
    margin: 0,
  },

  featureSection: {
    padding: "90px 30px",
    background: "#f7f4ef",
    textAlign: "center",
  },

  featureTitle: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    color: "#6b432c",
    marginBottom: "18px",
    fontWeight: 500,
  },

  featureQuote: {
    maxWidth: "1200px",
    margin: "0 auto 70px",
    fontSize: "clamp(1rem, 2vw, 1.35rem)",
    lineHeight: 1.8,
    color: "#1f1f1f",
  },

  featureGrid: {
    maxWidth: "1450px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "40px",
  },

  featureCard: {
    padding: "10px 18px",
  },

  featureIcon: {
    fontSize: "5rem",
    marginBottom: "22px",
  },

  featureCardTitle: {
    fontSize: "2.1rem",
    color: "#6b432c",
    marginBottom: "18px",
    fontWeight: 500,
  },

  featureCardText: {
    color: "#1f1f1f",
    fontSize: "1.05rem",
    lineHeight: 1.8,
    maxWidth: "470px",
    margin: "0 auto",
  },

  brandSection: {
    background: "#f7f4ef",
    paddingBottom: "90px",
  },

  brandImageWrap: {
    width: "100%",
    height: "430px",
    overflow: "hidden",
  },

  brandImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  brandContent: {
    maxWidth: "1500px",
    margin: "0 auto",
    textAlign: "center",
    padding: "70px 30px 0",
  },

  brandHeading: {
    fontSize: "clamp(2.8rem, 7vw, 6rem)",
    lineHeight: 1,
    color: "#8b5e34",
    fontWeight: 700,
    marginBottom: "34px",
    textTransform: "uppercase",
    fontFamily: "Georgia, serif",
  },

  brandParagraph: {
    maxWidth: "1600px",
    margin: "0 auto",
    fontSize: "clamp(1.1rem, 2vw, 1.45rem)",
    lineHeight: 1.9,
    color: "#8a6a4f",
  },
};

function Home() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { getRecentlyViewed } = useUserActivity();
  const [recommendations, setRecommendations] = useState([]);
  const [trendingPicks, setTrendingPicks] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);

  // Load AI recommendations & Activity
  useEffect(() => {
    try {
      const recs = getClientRecommendations(masterCatalog, 'personalized');
      setRecommendations(recs);
      const trending = getClientRecommendations(masterCatalog, 'trending');
      setTrendingPicks(trending);
      
      const recent = getRecentlyViewed();
      setRecentlyViewed(recent);
    } catch (e) {
      console.warn('Recommendations error:', e);
    }
    setRecsLoading(false);
  }, [getRecentlyViewed]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -380 : 380,
      behavior: "smooth",
    });
  };

  // JSON-LD structured data for the homepage
  const homeJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "JP Furnishing",
    "url": "https://jpfurnishing.com",
    "description": "Premium Home Furnishing — Curtains, Bedsheets, Sofa Covers",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://jpfurnishing.com/products?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="home-page" style={HomeStyle.page}>
      <SEOHead
        title="JP Furnishing — Premium Home Furnishing | Curtains, Bedsheets, Sofa Covers"
        description="Discover premium home furnishing at JP Furnishing. Shop elegant curtains, luxury bedsheets, sofa covers, pillow covers & doormats with AI-powered recommendations."
        keywords="JP Furnishing, curtains, bedsheets, sofa covers, home furnishing, interior decor"
        jsonLd={homeJsonLd}
      />
      <section style={HomeStyle.hero}>
        <div style={HomeStyle.heroContent}>
          <h1 style={HomeStyle.heroTitle}>Your Sanctuary of Sleep</h1>
          <p style={HomeStyle.heroSubtitle}>
            Premium Furnishing for Uncompromising Comfort
          </p>
          <Link to="/login" style={HomeStyle.heroBtn}>
            Explore Buyer Dashboard
          </Link>
        </div>
      </section>

      {/* ═══════ AUTO SCROLLING TRENDING SLIDER ═══════ */}
      <AutoScrollSlider />

      <section style={HomeStyle.productsSection}>
        <div style={HomeStyle.sectionHeader}>
          <p style={HomeStyle.sectionSubTitle}>Our Collection</p>
          <h2 style={HomeStyle.sectionTitle}>Explore Our Products</h2>
          <p style={HomeStyle.sectionText}>
            Discover elegant furnishing solutions crafted to bring warmth,
            style, and comfort into every corner of your home.
          </p>
        </div>

        <div style={HomeStyle.productsGrid}>
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              style={HomeStyle.productCard}
              onClick={() => navigate("/login")}
              onMouseEnter={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={HomeStyle.productImage}
              />

              <div style={HomeStyle.productOverlay}>
                <p style={HomeStyle.productBrand}>{product.brand}</p>
                <h3 style={HomeStyle.productName}>{product.name}</h3>
                <button
                  style={HomeStyle.productBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/login");
                  }}
                >
                  View Collection
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={HomeStyle.reelSection}>
        <div style={HomeStyle.topRow}>
          <h2 style={HomeStyle.heading}>Scenes From Everyday Living</h2>

          <div style={HomeStyle.navButtons}>
            <button style={HomeStyle.arrowBtn} onClick={() => scroll("left")}>
              ←
            </button>
            <button style={HomeStyle.arrowBtn} onClick={() => scroll("right")}>
              →
            </button>
          </div>
        </div>

        <div ref={scrollRef} style={HomeStyle.scrollContainer}>
          {videos.map((item) => (
            <div key={item.id} style={HomeStyle.card}>
              <div style={HomeStyle.videoWrap}>
                <video
                  style={HomeStyle.video}
                  src={item.video}
                  poster={item.poster}
                  muted
                  loop
                  playsInline
                  controls={false}
                  onMouseEnter={(e) => e.target.play()}
                  onMouseLeave={(e) => {
                    e.target.pause();
                    e.target.currentTime = 0;
                  }}
                />
                <div style={HomeStyle.overlay} />
                <div style={HomeStyle.playIcon}>▶</div>
                <div style={HomeStyle.caption}>{item.title}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={HomeStyle.scrollbarWrap}>
          <div style={HomeStyle.scrollHint}>Scroll to explore more</div>
        </div>
      </section>

      <section style={HomeStyle.reviewSection}>
        <div style={HomeStyle.reviewHeader}>
          <h2 style={HomeStyle.reviewTitle}>Real Reviews from Customers</h2>
          <p style={HomeStyle.reviewSubtitle}>
            Rated 4.90 / 5, based on 9575 reviews
          </p>
        </div>

        <div style={HomeStyle.reviewGrid}>
          {reviews.map((review) => (
            <div key={review.id} style={HomeStyle.reviewCard}>
              <img
                src={review.image}
                alt={review.name}
                style={HomeStyle.reviewImage}
              />

              <div style={HomeStyle.reviewContent}>
                <div style={HomeStyle.stars}>★★★★★</div>

                <div style={HomeStyle.reviewUser}>
                  {review.name}
                  <span style={HomeStyle.verified}>Verified</span>
                </div>

                <p style={HomeStyle.reviewText}>{review.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={HomeStyle.featureSection}>
        <h2 style={HomeStyle.featureTitle}>Make Custom Curtains Easy</h2>
        <p style={HomeStyle.featureQuote}>
          "Drapes don't just decorate beautiful places. They create unique
          experiences that captivate you to inspire peace in heart."
        </p>

        <div style={HomeStyle.featureGrid}>
          {features.map((item) => (
            <div key={item.id} style={HomeStyle.featureCard}>
              <div style={HomeStyle.featureIcon}>{item.icon}</div>
              <h3 style={HomeStyle.featureCardTitle}>{item.title}</h3>
              <p style={HomeStyle.featureCardText}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={HomeStyle.brandSection}>
        <div style={HomeStyle.brandImageWrap}>
          <img
            src="/image copy 2.png"
            alt="JP Furnishing luxury interior"
            style={HomeStyle.brandImage}
          />
        </div>

        <div style={HomeStyle.brandContent}>
          <h2 style={HomeStyle.brandHeading}>
            Crafting Comfort With JP
            <br />
            Furnishing
          </h2>

          <p style={HomeStyle.brandParagraph}>
            At JP Furnishing, every design is thoughtfully curated to bring
            warmth, elegance, and timeless comfort into your spaces. From
            luxurious curtains and premium bedsheets to refined sofa covers and
            home décor essentials, our vision is to transform everyday interiors
            into beautiful living experiences with quality, style, and lasting
            sophistication.
          </p>
        </div>
      </section>

      {/* ═══════ AI RECOMMENDATION SECTIONS ═══════ */}
      <section style={{ background: '#f7f4ef' }}>
        <RecommendationCarousel
          title="Recommended for You"
          subtitle="AI-curated picks based on your preferences"
          products={recommendations}
          loading={recsLoading}
        />
      </section>

      <section style={{ background: '#f5f3ef' }}>
        <RecommendationCarousel
          title="Trending Picks"
          subtitle="Popular products our customers love"
          products={trendingPicks}
          loading={recsLoading}
        />
      </section>

      {/* ═══════ RECENTLY VIEWED SECTION ═══════ */}
      {recentlyViewed.length > 0 && (
        <section style={{ background: '#f7f4ef', paddingBottom: '40px' }}>
          <RecommendationCarousel
            title="Recently Viewed"
            subtitle="Pick up where you left off"
            products={recentlyViewed}
            loading={recsLoading}
          />
        </section>
      )}
    </div>
  );
}

export default Home;