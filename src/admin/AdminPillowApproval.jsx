import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminPillowApproval() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "allPillowOrders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const orderList = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setOrders(orderList);
      },
      (error) => {
        console.error("Error fetching pillow orders:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleApprove = async (order) => {
    try {
      await updateDoc(doc(db, "allPillowOrders", order.id), {
        approvalStatus: "approved",
        adminApproved: true,
        isUnavailable: true,
        approvedAt: serverTimestamp(),
      });

      if (order.customerPhone) {
        await setDoc(
          doc(db, "pillowOrders", `${order.productId}_${order.customerPhone}`),
          {
            approvalStatus: "approved",
            adminApproved: true,
            isUnavailable: true,
            approvedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      await setDoc(
        doc(db, "productAvailability", `pillow_${order.productId}`),
        {
          productId: order.productId,
          productType: "pillow",
          productName: order.productName || `Pillow ${order.productId}`,
          isUnavailable: true,
          approvedByAdmin: true,
          approvalStatus: "approved",
          approvedAt: serverTimestamp(),
          lastCustomerName: order.customerName || "",
          lastCustomerPhone: order.customerPhone || "",
          lastCustomerAddress: order.customerAddress || "",
        },
        { merge: true }
      );

      alert("Approved successfully. Product is now unavailable.");
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve pillow order.");
    }
  };

  const handleMakeAvailable = async (order) => {
    try {
      await updateDoc(doc(db, "allPillowOrders", order.id), {
        approvalStatus: "available",
        adminApproved: false,
        isUnavailable: false,
        availableAt: serverTimestamp(),
      });

      if (order.customerPhone) {
        await setDoc(
          doc(db, "pillowOrders", `${order.productId}_${order.customerPhone}`),
          {
            approvalStatus: "available",
            adminApproved: false,
            isUnavailable: false,
            availableAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      await setDoc(
        doc(db, "productAvailability", `pillow_${order.productId}`),
        {
          productId: order.productId,
          productType: "pillow",
          productName: order.productName || `Pillow ${order.productId}`,
          isUnavailable: false,
          approvedByAdmin: false,
          approvalStatus: "available",
          availableAt: serverTimestamp(),
          lastCustomerName: order.customerName || "",
          lastCustomerPhone: order.customerPhone || "",
          lastCustomerAddress: order.customerAddress || "",
        },
        { merge: true }
      );

      alert("Product is now marked as available.");
    } catch (error) {
      console.error("Availability update error:", error);
      alert("Failed to make product available.");
    }
  };

  const getStatusStyle = (order) => {
    if (order.isUnavailable === true && order.adminApproved === true) {
      return {
        background: "#ffe5e5",
        color: "#b42318",
        border: "1px solid #f5b5b5",
      };
    }

    if (order.approvalStatus === "available") {
      return {
        background: "#e8f8ec",
        color: "#137333",
        border: "1px solid #b7e1c1",
      };
    }

    return {
      background: "#fff6db",
      color: "#8a6700",
      border: "1px solid #ecd58a",
    };
  };

  const getStatusText = (order) => {
    if (order.isUnavailable === true && order.adminApproved === true) {
      return "Unavailable";
    }

    if (order.approvalStatus === "available") {
      return "Available";
    }

    return "Pending Approval";
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerWrap}>
        <p style={styles.subHeading}>JP FURNISHING HOUSE</p>
        <h1 style={styles.heading}>Admin Pillow Approval</h1>
        <p style={styles.description}>
          Approve pillow orders to make products unavailable, or mark them
          available again when needed.
        </p>
      </div>

      <div style={styles.grid}>
        {orders.length === 0 ? (
          <div style={styles.emptyBox}>No pillow orders found.</div>
        ) : (
          orders.map((order) => (
            <div key={order.id} style={styles.card}>
              <img
                src={
                  order.image ||
                  "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80"
                }
                alt={order.productName || "Pillow"}
                style={styles.image}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80";
                }}
              />

              <div style={styles.content}>
                <h2 style={styles.productTitle}>
                  {order.productName || `Pillow ${order.productId}`}
                </h2>

                <div
                  style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(order),
                  }}
                >
                  {getStatusText(order)}
                </div>

                <p style={styles.info}>
                  <strong>Product ID:</strong> {order.productId}
                </p>
                <p style={styles.info}>
                  <strong>Customer Name:</strong> {order.customerName}
                </p>
                <p style={styles.info}>
                  <strong>Phone:</strong> {order.customerPhone}
                </p>
                <p style={styles.info}>
                  <strong>Address:</strong> {order.customerAddress}
                </p>
                <p style={styles.info}>
                  <strong>Quantity:</strong> {order.quantity}
                </p>
                <p style={styles.info}>
                  <strong>Price:</strong> {order.price}
                </p>
                <p style={styles.info}>
                  <strong>WhatsApp Status:</strong>{" "}
                  {order.whatsappStatus || "initiated"}
                </p>

                <div style={styles.buttonRow}>
                  <button
                    style={styles.approveBtn}
                    onClick={() => handleApprove(order)}
                  >
                    Approve
                  </button>

                  <button
                    style={styles.availableBtn}
                    onClick={() => handleMakeAvailable(order)}
                  >
                    Make Available
                  </button>
                </div>
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
    background: "#f7f1eb",
    padding: "32px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  headerWrap: {
    marginBottom: "28px",
  },
  subHeading: {
    margin: "0 0 10px 0",
    color: "#b56a2d",
    fontWeight: 800,
    letterSpacing: "1px",
    textTransform: "uppercase",
    fontSize: "14px",
  },
  heading: {
    margin: "0 0 10px 0",
    fontSize: "40px",
    color: "#2b1205",
    fontWeight: 800,
  },
  description: {
    margin: 0,
    fontSize: "16px",
    color: "#6b584c",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "22px",
  },
  emptyBox: {
    background: "#fff",
    borderRadius: "18px",
    padding: "26px",
    fontSize: "18px",
    color: "#5a4638",
    boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
  },
  card: {
    background: "#fff",
    borderRadius: "22px",
    overflow: "hidden",
    boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
    border: "1px solid rgba(91,46,18,0.08)",
  },
  image: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    display: "block",
  },
  content: {
    padding: "20px",
  },
  productTitle: {
    margin: "0 0 12px 0",
    fontSize: "24px",
    color: "#2b1205",
    fontWeight: 800,
    lineHeight: 1.2,
  },
  statusBadge: {
    display: "inline-block",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 800,
    marginBottom: "14px",
  },
  info: {
    margin: "8px 0",
    fontSize: "15px",
    color: "#4b392d",
    lineHeight: 1.5,
  },
  buttonRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "18px",
  },
  approveBtn: {
    background: "#7a2f17",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
  },
  availableBtn: {
    background: "#1f7a3f",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 18px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
  },
};