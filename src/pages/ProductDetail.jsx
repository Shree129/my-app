import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../data/product";
import "./ProductDetail.css";
import { useCart } from "../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <h2 className="product-not-found">Product not found!</h2>;
  }

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/checkout");
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-detail-card">
          <div className="image-section">
            <div className="image-wrapper">
              <img src={product.image} alt={product.name} />
            </div>
          </div>

          <div className="info-section">
            <p className="detail-label">{product.brand || "JP Furnishing"}</p>

            <h1 className="product-title">{product.name}</h1>

            <p className="price">₹{product.price}</p>

            <p className="desc">
              {product.description ||
                "Experience premium quality furnishing designed to bring elegance, comfort, and timeless charm to your home interiors."}
            </p>

            {product.specifications && (
              <div className="specs-section">
                <h3 className="spec-heading">Product Details</h3>

                <div className="specs">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div className="spec-row" key={key}>
                      <span className="spec-key">{key}</span>
                      <span className="spec-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="buttons">
              <button className="cart-btn" onClick={() => addToCart(product)}>
                Add to Cart
              </button>
              <button className="buy-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;