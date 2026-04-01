import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminSofaApproval() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  useEffect(() => {
    const ordersRef = collection(db, "sofaOrders");

    const unsub = onSnapshot(
      ordersRef,
      (snapshot) => {
        const list = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        list.sort((a, b) => {
          const aTime =
            a.requestedAt?.seconds ||
            a.createdAt?.seconds ||
            a.adminUpdatedAt?.seconds ||
            a.orderedAt?.seconds ||
            0;
          const bTime =
            b.requestedAt?.seconds ||
            b.createdAt?.seconds ||
            b.adminUpdatedAt?.seconds ||
            b.orderedAt?.seconds ||
            0;
          return bTime - aTime;
        });

        setOrders(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching sofa orders:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const handleApprove = async (order) => {
    try {
      setActionLoadingId(order.id);

      const orderId = order.id;
      const productId = String(order.productId || order.product_id || "");
      const productName =
        order.productName ||
        order.name ||
        order.model_name ||
        `Sofa ${productId}`;
      const price = Number(
        String(order.price || order.rate || order.MRP || 0).replace(/[^\d.]/g, "")
      );
      const buyerEmail = order.buyerEmail || "";
      const buyerName = order.buyerName || "";
      const address = order.address || "";
      const query = order.query || "";
      const fabricColor = order.fabricColor || order.fabric_color || "";
      const fabricType = order.fabricType || order.fabric_type || "";
      const material = order.material || "";
      const size = order.size || "";
      const style = order.style || "";

      await updateDoc(doc(db, "sofaOrders", orderId), {
        status: "approved",
        available: false,
        adminUpdatedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "productAvailability", `Sofa_${productId}`),
        {
          category: "Sofa",
          productId,
          productName,
          price,
          address,
          approvedForEmail: buyerEmail,
          buyerName,
          query,
          fabricColor,
          fabricType,
          material,
          size,
          style,
          isAvailable: false,
          status: "Not Available",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Sofa request approved successfully.");
    } catch (error) {
      console.error("Approval error:", error);
      alert("Failed to approve request.");
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReject = async (order) => {
    try {
      setActionLoadingId(order.id);

      const orderId = order.id;
      const productId = String(order.productId || order.product_id || "");
      const productName =
        order.productName ||
        order.name ||
        order.model_name ||
        `Sofa ${productId}`;
      const price = Number(
        String(order.price || order.rate || order.MRP || 0).replace(/[^\d.]/g, "")
      );
      const address = order.address || "";

      await updateDoc(doc(db, "sofaOrders", orderId), {
        status: "rejected",
        available: true,
        adminUpdatedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "productAvailability", `Sofa_${productId}`),
        {
          category: "Sofa",
          productId,
          productName,
          price,
          address,
          approvedForEmail: "",
          isAvailable: true,
          status: "Available",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      alert("Sofa request rejected successfully.");
    } catch (error) {
      console.error("Reject error:", error);
      alert("Failed to reject request.");
    } finally {
      setActionLoadingId("");
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading sofa requests...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.smallTitle}>Admin Panel</p>
        <h1 style={styles.heading}>Sofa Approval Requests</h1>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>No sofa requests found.</div>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order.id} style={styles.card}>
              <div style={styles.topRow}>
                <div>
                  <p style={styles.tag}>Sofa Request</p>
                  <h2 style={styles.title}>
                    {order.productName || order.name || "Sofa"}
                  </h2>
                </div>

                <span
                  style={{
                    ...styles.statusBadge,
                    background:
                      order.status === "approved"
                        ? "#2e7d32"
                        : order.status === "rejected"
                        ? "#d32f2f"
                        : "#f59e0b",
                  }}
                >
                  {order.status === "approved"
                    ? "Approved"
                    : order.status === "rejected"
                    ? "Rejected"
                    : "Pending"}
                </span>
              </div>

              <div style={styles.infoBox}>
                <p><strong>Product ID:</strong> {order.productId || order.product_id || "-"}</p>
                <p><strong>Buyer Name:</strong> {order.buyerName || "-"}</p>
                <p><strong>Buyer Email:</strong> {order.buyerEmail || "-"}</p>
                <p><strong>Address:</strong> {order.address || "-"}</p>
                <p><strong>Query:</strong> {order.query || "N/A"}</p>
                <p><strong>Price:</strong> {order.price || order.rate || "-"}</p>
                <p><strong>Fabric Color:</strong> {order.fabricColor || order.fabric_color || "-"}</p>
                <p><strong>Fabric Type:</strong> {order.fabricType || order.fabric_type || "-"}</p>
                <p><strong>Material:</strong> {order.material || "-"}</p>
                <p><strong>Style:</strong> {order.style || "-"}</p>
                <p><strong>Status:</strong> {order.status || "pending"}</p>
              </div>

              <div style={styles.buttonRow}>
                <button
                  style={{
                    ...styles.approveBtn,
                    opacity: actionLoadingId === order.id ? 0.7 : 1,
                    cursor: actionLoadingId === order.id ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleApprove(order)}
                  disabled={actionLoadingId === order.id}
                >
                  {actionLoadingId === order.id ? "Updating..." : "Approve"}
                </button>

                <button
                  style={{
                    ...styles.rejectBtn,
                    opacity: actionLoadingId === order.id ? 0.7 : 1,
                    cursor: actionLoadingId === order.id ? "not-allowed" : "pointer",
                  }}
                  onClick={() => handleReject(order)}
                  disabled={actionLoadingId === order.id}
                >
                  {actionLoadingId === order.id ? "Updating..." : "Reject"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f4ef 0%, #ece3d9 100%)",
    padding: "30px 20px",
  },
  header: {
    maxWidth: "1200px",
    margin: "0 auto 24px",
  },
  smallTitle: {
    margin: 0,
    color: "#a56a43",
    fontWeight: 700,
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontSize: "14px",
  },
  heading: {
    margin: "8px 0 0",
    fontSize: "40px",
    fontWeight: 900,
    color: "#1f2937",
  },
  loading: {
    padding: "40px",
    fontSize: "20px",
    fontWeight: 700,
  },
  empty: {
    maxWidth: "1200px",
    margin: "0 auto",
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    fontSize: "18px",
    fontWeight: 700,
    color: "#5f6b7a",
  },
  grid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gap: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "26px",
    padding: "24px",
    boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
    marginBottom: "18px",
  },
  tag: {
    margin: 0,
    color: "#a56a43",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    fontSize: "14px",
  },
  title: {
    margin: "8px 0 0",
    fontSize: "28px",
    fontWeight: 900,
    color: "#1f2937",
  },
  statusBadge: {
    color: "#fff",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: 800,
  },
  infoBox: {
    background: "#f9f5ef",
    borderRadius: "20px",
    padding: "18px",
    lineHeight: 1.9,
    color: "#2d3748",
    fontSize: "17px",
  },
  buttonRow: {
    display: "flex",
    gap: "14px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  approveBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 24px",
    fontWeight: 800,
    fontSize: "16px",
  },
  rejectBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 24px",
    fontWeight: 800,
    fontSize: "16px",
  },
};