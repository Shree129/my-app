// src/components/admin/Navbar.jsx
import React from "react";
import "./admin.css";

function Navbar() {
  return (
    <nav className="admin-navbar">
      <h2>J.P. Admin Dashboard</h2>
      <div className="admin-nav-actions">
        <button>Settings</button>
        <button>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
