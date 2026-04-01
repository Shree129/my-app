import React from "react";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleConfirm = () => {
    alert("Order placed successfully!");
    clearCart();
  };

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      <p>Total Amount: ₹{total}</p>
      <button onClick={handleConfirm}>Confirm Purchase</button>
    </div>
  );
}

export default Checkout;
