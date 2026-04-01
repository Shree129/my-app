import React, { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import SmartSearch from "../Search/SmartSearch";
import logo from "../../assets/logo.png";
import "./Header.css";

/**
 * Header — Responsive navigation with mobile drawer, search, and cart badge
 * 
 * Features:
 * - Logo on left, nav links with icons on desktop
 * - Mobile hamburger menu with smooth dropdown
 * - Flexbox layout, fully responsive
 * - Smooth transitions and accessibility features
 */
function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cartItems } = useCart();

  const cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  // Track scroll for header transparency
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const navLinks = [
    { to: "/", label: "Home", icon: "🏠" },
    { to: "/about", label: "About Us", icon: "❤️" },
    { to: "/gallery", label: "Gallery", icon: "🖼️" },
    { to: "/products", label: "Products", icon: "📂" },
    { to: "/analyse", label: "Analyse AI", icon: "✨" },
    { to: "/contact", label: "Contact", icon: " 📞" },
    { to: "/categories", label: "Categories", icon: "🏷️" },
    { to: "/cart", label: "Cart", icon: "🛒" },
    { to: "/orders", label: "Orders", icon: "📦" },
    { to: "/profile", label: "Profile", icon: "👤" },
    { to: "/wishlist", label: "Wishlist", icon: "❤️" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          {/* Logo */}
          <Link to="/" className="header-logo" aria-label="JP Furnishing Home">
            <img src={logo} alt="JP Furnishing" className="logo-image" />
            <span className="logo-text">JP Furnishing</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="desktop-nav" aria-label="Main navigation">
            <ul className="nav-list">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`nav-link ${isActive(link.to) ? "active" : ""}`}
                    aria-current={isActive(link.to) ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="header-actions">
            {/* Search */}
            <button
              className="icon-button search-button"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
              title="Search products"
            >
              🔍
            </button>

            {/* Cart (Desktop) */}
            <Link
              to="/cart"
              className="icon-button cart-button"
              aria-label={`Cart (${cartCount} items)`}
              title="View cart"
            >
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>

            {/* Login (Desktop) */}
            <Link
              to="/login"
              className="login-button"
              aria-label="Login or Sign Up"
              title="Login or Sign Up"
            >
              Login
            </Link>

            {/* Mobile Hamburger (Visible on Mobile) */}
            <button
              className={`hamburger-menu ${isMobileMenuOpen ? "open" : ""}`}
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
          role="presentation"
        ></div>
      )}

      {/* Mobile Drawer */}
      <nav
        id="mobile-drawer"
        className={`mobile-drawer ${isMobileMenuOpen ? "open" : ""}`}
        role="navigation"
        aria-label="Mobile navigation"
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="drawer-header">
          <span className="drawer-logo">JP Furnishing</span>
          <button
            className="drawer-close"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            title="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="drawer-list">
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`drawer-link ${isActive(link.to) ? "active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-current={isActive(link.to) ? "page" : undefined}
              >
                <span className="drawer-icon">{link.icon}</span>
                <span className="drawer-label">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="drawer-footer">
          <Link
            to="/login"
            className="drawer-login-button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Login or Sign Up"
          >
            Login / Sign Up
          </Link>
        </div>
      </nav>

      {/* Smart Search Overlay */}
      <SmartSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default Header;