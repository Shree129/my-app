import React from 'react';
import { useNavigate } from 'react-router-dom';
import masterCatalog from '../../buyer/masterCatalog';

/**
 * AutoScrollSlider — Infinite horizontal scrolling product showoff
 * Smooth, hardware-accelerated, and pauses on hover.
 */
export default function AutoScrollSlider() {
  const navigate = useNavigate();

  const sliderProducts = masterCatalog.slice(0, 12);
  const doubleProducts = [...sliderProducts, ...sliderProducts];

  const getCategoryLabel = (product) => {
    const name = (product.model_name || '').toLowerCase();
    const category = (product.category || '').toLowerCase();

    if (name.includes('cushion')) return 'CUSHION COVER';
    if (category === 'cushion-cover') return 'CUSHION COVER';
    if (category === 'doormat') return 'DOORMAT';
    if (category === 'curtain') return 'CURTAIN';
    if (category === 'bedsheet') return 'BEDSHEET';
    if (category === 'sofa') return 'SOFA';

    return (product.category || '').replace(/-/g, ' ').toUpperCase();
  };

  const getPrice = (product) => {
    return (
      product.final_price ??
      product.price ??
      product.rate ??
      product.mrp ??
      product.MRP ??
      0
    );
  };

  return (
    <div style={S.sliderContainer}>
      <h3 style={S.sliderTitle}>Trending Now</h3>

      <div style={S.sliderWrapper} className="slider-wrapper">
        <div style={S.sliderTrack} className="slider-track">
          {doubleProducts.map((product, index) => (
            <div
              key={`${product.product_id}-${index}`}
              style={S.productCard}
              onClick={() => navigate('/login')}
            >
              <div style={S.imageBox}>
                <img
                  src={product.image}
                  alt={product.model_name}
                  style={S.image}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300';
                  }}
                />
              </div>

              <div style={S.info}>
                <span style={S.category}>{getCategoryLabel(product)}</span>
                <h4 style={S.name}>{product.model_name}</h4>
                {/* <p style={S.price}>₹{getPrice(product)}</p> */}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-300px * ${sliderProducts.length})); }
        }

        .slider-track {
          animation: scroll 40s linear infinite;
          width: calc(300px * ${doubleProducts.length});
        }

        .slider-wrapper:hover .slider-track {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .slider-track {
            animation-duration: 25s;
          }
        }
      `}</style>
    </div>
  );
}

const S = {
  sliderContainer: {
    padding: '60px 0',
    background: '#fdfcfb',
    overflow: 'hidden',
    borderBottom: '1px solid #efeae4',
  },
  sliderTitle: {
    textAlign: 'center',
    fontSize: '1.4rem',
    color: '#8b5e34',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '30px',
    fontWeight: 700,
  },
  sliderWrapper: {
    display: 'flex',
    overflow: 'hidden',
    maskImage:
      'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
  },
  sliderTrack: {
    display: 'flex',
    gap: '20px',
    padding: '10px 20px',
  },
  productCard: {
    width: '280px',
    flexShrink: 0,
    background: '#fff',
    borderRadius: '16px',
    padding: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  imageBox: {
    width: '100%',
    height: '200px',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '12px',
    background: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
  },
  info: {
    textAlign: 'center',
  },
  category: {
    fontSize: '0.75rem',
    color: '#a07844',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: 600,
  },
  name: {
    fontSize: '1rem',
    color: '#333',
    margin: '4px 0',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  price: {
    fontSize: '1.1rem',
    color: '#6b432c',
    fontWeight: 700,
  },
};