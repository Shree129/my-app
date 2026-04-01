import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminDoormatApproval() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "allDoormatOrders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setOrders(list);
    });

    return () => unsub();
  }, []);

  const approveUnavailable = async (order) => {
    try {
      await updateDoc(doc(db, "allDoormatOrders", order.id), {
        adminApproval: "approved",
        productStatus: "unavailable",
        approvedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "doormatProductStatus", String(order.productId)),
        {
          productId: order.productId,
          productName: order.productName,
          available: false,
          updatedAt: serverTimestamp(),
          updatedFrom: "admin_doormat_approval",
        },
        { merge: true }
      );

      alert("Approved. Product is now unavailable on buyer side.");
    } catch (error) {
      console.error("Approve unavailable error:", error);
      alert("Failed to approve.");
    }
  };

  const makeAvailable = async (order) => {
    try {
      await updateDoc(doc(db, "allDoormatOrders", order.id), {
        productStatus: "available",
        madeAvailableAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "doormatProductStatus", String(order.productId)),
        {
          productId: order.productId,
          productName: order.productName,
          available: true,
          updatedAt: serverTimestamp(),
          updatedFrom: "admin_doormat_approval",
        },
        { merge: true }
      );

      alert("Product marked available again.");
    } catch (error) {
      console.error("Make available error:", error);
      alert("Failed to update availability.");
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Admin Doormat Approval</h1>

      <div style={styles.grid}>
        {orders.length === 0 ? (
          <p style={styles.emptyText}>No doormat orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={styles.card}>
              <img
                src={order.productImage}
                alt={order.productName}
                style={styles.image}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80";
                }}
              />

              <h2 style={styles.title}>{order.productName}</h2>
              <p><strong>Product ID:</strong> {order.productId}</p>
              <p><strong>Price:</strong> ₹ {order.price}</p>
              <p><strong>Quantity:</strong> {order.quantity}</p>
              <p><strong>Name:</strong> {order.customerName}</p>
              <p><strong>Phone:</strong> {order.customerPhone}</p>
              <p><strong>Address:</strong> {order.customerAddress}</p>

              <div style={styles.badgeWrap}>
                <span style={styles.badge}>
                  Approval: {order.adminApproval || "pending"}
                </span>
                <span style={styles.badge}>
                  Status: {order.productStatus || "available"}
                </span>
              </div>

              <div style={styles.btnRow}>
                <button
                  style={styles.approveBtn}
                  onClick={() => approveUnavailable(order)}
                >
                  Approve Unavailable
                </button>

                <button
                  style={styles.availableBtn}
                  onClick={() => makeAvailable(order)}
                >
                  Make Available
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8f3ee",
    padding: "30px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "40px",
    marginBottom: "24px",
    color: "#2c1608",
    fontWeight: "800",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  emptyText: {
    fontSize: "18px",
    color: "#6b5b4d",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  image: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "14px",
    marginBottom: "14px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    color: "#2c1608",
    marginBottom: "10px",
  },
  badgeWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "14px",
    marginBottom: "14px",
  },
  badge: {
    background: "#f3e6d8",
    color: "#6d3f16",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: "700",
    fontSize: "14px",
  },
  btnRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "14px",
  },
  approveBtn: {
    padding: "12px 16px",
    background: "#7a1f1f",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
  availableBtn: {
    padding: "12px 16px",
    background: "#1f7a3a",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
  },
};