import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="brand">{product.brand}</p>
      <p className="price">₹{product.price}</p>
      <button className="view-btn" onClick={handleViewDetails}>
        View Details
      </button>
    </div>
  );
}

export default ProductCard;


// import React from 'react';

// const CardStyle = {
//   card: {
//     backgroundColor: 'var(--color-bg-secondary)',
//     borderRadius: 'var(--border-radius)',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
//     transition: 'transform 0.3s, box-shadow 0.3s',
//     overflow: 'hidden',
//     display: 'flex',
//     flexDirection: 'column',
//     cursor: 'pointer',
//   },
//   cardHover: {
//     transform: 'translateY(-5px)',
//     boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
//   },
//   image: {
//     width: '100%',
//     height: '200px',
//     objectFit: 'cover',
//     borderBottom: `1px solid var(--color-bg-main)`,
//   },
//   content: {
//     padding: '1rem',
//     flexGrow: 1,
//     display: 'flex',
//     flexDirection: 'column',
//   },
//   title: {
//     fontSize: '1.1rem',
//     fontWeight: 600,
//     marginBottom: '0.5rem',
//     color: 'var(--color-text-primary)',
//   },
//   price: {
//     fontSize: '1.25rem',
//     fontWeight: 700,
//     color: 'var(--color-accent-gold)',
//     marginTop: 'auto',
//   },
//   category: {
//     fontSize: '0.8rem',
//     color: 'var(--color-accent-green)',
//     marginBottom: '0.5rem',
//     textTransform: 'uppercase',
//   }
// };

// function ProductCard({ product }) {
//   const [isHovered, setIsHovered] = React.useState(false);

//   return (
//     <div 
//       style={{...CardStyle.card, ...(isHovered ? CardStyle.cardHover : {})}}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <img src={product.image} alt={product.name} style={CardStyle.image} />
//       <div style={CardStyle.content}>
//         <div style={CardStyle.category}>{product.category}</div>
//         <div style={CardStyle.title}>{product.name}</div>
//         <div style={CardStyle.price}>${product.price.toFixed(2)}</div>
//         {/* Placeholder for Add to Cart Button */}
//         <button className="btn-primary" style={{marginTop: '1rem', backgroundColor: 'var(--color-accent-green)'}}>View Details</button>
//       </div>
//     </div>
//   );
// }

// export default ProductCard;