import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function BuyerDashboardSection() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("buyerUser") || "null");

  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCatalogFilter, setActiveCatalogFilter] = useState("All");

  const goToPage = (path) => {
    navigate(path);
  };

  const publicImage = (fileName) => encodeURI(`/${fileName}`);

  const slides = [
    {
      id: 1,
      eyebrow: "Luxury Drapes",
      title: "Curtains that elevate every room",
      subtitle:
        "Elegant textures, premium fall, and refined colors crafted for modern and timeless interiors.",
      image: publicImage("image copy 2.png"),
      btnText: "Explore Curtains",
      path: "/curtain-section",
    },
    {
      id: 2,
      eyebrow: "Bedroom Comfort",
      title: "Bedsheets made for soft living",
      subtitle:
        "Bring comfort, style, and fresh detailing into your bedroom with premium bedsheet collections.",
      image: publicImage("image copy 3.png"),
      btnText: "Shop Bedsheets",
      path: "/bedsheet-section",
    },
    {
      id: 3,
      eyebrow: "Living Room Edit",
      title: "Designer sofa for elegant spaces",
      subtitle:
        "Statement styling with beautiful textures, curated finishes, and everyday comfort.",
      image: publicImage("image copy 4.png"),
      btnText: "View Sofa",
      path: "/sofa-cover-section",
    },
    {
      id: 4,
      eyebrow: "Decor Details",
      title: "Pillow covers that complete the look",
      subtitle:
        "Layer your home with coordinated textures and stylish accents for a premium finish.",
      image: publicImage("image copy 5.png"),
      btnText: "Shop Pillow Covers",
      path: "/pillow-cover-section",
    },
    {
      id: 5,
      eyebrow: "Entrance Essentials",
      title: "Doormats that make first impressions count",
      subtitle:
        "Add charm to your entrance with durable and stylish doormats designed for modern homes and everyday use.",
      image: publicImage("image copy 6.png"),
      btnText: "Explore Doormats",
      path: "/doormat-section",
    },
  ];

  const sideMenuItems = [
    { title: "Curtains", path: "/curtain-section" },
    { title: "Bedsheets", path: "/bedsheet-section" },
    { title: "Sofa", path: "/sofa-cover-section" },
    { title: "Doormats", path: "/doormat-section" },
    { title: "Cushion Covers", path: "/pillow-cover-section" },
    { title: "About JP Furnishing", path: "/about-jp-furnishing" },
    { title: "Team Dashboard", path: "/team-dashboard" },
  ];

  const discoverCards = [
    {
      title: "About JP Furnishing",
      icon: "🏠",
      badge: "Our Story",
      desc: "Learn about our craftsmanship, furnishing vision, quality-first approach, and signature home styling philosophy.",
      path: "/about-jp-furnishing",
      btn: "Read More",
      image: publicImage("image copy 7.png"),
    },
    {
      title: "Meet the Team",
      icon: "👥",
      badge: "People Behind The Brand",
      desc: "See the dedication, creativity, and teamwork shaping the collections and experience of JP Furnishing.",
      path: "/team-dashboard",
      btn: "Open Team Page",
      image: publicImage("image copy 8.png"),
    },
  ];

  const catalogFilters = ["All", "Living", "Bedroom", "Decor"];

  const browseCatalog = [
    {
      title: "Curtains",
      category: "Living",
      path: "/curtain-section",
      image: publicImage("image copy 9.png"),
    },
    {
      title: "Sofa",
      category: "Living",
      path: "/sofa-cover-section",
      image: publicImage("image copy 10.png"),
    },
    {
      title: "Bedsheets",
      category: "Bedroom",
      path: "/bedsheet-section",
      image: publicImage("image copy 11.png"),
    },
    {
      title: "Cushion Covers",
      category: "Bedroom",
      path: "/pillow-cover-section",
      image: publicImage("image copy 12.png"),
    },
    {
      title: "Doormats",
      category: "Decor",
      path: "/doormat-section",
      image: publicImage("image copy 14.png"),
    },
  ];

  const filteredCatalog =
    activeCatalogFilter === "All"
      ? browseCatalog
      : browseCatalog.filter((item) => item.category === activeCatalogFilter);

  const userPhoto =
    user?.photo ||
    user?.image ||
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const logout = () => {
    localStorage.removeItem("buyerToken");
    localStorage.removeItem("buyerUser");
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <button
            style={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>

          <div>
            <p style={styles.brandMini}>JP Furnishing</p>
            <h1 style={styles.brandTitle}>Buyer Dashboard</h1>
          </div>
        </div>

        <div style={styles.topCenter}>
          <p style={styles.welcomeText}>
            Welcome back,{" "}
            <span style={styles.userName}>
              {user?.name || user?.email || "Buyer"}
            </span>
          </p>
        </div>

        <div style={styles.topRight}>
          <img src={userPhoto} alt="User" style={styles.userPhoto} />
          <button onClick={logout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.25 }}
            style={styles.sideMenu}
          >
            {sideMenuItems.map((item, index) => (
              <div
                key={index}
                style={styles.sideMenuItem}
                onClick={() => goToPage(item.path)}
              >
                {item.title}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <section style={styles.heroSection}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slides[current].id}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.65 }}
            style={{
              ...styles.heroCard,
              backgroundImage: `linear-gradient(100deg, rgba(28,19,16,0.80) 0%, rgba(28,19,16,0.56) 40%, rgba(28,19,16,0.16) 100%), url("${slides[current].image}")`,
            }}
          >
            <div style={styles.heroContent}>
              <span style={styles.heroEyebrow}>{slides[current].eyebrow}</span>
              <h2 style={styles.heroTitle}>{slides[current].title}</h2>
              <p style={styles.heroSubtitle}>{slides[current].subtitle}</p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={styles.heroBtn}
                onClick={() => goToPage(slides[current].path)}
              >
                {slides[current].btnText}
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div style={styles.dotWrap}>
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={() => setCurrent(index)}
              style={{
                ...styles.dot,
                ...(current === index ? styles.activeDot : {}),
              }}
            />
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionTag}>Catalog</p>
            <h2 style={styles.sectionHeading}>Browse Catalog</h2>
          </div>
        </div>

        <div style={styles.catalogFilterWrap}>
          {catalogFilters.map((filter, index) => (
            <button
              key={index}
              style={{
                ...styles.catalogFilterBtn,
                ...(activeCatalogFilter === filter
                  ? styles.catalogFilterBtnActive
                  : {}),
              }}
              onClick={() => setActiveCatalogFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div style={styles.catalogGrid}>
          {filteredCatalog.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.015 }}
              transition={{ duration: 0.22 }}
              style={styles.catalogCard}
              onClick={() => goToPage(item.path)}
            >
              <div style={styles.catalogImageWrap}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={styles.catalogImage}
                />
                <div style={styles.catalogImageOverlay} />
              </div>

              <div style={styles.catalogContent}>
                <h3 style={styles.catalogTitle}>{item.title}</h3>
                <p style={styles.catalogCategory}>{item.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <p style={styles.sectionTag}>Highlights</p>
            <h2 style={styles.sectionHeading}>Discover More</h2>
          </div>
        </div>

        <div style={styles.discoverGrid}>
          {discoverCards.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              whileHover={{ y: -10 }}
              style={{
                ...styles.discoverCard,
                backgroundImage: `url("${item.image}")`,
              }}
            >
              <div style={styles.discoverOverlay} />
              <div style={styles.discoverContent}>
                <div style={styles.discoverIcon}>{item.icon}</div>
                <span style={styles.discoverBadge}>{item.badge}</span>
                <h3 style={styles.discoverTitle}>{item.title}</h3>
                <p style={styles.discoverDesc}>{item.desc}</p>

                <div style={styles.discoverFooter}>
                  <button
                    style={styles.discoverBtn}
                    onClick={() => goToPage(item.path)}
                  >
                    {item.btn}
                  </button>
                  <span style={styles.discoverArrow}>↗</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={styles.storySection}>
        <div style={styles.storyContainer}>
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 style={styles.storyHeading}>Our Vision!</h2>
            <p style={styles.storyDescription}>
              A seamless and elegant buyer experience designed for smooth
              browsing, saved selections, order tracking, and personalized
              account access.
            </p>

            <div style={styles.storyGrid}>
              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                style={styles.storyCard}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.03)";
                }}
              >
                <img
                  src={publicImage("image copy 2.png")}
                  alt="Curtain experience"
                  style={styles.storyImage}
                />
                <div style={styles.storyOverlay} />
                <div style={styles.storyCardContent}>
                  <p style={styles.storyCardText}>
                    Discover graceful curtain styling that adds softness,
                    movement, and elegance to every corner of your home.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                style={styles.storyCard}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.03)";
                }}
              >
                <img
                  src={publicImage("image copy 3.png")}
                  alt="Bedsheet experience"
                  style={styles.storyImage}
                />
                <div style={styles.storyOverlay} />
                <div style={styles.storyCardContent}>
                  <p style={styles.storyCardText}>
                    Experience premium bedding comfort with beautiful textures,
                    layered warmth, and a refined bedroom feel.
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                style={styles.storyCard}
                onMouseEnter={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  const img = e.currentTarget.querySelector("img");
                  if (img) img.style.transform = "scale(1.03)";
                }}
              >
                <img
                  src={publicImage("image copy 4.png")}
                  alt="Home styling experience"
                  style={styles.storyImage}
                />
                <div style={styles.storyOverlay} />
                <div style={styles.storyCardContent}>
                  <p style={styles.storyCardText}>
                    Bring together comfort, design, and visual harmony through a
                    home furnishing journey made to inspire.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      <section style={styles.featuredSection}>
        <div style={styles.featuredHeader}>
          <p style={styles.featuredSubheading}>ROOMS, HOME AND YOU</p>
          <h2 style={styles.featuredHeading}>FEATURED PRODUCTS</h2>
        </div>

        <div style={styles.featuredScrollWrap}>
          <div style={styles.featuredScrollRow}>
            {[
              publicImage("image copy 5.png"),
              publicImage("image copy 6.png"),
              publicImage("image copy 7.png"),
              publicImage("image copy 8.png"),
              publicImage("image copy 9.png"),
              publicImage("image copy 10.png"),
              publicImage("image copy 11.png"),
              publicImage("image copy 12.png"),
            ].map((img, index) => (
              <div key={index} style={styles.featuredCard}>
                <img
                  src={img}
                  alt={`featured-${index}`}
                  style={styles.featuredImage}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={styles.jpSection}>
        <div style={styles.jpImageWrap}>
          <img
            src={publicImage("image copy 15.png")}
            alt="JP Furnishing"
            style={styles.jpImage}
          />
        </div>

        <div style={styles.jpContent}>
          <h2 style={styles.jpHeading}>CRAFTING COMFORT WITH JP FURNISHING</h2>
          <p style={styles.jpText}>
            At JP Furnishing, every design is thoughtfully curated to bring
            warmth, elegance, and timeless comfort into your spaces. From
            luxurious curtains and premium bedsheets to refined sofa, stylish
            doormats, and home décor essentials, our vision is to transform
            everyday interiors into beautiful living experiences with quality,
            style, and lasting sophistication.
          </p>
        </div>
      </section>

      <footer style={styles.footerSection}>
        <div style={styles.footerContainer}>
          <h2 style={styles.footerLogo}>JP FURNISHING</h2>
          <p style={styles.footerTagline}>Premium Home Furnishing Brand</p>

          <div style={styles.footerLinksRow}>
            <a href="#" style={styles.footerLink}>Our Journey</a>
            <a href="#" style={styles.footerLink}>Collections</a>
            <a href="#" style={styles.footerLink}>Curtains</a>
            <a href="#" style={styles.footerLink}>Bedsheets</a>
            <a href="#" style={styles.footerLink}>Sofa</a>
            <a href="#" style={styles.footerLink}>Doormats</a>
            <a href="#" style={styles.footerLink}>FAQs</a>
          </div>

          <div style={styles.footerLinksRow}>
            <a href="#" style={styles.footerLink}>Contact Us</a>
            <a href="#" style={styles.footerLink}>Privacy Policy</a>
            <a href="#" style={styles.footerLink}>Blogs</a>
            <a href="#" style={styles.footerLink}>Terms & Conditions</a>
          </div>

          <div style={styles.footerSocial}>
            <span style={styles.footerFollow}>FOLLOW US</span>

            <div style={styles.footerIcons}>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
              <a href="#"><i className="fab fa-facebook"></i></a>
            </div>
          </div>

          <p style={styles.footerCopyright}>
            © {new Date().getFullYear()} JP Furnishing. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "28px",
    background: "linear-gradient(180deg, #f8f4f1 0%, #f2ece7 100%)",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    position: "relative",
    width: "100%",
    overflow: "visible",
    zIndex: 1,
  },
  topBar: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    gap: "16px",
    padding: "18px 22px",
    marginBottom: "26px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.86)",
    border: "1px solid #eaded5",
    boxShadow: "0 16px 38px rgba(78, 54, 39, 0.08)",
    backdropFilter: "blur(10px)",
  },
  topLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  topCenter: {
    display: "flex",
    justifyContent: "center",
  },
  topRight: {
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: "14px",
  },
  brandMini: {
    margin: 0,
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    color: "#9b7d6a",
    fontWeight: "700",
  },
  brandTitle: {
    margin: "4px 0 0",
    fontSize: "24px",
    color: "#2f241f",
    fontWeight: "800",
  },
  welcomeText: {
    margin: 0,
    fontSize: "18px",
    color: "#54433a",
    textAlign: "center",
  },
  userName: {
    color: "#2d211c",
    fontWeight: "800",
  },
  menuBtn: {
    border: "none",
    width: "50px",
    height: "50px",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "22px",
    color: "#fff",
    background: "linear-gradient(135deg, #4c3125, #7c5843)",
    boxShadow: "0 12px 24px rgba(76, 49, 37, 0.2)",
  },
  userPhoto: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #f2e6dd",
    background: "#fff",
  },
  logoutBtn: {
    border: "none",
    padding: "12px 18px",
    borderRadius: "14px",
    cursor: "pointer",
    background: "linear-gradient(135deg, #413028, #624637)",
    color: "#fff",
    fontWeight: "700",
    boxShadow: "0 10px 20px rgba(65, 48, 40, 0.18)",
  },
  sideMenu: {
    position: "absolute",
    top: "96px",
    left: "28px",
    width: "290px",
    padding: "16px",
    borderRadius: "22px",
    background: "rgba(255,255,255,0.97)",
    border: "1px solid #eaded5",
    boxShadow: "0 18px 40px rgba(58, 39, 28, 0.15)",
    zIndex: 20,
  },
  sideMenuItem: {
    padding: "15px 16px",
    borderRadius: "16px",
    marginBottom: "10px",
    background: "#f7f1ec",
    color: "#43342c",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  heroSection: {
    marginBottom: "8px",
  },
  heroCard: {
    minHeight: "460px",
    borderRadius: "34px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    padding: "58px",
    boxShadow: "0 24px 50px rgba(70, 49, 37, 0.12)",
  },
  heroContent: {
    maxWidth: "640px",
    color: "#fff",
  },
  heroEyebrow: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: "12px",
    letterSpacing: "0.8px",
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: "18px",
  },
  heroTitle: {
    margin: "0 0 14px",
    fontSize: "54px",
    lineHeight: "1.06",
    fontWeight: "900",
    color: "#ffffff",
  },
  heroSubtitle: {
    margin: "0 0 24px",
    fontSize: "18px",
    lineHeight: "1.8",
    color: "rgba(255,255,255,0.92)",
    maxWidth: "90%",
  },
  heroBtn: {
    border: "none",
    background: "#fff",
    color: "#3c2b24",
    padding: "14px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "800",
    fontSize: "15px",
  },
  dotWrap: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginTop: "18px",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "999px",
    background: "#cebdb1",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },
  activeDot: {
    width: "34px",
    background: "linear-gradient(135deg, #5d3d2d, #896650)",
  },
  section: {
    marginTop: "30px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: "20px",
    gap: "12px",
    flexWrap: "wrap",
  },
  sectionTag: {
    margin: 0,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "700",
    color: "#a0806a",
  },
  sectionHeading: {
    margin: "6px 0 0",
    fontSize: "36px",
    lineHeight: "1.15",
    color: "#2f241f",
    fontWeight: "900",
  },
  discoverGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "24px",
  },
  discoverCard: {
    position: "relative",
    overflow: "hidden",
    minHeight: "330px",
    borderRadius: "30px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    boxShadow: "0 20px 44px rgba(78, 54, 39, 0.14)",
  },
  discoverOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(29,20,17,0.78) 0%, rgba(52,36,28,0.56) 46%, rgba(22,16,14,0.7) 100%)",
  },
  discoverContent: {
    position: "relative",
    zIndex: 2,
    minHeight: "330px",
    padding: "28px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  discoverIcon: {
    width: "74px",
    height: "74px",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    marginBottom: "16px",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  discoverBadge: {
    display: "inline-block",
    width: "fit-content",
    padding: "7px 14px",
    borderRadius: "999px",
    marginBottom: "12px",
    background: "rgba(255,255,255,0.14)",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "700",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  discoverTitle: {
    margin: "0 0 10px",
    fontSize: "30px",
    color: "#fff",
    fontWeight: "800",
    lineHeight: "1.2",
  },
  discoverDesc: {
    margin: "0 0 22px",
    color: "rgba(255,255,255,0.92)",
    lineHeight: "1.75",
    fontSize: "15px",
  },
  discoverFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  discoverBtn: {
    border: "none",
    background: "#fff",
    color: "#3d2d25",
    padding: "12px 20px",
    borderRadius: "14px",
    fontWeight: "800",
    cursor: "pointer",
  },
  discoverArrow: {
    fontSize: "28px",
    color: "#fff",
    fontWeight: "800",
  },
  catalogFilterWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "14px",
    justifyContent: "center",
    marginBottom: "28px",
  },
  catalogFilterBtn: {
    border: "1px solid #ddd1c8",
    background: "#fff",
    color: "#4a3930",
    padding: "12px 26px",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "15px",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 16px rgba(0,0,0,0.03)",
  },
  catalogFilterBtnActive: {
    background: "linear-gradient(135deg, #fff6ef, #f7e5d8)",
    color: "#c9732f",
    border: "1px solid #e2a06c",
    boxShadow: "0 10px 24px rgba(201,115,47,0.12)",
  },
  catalogGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  },
  catalogCard: {
    cursor: "pointer",
    borderRadius: "24px",
    overflow: "hidden",
    background: "#fff",
    border: "1px solid #eee3db",
    boxShadow: "0 14px 28px rgba(70, 49, 37, 0.06)",
    transition: "all 0.25s ease",
  },
  catalogImageWrap: {
    position: "relative",
    width: "100%",
    height: "240px",
    overflow: "hidden",
    background: "#f4ece6",
  },
  catalogImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  catalogImageOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.12) 100%)",
  },
  catalogContent: {
    padding: "18px 16px 22px",
    textAlign: "center",
  },
  catalogTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#2f241f",
    fontWeight: "800",
    letterSpacing: "0.4px",
  },
  catalogCategory: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "#8b7468",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  storySection: {
    padding: "100px 24px",
    background: "linear-gradient(180deg, #f7f2ed 0%, #efe7df 100%)",
    marginTop: "50px",
  },
  storyContainer: {
    maxWidth: "1800px",
    margin: "0 auto",
  },
  storyHeading: {
    margin: "0 0 16px",
    fontSize: "42px",
    color: "#2f241f",
    fontWeight: "800",
    textAlign: "center",
  },
  storyDescription: {
    maxWidth: "760px",
    margin: "0 auto 36px",
    fontSize: "17px",
    lineHeight: "1.8",
    color: "#6b5648",
    textAlign: "center",
  },
  storyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginTop: "28px",
  },
  storyCard: {
    position: "relative",
    minHeight: "380px",
    borderRadius: "28px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 18px 40px rgba(70, 49, 37, 0.12)",
  },
  storyImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scale(1.03)",
    transition: "transform 0.45s ease",
    display: "block",
  },
  storyOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(27,18,14,0.72) 100%)",
  },
  storyCardContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: "24px",
    zIndex: 2,
  },
  storyCardText: {
    margin: 0,
    color: "#fff",
    fontSize: "16px",
    lineHeight: "1.7",
    fontWeight: "600",
  },
  featuredSection: {
    padding: "90px 24px",
    background: "#f9f5f0",
  },
  featuredHeader: {
    textAlign: "center",
    marginBottom: "32px",
  },
  featuredSubheading: {
    margin: "0 0 8px",
    color: "#9f7a65",
    letterSpacing: "3px",
    fontSize: "12px",
    fontWeight: "700",
  },
  featuredHeading: {
    margin: 0,
    color: "#2f241f",
    fontSize: "38px",
    fontWeight: "900",
  },
  featuredScrollWrap: {
    overflowX: "auto",
    paddingBottom: "10px",
  },
  featuredScrollRow: {
    display: "flex",
    gap: "20px",
    minWidth: "max-content",
  },
  featuredCard: {
    width: "260px",
    height: "340px",
    borderRadius: "24px",
    overflow: "hidden",
    flexShrink: 0,
    boxShadow: "0 14px 30px rgba(70, 49, 37, 0.08)",
    background: "#fff",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  jpSection: {
    display: "grid",
    gridTemplateColumns: "1.15fr 1fr",
    gap: "36px",
    alignItems: "center",
    padding: "90px 24px",
    background: "linear-gradient(180deg, #fffaf7 0%, #f5ede7 100%)",
  },
  jpImageWrap: {
    borderRadius: "30px",
    overflow: "hidden",
    boxShadow: "0 18px 40px rgba(70, 49, 37, 0.12)",
  },
  jpImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },
  jpContent: {
    maxWidth: "620px",
  },
  jpHeading: {
    margin: "0 0 18px",
    fontSize: "38px",
    lineHeight: "1.15",
    color: "#2f241f",
    fontWeight: "900",
  },
  jpText: {
    margin: 0,
    fontSize: "17px",
    lineHeight: "1.9",
    color: "#5c4a41",
  },
  footerSection: {
    padding: "70px 24px 50px",
    background: "#2d221d",
  },
  footerContainer: {
    maxWidth: "1300px",
    margin: "0 auto",
    textAlign: "center",
  },
  footerLogo: {
    margin: 0,
    color: "#fff",
    fontSize: "34px",
    fontWeight: "900",
    letterSpacing: "1px",
  },
  footerTagline: {
    margin: "10px 0 24px",
    color: "#d3c2b5",
    fontSize: "16px",
  },
  footerLinksRow: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "18px",
    marginBottom: "16px",
  },
  footerLink: {
    color: "#f0e3d9",
    textDecoration: "none",
    fontSize: "15px",
  },
  footerSocial: {
    marginTop: "24px",
  },
  footerFollow: {
    display: "block",
    marginBottom: "12px",
    color: "#d1b8a6",
    letterSpacing: "2px",
    fontSize: "12px",
    fontWeight: "700",
  },
  footerIcons: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    fontSize: "20px",
  },
  footerCopyright: {
    marginTop: "24px",
    color: "#cbb8aa",
    fontSize: "14px",
  },
};