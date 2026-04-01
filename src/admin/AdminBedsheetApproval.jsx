import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminBedsheetApproval() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [actionLoading, setActionLoading] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "bedsheetOrders"),
      (snapshot) => {
        const list = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));

        list.sort((a, b) => {
          const aTime = a.requestedAt?.seconds || 0;
          const bTime = b.requestedAt?.seconds || 0;
          return bTime - aTime;
        });

        setOrders(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching bedsheet orders:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === "all") return orders;
    return orders.filter(
      (item) => String(item.status || "pending").toLowerCase() === activeTab
    );
  }, [orders, activeTab]);

  const updateAvailability = async (
    productId,
    isAvailable,
    extra = {}
  ) => {
    const availabilityRef = doc(
      db,
      "productAvailability",
      `Bedsheet_${productId}`
    );

    await setDoc(
      availabilityRef,
      {
        productId: String(productId),
        category: "Bedsheet",
        isAvailable,
        updatedAt: serverTimestamp(),
        ...extra,
      },
      { merge: true }
    );
  };

  const handleApproveAvailable = async (order) => {
    const key = `${order.id}_approve_available`;
    try {
      setActionLoading(key);

      await updateDoc(doc(db, "bedsheetOrders", order.id), {
        status: "approved",
        adminDecision: "available",
        available: true,
        updatedAt: serverTimestamp(),
      });

      await updateAvailability(order.product_id || order.productId, true, {
        adminDecision: "available",
        orderId: order.id,
      });
    } catch (error) {
      console.error("Error approving as available:", error);
      alert("Failed to mark as available.");
    } finally {
      setActionLoading("");
    }
  };

  const handleApproveUnavailable = async (order) => {
    const key = `${order.id}_approve_unavailable`;
    try {
      setActionLoading(key);

      await updateDoc(doc(db, "bedsheetOrders", order.id), {
        status: "approved",
        adminDecision: "unavailable",
        available: false,
        updatedAt: serverTimestamp(),
      });

      await updateAvailability(order.product_id || order.productId, false, {
        adminDecision: "unavailable",
        orderId: order.id,
      });
    } catch (error) {
      console.error("Error approving as unavailable:", error);
      alert("Failed to mark as unavailable.");
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (order) => {
    const key = `${order.id}_reject`;
    try {
      setActionLoading(key);

      await updateDoc(doc(db, "bedsheetOrders", order.id), {
        status: "rejected",
        adminDecision: "rejected",
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error rejecting order:", error);
      alert("Failed to reject order.");
    } finally {
      setActionLoading("");
    }
  };

  return (
    <section style={styles.page}>
      <div style={styles.wrapper}>
        <div style={styles.topbar}>
          <div>
            <p style={styles.smallTitle}>JP Furnishing House</p>
            <h1 style={styles.heading}>Admin Bedsheet Approval</h1>
            <p style={styles.subText}>
              Approve requests and control product availability for buyers.
            </p>
          </div>
        </div>

        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === "all" ? styles.activeTabBtn : {}),
            }}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>

          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === "pending" ? styles.activeTabBtn : {}),
            }}
            onClick={() => setActiveTab("pending")}
          >
            Pending
          </button>

          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === "approved" ? styles.activeTabBtn : {}),
            }}
            onClick={() => setActiveTab("approved")}
          >
            Approved
          </button>

          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === "rejected" ? styles.activeTabBtn : {}),
            }}
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
          </button>
        </div>

        {loading ? (
          <div style={styles.emptyBox}>Loading bedsheet orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={styles.emptyBox}>No bedsheet orders found.</div>
        ) : (
          <div style={styles.grid}>
            {filteredOrders.map((order) => {
              const productId = order.product_id || order.productId;
              const isApproved = order.status === "approved";
              const isRejected = order.status === "rejected";

              return (
                <div key={order.id} style={styles.card}>
                  <div style={styles.imageWrap}>
                    <img
                      src={
                        order.image ||
                        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={order.productName || "Bedsheet"}
                      style={styles.image}
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
                      }}
                    />
                  </div>

                  <div style={styles.content}>
                    <p style={styles.brand}>JP Furnishing House</p>
                    <h3 style={styles.title}>
                      {order.productName || `Bedsheet ${productId}`}
                    </h3>

                    <div style={styles.badgeRow}>
                      <span
                        style={{
                          ...styles.badge,
                          ...(order.status === "approved"
                            ? styles.approvedBadge
                            : order.status === "rejected"
                            ? styles.rejectedBadge
                            : styles.pendingBadge),
                        }}
                      >
                        {order.status || "pending"}
                      </span>

                      {typeof order.available === "boolean" && (
                        <span
                          style={{
                            ...styles.badge,
                            ...(order.available
                              ? styles.availableBadge
                              : styles.unavailableBadge),
                          }}
                        >
                          {order.available ? "Available" : "Unavailable"}
                        </span>
                      )}
                    </div>

                    <div style={styles.infoBox}>
                      <p><strong>Product ID:</strong> {productId || "-"}</p>
                      <p><strong>Price:</strong> ₹ {order.price || order.rate || 0}</p>
                      <p><strong>Buyer:</strong> {order.buyerName || "-"}</p>
                      <p><strong>Email:</strong> {order.buyerEmail || "-"}</p>
                      <p><strong>Address:</strong> {order.address || "-"}</p>
                      <p><strong>Query:</strong> {order.query || "N/A"}</p>
                    </div>

                    <div style={styles.buttonRow}>
                      <button
                        style={{
                          ...styles.actionBtn,
                          ...styles.availableBtn,
                        }}
                        onClick={() => handleApproveAvailable(order)}
                        disabled={!!actionLoading || isRejected}
                      >
                        {actionLoading === `${order.id}_approve_available`
                          ? "Updating..."
                          : "Approve + Available"}
                      </button>

                      <button
                        style={{
                          ...styles.actionBtn,
                          ...styles.unavailableBtn,
                        }}
                        onClick={() => handleApproveUnavailable(order)}
                        disabled={!!actionLoading || isRejected}
                      >
                        {actionLoading === `${order.id}_approve_unavailable`
                          ? "Updating..."
                          : "Approve + Unavailable"}
                      </button>

                      <button
                        style={{
                          ...styles.actionBtn,
                          ...styles.rejectBtn,
                        }}
                        onClick={() => handleReject(order)}
                        disabled={!!actionLoading || isApproved}
                      >
                        {actionLoading === `${order.id}_reject`
                          ? "Updating..."
                          : "Reject"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f4ef 0%, #efe5db 100%)",
    padding: "32px 20px 60px",
  },

  wrapper: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  topbar: {
    marginBottom: "24px",
  },

  smallTitle: {
    margin: 0,
    color: "#a56a43",
    fontWeight: "800",
    letterSpacing: "1.5px",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  heading: {
    margin: "8px 0 8px",
    fontSize: "38px",
    color: "#2f1e14",
    fontWeight: "900",
  },

  subText: {
    margin: 0,
    color: "#6b5b52",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  tabs: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },

  tabBtn: {
    background: "#fff",
    border: "1px solid #d9cabc",
    color: "#2f1e14",
    borderRadius: "12px",
    padding: "10px 18px",
    fontWeight: "800",
    cursor: "pointer",
  },

  activeTabBtn: {
    background: "#2f1e14",
    color: "#fff",
    border: "1px solid #2f1e14",
  },

  emptyBox: {
    background: "#fff",
    borderRadius: "18px",
    padding: "30px",
    textAlign: "center",
    color: "#5e5047",
    fontWeight: "700",
    boxShadow: "0 10px 30px rgba(46, 28, 18, 0.08)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "22px",
  },

  card: {
    background: "#fff",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 14px 35px rgba(46, 28, 18, 0.10)",
    border: "1px solid rgba(139, 94, 60, 0.10)",
  },

  imageWrap: {
    height: "240px",
    background: "#f7efe7",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  content: {
    padding: "20px",
  },

  brand: {
    margin: "0 0 8px",
    color: "#a56a43",
    fontWeight: "800",
    letterSpacing: "1.2px",
    fontSize: "12px",
    textTransform: "uppercase",
  },

  title: {
    margin: "0 0 12px",
    color: "#2f1e14",
    fontSize: "26px",
    fontWeight: "900",
  },

  badgeRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },

  badge: {
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "800",
  },

  pendingBadge: {
    background: "#fef3c7",
    color: "#92400e",
  },

  approvedBadge: {
    background: "#dcfce7",
    color: "#166534",
  },

  rejectedBadge: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  availableBadge: {
    background: "#dcfce7",
    color: "#166534",
  },

  unavailableBadge: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  infoBox: {
    background: "#faf6f1",
    borderRadius: "16px",
    padding: "14px",
    color: "#5e5047",
    lineHeight: "1.8",
    fontSize: "14px",
    marginBottom: "16px",
  },

  buttonRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  actionBtn: {
    border: "none",
    borderRadius: "12px",
    padding: "12px 16px",
    fontWeight: "800",
    cursor: "pointer",
    color: "#fff",
  },

  availableBtn: {
    background: "#166534",
  },

  unavailableBtn: {
    background: "#b45309",
  },

  rejectBtn: {
    background: "#991b1b",
  },
};