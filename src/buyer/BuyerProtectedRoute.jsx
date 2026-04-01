// src/pages/buyer/BuyerProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function BuyerProtectedRoute({ children }) {
  const token = localStorage.getItem("buyerToken");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}