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

export default function AdminCurtainApproval() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  useEffect(() => {
    const ordersRef = collection(db, "curtainOrders");

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
            0;

          const bTime =
            b.requestedAt?.seconds ||
            b.createdAt?.seconds ||
            b.adminUpdatedAt?.seconds ||
            0;

          return bTime - aTime;
        });

        setOrders(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching curtain orders:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const getIds = (order) => {
    const rawProductId = String(
      order.productId || order.product_id || ""
    ).trim();

    if (!rawProductId) {
      return {
        rawProductId: "",
        normalizedProductId: "",
      };
    }

    const parsed = parseInt(rawProductId, 10);
    const normalizedProductId = Number.isNaN(parsed)
      ? rawProductId
      : String(parsed);

    return { rawProductId, normalizedProductId };
  };

  const handleApprove = async (order) => {
    try {
      setActionLoadingId(order.id);

      const orderId = order.id;
      const { rawProductId, normalizedProductId } = getIds(order);

      if (!orderId) {
        throw new Error("Order ID missing.");
      }

      if (!rawProductId) {
        throw new Error("Product ID missing in this order.");
      }

      const productName =
        order.productName ||
        order.name ||
        order.model_name ||
        `Curtain ${rawProductId}`;

      const buyerEmail =
        order.buyerEmail || order.customerEmail || order.email || "";

      const buyerName =
        order.buyerName || order.customerName || order.customerName || "";

      const address =
        order.address || order.customerAddress || order.deliveryAddress || "";

      const query = order.query || "";
      const selectedHeight = order.selectedHeight || order.size || "";
      const fabricColor = order.fabricColor || order.fabric_color || "";
      const fabricType =
        order.fabricType || order.fabric_type || order.material || "";
      const style = order.style || "";
      const material = order.material || order.fabric_type || "";
      const quantity = Number(order.quantity || 1);
      const image = order.image || "";

      const cleanedPriceString = String(
        order.selectedPrice || order.price || order.rate || order.MRP || 0
      ).replace(/[^\d.]/g, "");
      const price = Number(cleanedPriceString || 0);

      console.log("APPROVE ORDER:", order);
      console.log("rawProductId:", rawProductId);
      console.log("normalizedProductId:", normalizedProductId);

      await updateDoc(doc(db, "curtainOrders", orderId), {
        status: "approved",
        approvalStatus: "approved",
        available: false,
        adminUpdatedAt: serverTimestamp(),
        approvedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "allCurtainOrders", orderId),
        {
          orderId,
          product_id: rawProductId,
          productId: rawProductId,
          normalizedProductId,
          productName,
          name: productName,
          buyerName,
          buyerEmail,
          address,
          query,
          selectedHeight,
          selectedPrice: price,
          fabricColor,
          fabricType,
          style,
          material,
          quantity,
          image,
          price,
          category: "Curtain",
          status: "Not Available",
          approvalStatus: "approved",
          available: false,
          approved: true,
          approvedAt: serverTimestamp(),
          adminUpdatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "productAvailability", `Curtain_${rawProductId}`),
        {
          category: "Curtain",
          productId: rawProductId,
          normalizedProductId,
          productName,
          price,
          address,
          approvedForEmail: buyerEmail,
          isAvailable: false,
          status: "Not Available",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "curtainProductStatus", rawProductId),
        {
          category: "Curtain",
          productId: rawProductId,
          normalizedProductId,
          productName,
          available: false,
          status: "Not Available",
          approvalStatus: "approved",
          approvedOrderId: orderId,
          approvedForEmail: buyerEmail,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (normalizedProductId && normalizedProductId !== rawProductId) {
        await setDoc(
          doc(db, "curtainProductStatus", normalizedProductId),
          {
            category: "Curtain",
            productId: normalizedProductId,
            rawProductId,
            productName,
            available: false,
            status: "Not Available",
            approvalStatus: "approved",
            approvedOrderId: orderId,
            approvedForEmail: buyerEmail,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      alert("Curtain request approved successfully.");
    } catch (error) {
      console.error("Approval error full object:", error);
      alert(`Failed to approve request: ${error.message}`);
    } finally {
      setActionLoadingId("");
    }
  };

  const handleReject = async (order) => {
    try {
      setActionLoadingId(order.id);

      const orderId = order.id;
      const { rawProductId, normalizedProductId } = getIds(order);

      if (!orderId) {
        throw new Error("Order ID missing.");
      }

      if (!rawProductId) {
        throw new Error("Product ID missing in this order.");
      }

      const productName =
        order.productName ||
        order.name ||
        order.model_name ||
        `Curtain ${rawProductId}`;

      const buyerEmail =
        order.buyerEmail || order.customerEmail || order.email || "";

      const buyerName =
        order.buyerName || order.customerName || order.customerName || "";

      const address =
        order.address || order.customerAddress || order.deliveryAddress || "";

      const query = order.query || "";
      const selectedHeight = order.selectedHeight || order.size || "";
      const fabricColor = order.fabricColor || order.fabric_color || "";
      const fabricType =
        order.fabricType || order.fabric_type || order.material || "";
      const style = order.style || "";
      const material = order.material || order.fabric_type || "";
      const quantity = Number(order.quantity || 1);
      const image = order.image || "";

      const cleanedPriceString = String(
        order.selectedPrice || order.price || order.rate || order.MRP || 0
      ).replace(/[^\d.]/g, "");
      const price = Number(cleanedPriceString || 0);

      await updateDoc(doc(db, "curtainOrders", orderId), {
        status: "rejected",
        approvalStatus: "rejected",
        available: true,
        adminUpdatedAt: serverTimestamp(),
        rejectedAt: serverTimestamp(),
      });

      await setDoc(
        doc(db, "allCurtainOrders", orderId),
        {
          orderId,
          product_id: rawProductId,
          productId: rawProductId,
          normalizedProductId,
          productName,
          name: productName,
          buyerName,
          buyerEmail,
          address,
          query,
          selectedHeight,
          selectedPrice: price,
          fabricColor,
          fabricType,
          style,
          material,
          quantity,
          image,
          price,
          category: "Curtain",
          status: "Available",
          approvalStatus: "rejected",
          available: true,
          approved: false,
          rejected: true,
          rejectedAt: serverTimestamp(),
          adminUpdatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await setDoc(
        doc(db, "productAvailability", `Curtain_${rawProductId}`),
        {
          category: "Curtain",
          productId: rawProductId,
          normalizedProductId,
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

      await setDoc(
        doc(db, "curtainProductStatus", rawProductId),
        {
          category: "Curtain",
          productId: rawProductId,
          normalizedProductId,
          productName,
          available: true,
          status: "Available",
          approvalStatus: "rejected",
          approvedOrderId: "",
          approvedForEmail: "",
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      if (normalizedProductId && normalizedProductId !== rawProductId) {
        await setDoc(
          doc(db, "curtainProductStatus", normalizedProductId),
          {
            category: "Curtain",
            productId: normalizedProductId,
            rawProductId,
            productName,
            available: true,
            status: "Available",
            approvalStatus: "rejected",
            approvedOrderId: "",
            approvedForEmail: "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }

      alert("Curtain request rejected successfully.");
    } catch (error) {
      console.error("Reject error full object:", error);
      alert(`Failed to reject request: ${error.message}`);
    } finally {
      setActionLoadingId("");
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading curtain requests...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <p style={styles.smallTitle}>Admin Panel</p>
        <h1 style={styles.heading}>Curtain Approval Requests</h1>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>No curtain requests found.</div>
      ) : (
        <div style={styles.grid}>
          {orders.map((order) => (
            <div key={order.id} style={styles.card}>
              <div style={styles.topRow}>
                <div>
                  <p style={styles.tag}>Curtain Request</p>
                  <h2 style={styles.title}>
                    {order.productName || order.model_name || order.name || "Curtain"}
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
                <p><strong>Buyer Name:</strong> {order.buyerName || order.customerName || "-"}</p>
                <p><strong>Buyer Email:</strong> {order.buyerEmail || order.customerEmail || "-"}</p>
                <p><strong>Address:</strong> {order.address || order.customerAddress || "-"}</p>
                <p><strong>Query:</strong> {order.query || "N/A"}</p>
                <p><strong>Selected Height:</strong> {order.selectedHeight || order.size || "-"}</p>
                <p><strong>Selected Price:</strong> {order.selectedPrice || order.price || "-"}</p>
                <p><strong>Fabric Color:</strong> {order.fabricColor || order.fabric_color || "-"}</p>
                <p><strong>Fabric Type:</strong> {order.fabricType || order.fabric_type || "-"}</p>
                <p><strong>Style:</strong> {order.style || "-"}</p>
                <p><strong>Material:</strong> {order.material || "-"}</p>
                <p><strong>Status:</strong> {order.status || "pending"}</p>
              </div>

              <div style={styles.buttonRow}>
                <button
                  style={{
                    ...styles.approveBtn,
                    opacity: actionLoadingId === order.id ? 0.7 : 1,
                    cursor:
                      actionLoadingId === order.id ? "not-allowed" : "pointer",
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
                    cursor:
                      actionLoadingId === order.id ? "not-allowed" : "pointer",
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
    cursor: "pointer",
  },
  rejectBtn: {
    background: "#d32f2f",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "14px 24px",
    fontWeight: 800,
    fontSize: "16px",
    cursor: "pointer",
  },
};