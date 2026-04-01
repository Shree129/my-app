// src/components/ProfileMenu.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => navigate("/login")}
        style={styles.loginBtn}
      >
        Login 
      </button>
    </div>
  );
}

const styles = {
  loginBtn: {
    padding: "10px 16px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #cfa32c, #e0b24a)",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "14px",
  },
};