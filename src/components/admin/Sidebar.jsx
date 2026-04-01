// src/components/admin/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./admin.css";

function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/products">Products</Link></li>
        <li><Link to="/admin/orders">Orders</Link></li>
        <li><Link to="/admin/users">Users</Link></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
