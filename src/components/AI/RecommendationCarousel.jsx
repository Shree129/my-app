import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * RecommendationCarousel — Horizontal scrollable product recommendations
 * Supports: "Recommended for You", "Because you viewed X", "Also Bought"
 */
export default function RecommendationCarousel({
  title = 'Recommended for You',
  subtitle = '',
  products = [],
  loading = false,
  onProductClick = null,
}) {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', checkScroll);
    return () => el?.removeEventListener('scroll', checkScroll);
  }, [products]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -320 : 320,
      behavior: 'smooth',
    });
  };

  const handleClick = (product) => {
    if (onProductClick) {
      onProductClick(product);
    } else if (product.product_id) {
      const routes = {
        curtain: '/curtain/',
        bedsheet: '/bedsheets/',
        sofa: '/sofa-cover/',
        sofa_cover: '/sofa-cover/',
        'cushion-cover': '/pillow-cover/',
        pillow_cover: '/pillow-cover/',
        doormat: '/doormat/',
      };
      const base = routes[product.category] || '/product/';
      navigate(`${base}${product.product_id}`);
    }
  };

  const getPrice = (product) => {
    return (
      product.final_price ??
      product.price ??
      product.rate ??
      product.mrp ??
      product.MRP ??
      null
    );
  };

  const getCategoryLabel = (category) => {
    const c = String(category || '').replace(/_/g, ' ').replace(/-/g, ' ');
    return c;
  };

  if (!loading && products.length === 0) return null;

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{title}</h2>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>

        <div style={styles.navBtns}>
          <button
            style={{ ...styles.arrowBtn, opacity: canScrollLeft ? 1 : 0.3 }}
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            ←
          </button>
          <button
            style={{ ...styles.arrowBtn, opacity: canScrollRight ? 1 : 0.3 }}
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
            →
          </button>
        </div>
      </div>

      <div ref={scrollRef} style={styles.scrollContainer}>
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={`skeleton-${i}`} style={styles.skeletonCard}>
                <div className="skeleton skeleton-image" style={{ height: 200 }}></div>
                <div style={{ padding: 16 }}>
                  <div className="skeleton skeleton-title"></div>
                  <div className="skeleton skeleton-text skeleton-text-sm"></div>
                </div>
              </div>
            ))
          : products.map((product, i) => (
              <div
                key={`${product.product_id}-${i}`}
                style={styles.card}
                onClick={() => handleClick(product)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)';
                }}
              >
                <div style={styles.imageWrap}>
                  <img
                    src={product.image || product.main_image}
                    alt={product.model_name || 'Product'}
                    style={styles.image}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://via.placeholder.com/300?text=JP+Furnishing';
                    }}
                  />

                  {product.category && (
                    <span style={styles.categoryBadge}>
                      {getCategoryLabel(product.category)}
                    </span>
                  )}

                  {product._score !== undefined && (
                    <span style={styles.matchBadge}>
                      {Math.round(product._score)}% match
                    </span>
                  )}
                </div>

                <div style={styles.cardContent}>
                  <h4 style={styles.productName}>
                    {product.model_name || 'Premium Product'}
                  </h4>

                  {product.color && (
                    <p style={styles.productMeta}>
                      {product.color} • {product.pattern || 'Classic'}
                    </p>
                  )}

                  {getPrice(product) !== null ? (
                    <p style={styles.productPrice}>
                      ₹{Number(getPrice(product)).toLocaleString()}
                    </p>
                  ) : (
                    <p style={styles.productPrice}>Price on request</p>
                  )}
                </div>
              </div>
            ))}
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '48px 0',
  },
  header: {
    maxWidth: '1320px',
    margin: '0 auto 24px',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  title: {
    fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
    color: '#3f2b20',
    fontWeight: 700,
    margin: 0,
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#78716c',
    margin: '4px 0 0',
  },
  navBtns: {
    display: 'flex',
    gap: 10,
  },
  arrowBtn: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    border: 'none',
    background: '#6b432c',
    color: '#fff',
    fontSize: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(107,67,44,0.2)',
  },
  scrollContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px 8px',
    display: 'flex',
    gap: 20,
    overflowX: 'auto',
    scrollBehavior: 'smooth',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  },
  card: {
    flex: '0 0 260px',
    background: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
  },
  imageWrap: {
    position: 'relative',
    height: 200,
    overflow: 'hidden',
    background: '#f5ece1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.4s ease',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    background: 'rgba(107, 67, 44, 0.85)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: '0.72rem',
    fontWeight: 600,
    textTransform: 'capitalize',
    backdropFilter: 'blur(4px)',
  },
  matchBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'rgba(34, 197, 94, 0.9)',
    color: '#fff',
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: '0.72rem',
    fontWeight: 600,
  },
  cardContent: {
    padding: '14px 16px 18px',
  },
  productName: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#292524',
    margin: '0 0 6px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  productMeta: {
    fontSize: '0.8rem',
    color: '#78716c',
    margin: '0 0 8px',
    textTransform: 'capitalize',
  },
  productPrice: {
    fontSize: '1.05rem',
    fontWeight: 700,
    color: '#6b432c',
    margin: 0,
  },
  skeletonCard: {
    flex: '0 0 260px',
    background: '#fff',
    borderRadius: 18,
    overflow: 'hidden',
  },
};