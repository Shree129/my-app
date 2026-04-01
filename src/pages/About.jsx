import React from "react";
import BrandStory from "../components/Common/BrandStory.jsx";

const PageStyle = {
  page: {
    background: "linear-gradient(to bottom, #f8f6f2, #ffffff)",
    minHeight: "100vh",
    padding: "60px 20px",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  heroSection: {
    textAlign: "center",
    marginBottom: "50px",
    padding: "40px 20px 20px",
  },

  heading: {
    fontSize: "clamp(2.4rem, 5vw, 4rem)",
    color: "#5a3d2b",
    fontWeight: 700,
    marginBottom: "16px",
    letterSpacing: "0.5px",
  },

  subtitle: {
    maxWidth: "760px",
    margin: "0 auto",
    fontSize: "1.1rem",
    lineHeight: 1.8,
    color: "#6b6b6b",
  },

  contentWrap: {
    display: "grid",
    gap: "28px",
    marginTop: "35px",
  },

  textBlock: {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderRadius: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.06)",
    border: "1px solid rgba(0,0,0,0.05)",
    lineHeight: 1.9,
    fontSize: "1.05rem",
    color: "#5f5f5f",
  },

  sectionTitleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },

  accentBar: {
    width: "6px",
    height: "34px",
    borderRadius: "10px",
    background: "linear-gradient(to bottom, #caa45f, #8b6b3d)",
  },

  sectionTitle: {
    fontSize: "1.7rem",
    color: "#2f2f2f",
    fontWeight: 600,
    margin: 0,
  },

  paragraph: {
    margin: 0,
  },

  highlight: {
    color: "#5a3d2b",
    fontWeight: 600,
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
    marginTop: "10px",
  },

  infoCard: {
    background: "#faf7f2",
    borderRadius: "16px",
    padding: "22px",
    border: "1px solid rgba(90, 61, 43, 0.08)",
  },

  infoCardTitle: {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#5a3d2b",
    marginBottom: "10px",
  },

  infoCardText: {
    color: "#666",
    lineHeight: 1.7,
    margin: 0,
  },
};

function About() {
  return (
    <div style={PageStyle.page}>
      <div style={PageStyle.container}>
        <div style={PageStyle.heroSection}>
          <h1 style={PageStyle.heading}>About JP Furnishing House</h1>
          <p style={PageStyle.subtitle}>
            At JP Furnishing House, we believe every home deserves warmth,
            elegance, and comfort. Our journey is built on quality
            craftsmanship, thoughtful design, and a genuine passion for making
            living spaces feel truly special.
          </p>
        </div>

        <BrandStory />

        <div style={PageStyle.contentWrap}>
          <div style={PageStyle.textBlock}>
            <div style={PageStyle.sectionTitleWrap}>
              <div style={PageStyle.accentBar}></div>
              <h2 style={PageStyle.sectionTitle}>Our Values</h2>
            </div>

            <p style={PageStyle.paragraph}>
              We are guided by three core principles:
              <span style={PageStyle.highlight}> Quality</span>,
              <span style={PageStyle.highlight}> Comfort</span>, and
              <span style={PageStyle.highlight}> Integrity</span>. Quality is
              reflected in our carefully selected materials and finishing.
              Comfort is created through thoughtful design that suits modern
              living. Integrity remains at the heart of everything we do, from
              fair pricing to honest service and long-term customer trust.
            </p>

            <div style={PageStyle.infoGrid}>
              <div style={PageStyle.infoCard}>
                <div style={PageStyle.infoCardTitle}>Quality First</div>
                <p style={PageStyle.infoCardText}>
                  Every furnishing product is chosen and crafted with attention
                  to durability, finish, and visual appeal.
                </p>
              </div>

              <div style={PageStyle.infoCard}>
                <div style={PageStyle.infoCardTitle}>Designed for Comfort</div>
                <p style={PageStyle.infoCardText}>
                  We focus on products that not only look beautiful but also
                  bring ease, softness, and functionality into daily life.
                </p>
              </div>

              <div style={PageStyle.infoCard}>
                <div style={PageStyle.infoCardTitle}>Built on Trust</div>
                <p style={PageStyle.infoCardText}>
                  Clear communication, genuine support, and dependable service
                  help us build lasting relationships with our customers.
                </p>
              </div>
            </div>
          </div>

          <div style={PageStyle.textBlock}>
            <div style={PageStyle.sectionTitleWrap}>
              <div style={PageStyle.accentBar}></div>
              <h2 style={PageStyle.sectionTitle}>Meet the Team</h2>
            </div>

            <p style={PageStyle.paragraph}>
              JP Furnishing House is driven by a passionate team that values
              home styling, customer satisfaction, and lasting quality. As a
              family-focused business, we bring together experience,
              craftsmanship, and care in every collection we offer. Our team
              works with dedication to ensure each product reflects the
              standards of comfort, elegance, and reliability that define our
              brand.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;