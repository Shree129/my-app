import React from "react";
import { Link } from "react-router-dom";

/**
 * Footer — Premium responsive footer with newsletter, social links, and multi-column layout
 */
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={F.footer}>
      <div style={F.container}>
        {/* Top Section */}
        <div style={F.topGrid}>
          {/* Brand Column */}
          <div style={F.brandCol}>
            <h2 style={F.brandName}>JP Furnishing</h2>
            <p style={F.brandTagline}>
              Crafting premium furnishing experiences since 2020. Elegant curtains,
              luxury bedsheets, and refined home décor for modern living.
            </p>
            <div style={F.socialRow}>
              {[
                { icon: "📘", label: "Facebook", href: "#" },
                { icon: "📸", label: "Instagram", href: "#" },
                { icon: "🐦", label: "Twitter", href: "#" },
                { icon: "📌", label: "Pinterest", href: "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  style={F.socialIcon}
                  aria-label={social.label}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#6b432c";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(107,67,44,0.08)";
                    e.currentTarget.style.color = "#6b432c";
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div style={F.linkCol}>
            <h4 style={F.colTitle}>Quick Links</h4>
            {[
              { to: "/", label: "Home" },
              { to: "/products", label: "Products" },
              { to: "/gallery", label: "Gallery" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
              { to: "/analyse", label: "AI Analyse" },
            ].map((link) => (
              <Link key={link.to} to={link.to} style={F.footerLink}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div style={F.linkCol}>
            <h4 style={F.colTitle}>Categories</h4>
            {[
              { to: "/curtain-section", label: "Curtains" },
              { to: "/bedsheet-section", label: "Bedsheets" },
              { to: "/sofa-cover-section", label: "Sofa Covers" },
              { to: "/pillow-cover-section", label: "Pillow Covers" },
              { to: "/doormat-section", label: "Doormats" },
            ].map((link) => (
              <Link key={link.to} to={link.to} style={F.footerLink}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Newsletter */}
          <div style={F.newsletterCol}>
            <h4 style={F.colTitle}>Stay Updated</h4>
            <p style={F.newsletterText}>
              Get exclusive deals and interior inspiration directly in your inbox.
            </p>
            <form
              style={F.newsletterForm}
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for subscribing! 🎉");
              }}
            >
              <input
                type="email"
                placeholder="Your email"
                style={F.emailInput}
                required
                id="newsletter-email"
              />
              <button type="submit" style={F.subscribeBtn}>
                →
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div style={F.divider}></div>

        {/* Bottom */}
        <div style={F.bottom}>
          <p style={F.copyright}>
            © {currentYear} JP Furnishing. All rights reserved.
          </p>
          <div style={F.bottomLinks}>
            <Link to="/privacy" style={F.bottomLink}>Privacy Policy</Link>
            <span style={F.dot}>·</span>
            <Link to="/terms" style={F.bottomLink}>Terms & Conditions</Link>
            <span style={F.dot}>·</span>
            <Link to="/faq" style={F.bottomLink}>FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

const F = {
  footer: {
    background: "#1c1917",
    color: "#d6d3d1",
    padding: "72px 24px 32px",
  },
  container: {
    maxWidth: 1320,
    margin: "0 auto",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "40px 48px",
    marginBottom: 48,
  },
  brandCol: {
    maxWidth: 320,
  },
  brandName: {
    fontSize: "1.8rem",
    fontWeight: 800,
    color: "#cfa32c",
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    marginBottom: 14,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  brandTagline: {
    fontSize: "0.92rem",
    lineHeight: 1.7,
    color: "#a8a29e",
    marginBottom: 20,
  },
  socialRow: {
    display: "flex",
    gap: 10,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "rgba(107,67,44,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.1rem",
    textDecoration: "none",
    transition: "all 0.2s",
    color: "#6b432c",
    border: "1px solid rgba(107,67,44,0.15)",
  },
  linkCol: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  colTitle: {
    fontSize: "1rem",
    fontWeight: 700,
    color: "#e7e5e4",
    marginBottom: 6,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  footerLink: {
    color: "#a8a29e",
    textDecoration: "none",
    fontSize: "0.92rem",
    transition: "color 0.2s",
    padding: "2px 0",
  },
  newsletterCol: {
    maxWidth: 300,
  },
  newsletterText: {
    fontSize: "0.88rem",
    color: "#a8a29e",
    lineHeight: 1.6,
    marginBottom: 14,
  },
  newsletterForm: {
    display: "flex",
    gap: 0,
    borderRadius: 12,
    overflow: "hidden",
    border: "1px solid rgba(207,163,44,0.3)",
  },
  emailInput: {
    flex: 1,
    padding: "12px 16px",
    border: "none",
    background: "rgba(255,255,255,0.06)",
    color: "#e7e5e4",
    fontSize: "0.9rem",
    outline: "none",
    fontFamily: "inherit",
  },
  subscribeBtn: {
    padding: "12px 18px",
    background: "#cfa32c",
    color: "#1c1917",
    border: "none",
    fontWeight: 700,
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  divider: {
    height: 1,
    background: "rgba(255,255,255,0.08)",
    marginBottom: 24,
  },
  bottom: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  copyright: {
    fontSize: "0.85rem",
    color: "#78716c",
    margin: 0,
  },
  bottomLinks: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  bottomLink: {
    color: "#78716c",
    textDecoration: "none",
    fontSize: "0.85rem",
    transition: "color 0.2s",
  },
  dot: {
    color: "#57534e",
  },
};

export default Footer;