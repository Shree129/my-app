import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. <Link to="/products">Shop now</Link></p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>Brand: {item.brand}</p>
                  <p>Qty: {item.qty}</p>
                  <p>Price: ₹{item.price * item.qty}</p>
                  <button onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>
            <button className="buy-btn"><Link to="/checkout">Buy Now</Link></button>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
