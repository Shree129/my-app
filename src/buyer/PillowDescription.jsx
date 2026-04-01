import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import pillowCovers from "./pillowCover";

export default function PillowDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const product = useMemo(() => {
    return (
      location.state ||
      pillowCovers.find((item) => String(item.product_id) === String(id))
    );
  }, [id, location.state]);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [approvedUnavailable, setApprovedUnavailable] = useState(false);
  const [approvalData, setApprovalData] = useState(null);

  useEffect(() => {
    if (!product?.product_id) return;

    const availabilityRef = doc(
      db,
      "productAvailability",
      `pillow_${product.product_id}`
    );

    const unsubscribe = onSnapshot(
      availabilityRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setApprovalData(data);
          setApprovedUnavailable(
            data?.isUnavailable === true && data?.approvedByAdmin === true
          );
        } else {
          setApprovalData(null);
          setApprovedUnavailable(false);
        }
      },
      (error) => {
        console.error("Availability listener error:", error);
        setApprovalData(null);
        setApprovedUnavailable(false);
      }
    );

    return () => unsubscribe();
  }, [product]);

  if (!product) {
    return (
      <div style={styles.notFoundWrap}>
        <h2 style={styles.notFoundTitle}>Pillow cover not found</h2>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const price =
    product.price ||
    product.rate ||
    product.mrp ||
    product.selling_price ||
    product.price_1 ||
    "Price on request";

  const currentStatus = approvedUnavailable
    ? "unavailable"
    : approvalData?.approvalStatus === "pending"
    ? "pending"
    : "available";

  const handleWhatsAppOrder = async () => {
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !customerAddress.trim()
    ) {
      alert("Please fill all details first.");
      return;
    }

    if (approvedUnavailable) {
      alert(
        "This pillow cover is unavailable because it has been approved by admin."
      );
      return;
    }

    try {
      setPlacingOrder(true);

      const orderPayload = {
        productId: product.product_id,
        productType: "pillow",
        productName: product.model_name || `Pillow ${product.product_id}`,
        image: product.image || "",
        price,
        quantity: Number(selectedQuantity),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        whatsappStatus: "initiated",
        approvalStatus: "pending",
        adminApproved: false,
        isUnavailable: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "allPillowOrders"), orderPayload);

      await setDoc(
        doc(
          db,
          "pillowOrders",
          `${product.product_id}_${customerPhone.trim()}`
        ),
        orderPayload,
        { merge: true }
      );

      await setDoc(
        doc(db, "productAvailability", `pillow_${product.product_id}`),
        {
          productId: product.product_id,
          productType: "pillow",
          productName: product.model_name || `Pillow ${product.product_id}`,
          isUnavailable: false,
          approvedByAdmin: false,
          approvalStatus: "pending",
          lastCustomerName: customerName.trim(),
          lastCustomerPhone: customerPhone.trim(),
          lastCustomerAddress: customerAddress.trim(),
          lastRequestedAt: serverTimestamp(),
        },
        { merge: true }
      );

      const whatsappNumber = "917518907218";

      const message = `
Hello JP Furnishing House,

I want to order this cushion cover.

Product ID: ${product.product_id}
Product Name: ${product.model_name || `Cushion ${product.product_id}`}
Price: ${price}
Quantity: ${selectedQuantity}

Customer Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

Please confirm my order.
      `.trim();

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

      window.open(url, "_blank");

      alert(
        "Your WhatsApp request has been sent. Product will become unavailable only after admin approval."
      );

      setShowForm(false);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setSelectedQuantity(1);
    } catch (error) {
      console.error("Order error:", error);
      alert("Failed to save request. Please try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <section style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div style={styles.container}>
        <div style={styles.left}>
          <img
            src={product.image}
            alt={product.model_name || `cushion ${product.product_id}`}
            style={styles.mainImage}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80";
            }}
          />
        </div>

        <div style={styles.right}>
          <p style={styles.brand}>JP FURNISHING HOUSE</p>
          <h1 style={styles.title}>
            {product.model_name || `Cushion Cover ${product.product_id}`}
          </h1>

          
{/* ✅ ADD HERE */}
<div style={styles.infoNote}>
  <p style={styles.noteHeading}>Images</p>
  <p style={styles.noteText}>AI generated</p>

  <p style={styles.noteHeading}>Delivery Pan</p>
  <p style={styles.noteText}>Lucknow</p>
</div>
          <div
            style={{
              ...styles.statusBox,
              ...(currentStatus === "unavailable"
                ? styles.statusUnavailable
                : currentStatus === "pending"
                ? styles.statusPending
                : styles.statusAvailable),
            }}
          >
            <p style={styles.statusLabel}>Product Status</p>

            {currentStatus === "unavailable" && (
              <>
                <h3 style={styles.statusTitle}>Unavailable</h3>
                <p style={styles.statusText}>
                  This product has been marked unavailable after admin approval.
                </p>
              </>
            )}

            {currentStatus === "pending" && (
              <>
                <h3 style={styles.statusTitle}>Pending Approval</h3>
                <p style={styles.statusText}>
                  Order request sent on WhatsApp. Waiting for admin approval.
                </p>
              </>
            )}

            {currentStatus === "available" && (
              <>
                <h3 style={styles.statusTitle}>Available</h3>
                <p style={styles.statusText}>
                  This product is currently available for order.
                </p>
              </>
            )}
          </div>

          <div style={styles.infoCard}>
            <p style={styles.infoRow}>
              <strong>Product ID:</strong> {product.product_id}
            </p>
            <p style={styles.infoRow}>
              <strong>Material:</strong> {product.material || "Premium Fabric"}
            </p>
            <p style={styles.infoRow}>
              <strong>Pattern:</strong>{" "}
              {product.pattern || "Elegant Designer Print"}
            </p>
            <p style={styles.infoRow}>
              <strong>Color:</strong>{" "}
              {product.fabric_color || product.color || "As shown"}
            </p>
            <p style={styles.infoRow}>
              <strong>Size:</strong> {product.size || "Standard"}
            </p>
            <p style={styles.infoRow}>
              <strong>Description:</strong>{" "}
              {product.description ||
                "Premium cushion cover with elegant finish, stylish design, and durable fabric."}
            </p>
          </div>

          {approvedUnavailable ? (
            <div style={styles.unavailableBox}>
              <h3 style={styles.unavailableTitle}>Currently Unavailable</h3>
              <p style={styles.unavailableText}>
                This product has been marked unavailable after admin approval.
              </p>
              {approvalData?.approvedAt && (
                <p style={styles.unavailableSubText}>
                  Status updated by admin.
                </p>
              )}
            </div>
          ) : (
            <>
              {!showForm ? (
                <button
                  style={styles.orderBtn}
                  onClick={() => setShowForm(true)}
                >
                  Order on WhatsApp
                </button>
              ) : (
                <div style={styles.formBox}>
                  <h3 style={styles.formTitle}>Enter Your Details</h3>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={styles.input}
                  />

                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    style={styles.input}
                  />

                  <textarea
                    placeholder="Enter address"
                    value={customerAddress}
                    onChange={(e) => setCustomerAddress(e.target.value)}
                    style={styles.textarea}
                  />

                  <div style={styles.quantityRow}>
                    <label style={styles.label}>Quantity:</label>
                    <select
                      value={selectedQuantity}
                      onChange={(e) => setSelectedQuantity(e.target.value)}
                      style={styles.select}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((qty) => (
                        <option key={qty} value={qty}>
                          {qty}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formActions}>
                    <button
                      style={styles.confirmBtn}
                      onClick={handleWhatsAppOrder}
                      disabled={placingOrder}
                    >
                      {placingOrder ? "Processing..." : "Confirm on WhatsApp"}
                    </button>

                    <button
                      style={styles.cancelBtn}
                      onClick={() => setShowForm(false)}
                      disabled={placingOrder}
                    >
                      Cancel
                    </button>
                  </div>

                  <p style={styles.pendingNote}>
                    Note: After WhatsApp request, admin approval decides whether
                    the product becomes unavailable.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8f3ee 0%, #f1e6d8 50%, #f8f3ee 100%)",
    padding: "30px 50px 60px",
    fontFamily: "'Segoe UI', sans-serif",
  },
  backBtn: {
    background: "#5b2e12",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "10px 18px",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginBottom: "26px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1.1fr 1fr",
    gap: "40px",
    alignItems: "start",
  },
  left: {
    background: "#fff",
    borderRadius: "28px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },
  mainImage: {
    width: "100%",
    height: "620px",
    objectFit: "cover",
    borderRadius: "22px",
    display: "block",
  },
  right: {
    background: "#fff",
    borderRadius: "28px",
    padding: "30px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },
  brand: {
    fontSize: "14px",
    fontWeight: 800,
    color: "#b56a2d",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
    marginBottom: "12px",
  },
  title: {
    fontSize: "42px",
    lineHeight: 1.15,
    margin: "0 0 14px 0",
    color: "#2b1205",
    fontWeight: 800,
  },
  price: {
    fontSize: "28px",
    fontWeight: 800,
    color: "#8d4f17",
    margin: "0 0 18px 0",
  },
  statusBox: {
    borderRadius: "18px",
    padding: "18px 20px",
    marginBottom: "22px",
    border: "1px solid transparent",
  },
  statusAvailable: {
    background: "#eefaf0",
    border: "1px solid #b7e2bf",
  },
  statusPending: {
    background: "#fff8e8",
    border: "1px solid #ead28d",
  },
  statusUnavailable: {
    background: "#fff2f2",
    border: "1px solid #f0b9b9",
  },
  statusLabel: {
    margin: "0 0 6px 0",
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "0.6px",
    textTransform: "uppercase",
    color: "#6a5547",
  },
  statusTitle: {
    margin: "0 0 6px 0",
    fontSize: "24px",
    fontWeight: 800,
    color: "#2b1205",
  },
  statusText: {
    margin: 0,
    fontSize: "15px",
    lineHeight: 1.6,
    color: "#5a4638",
  },
  infoCard: {
    background: "#faf6f1",
    borderRadius: "18px",
    padding: "18px 20px",
    marginBottom: "24px",
    border: "1px solid rgba(91,46,18,0.08)",
  },
  infoRow: {
    fontSize: "16px",
    color: "#4a362c",
    margin: "0 0 12px 0",
    lineHeight: 1.6,
  },
  orderBtn: {
    background: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "15px 24px",
    fontSize: "18px",
    fontWeight: 800,
    cursor: "pointer",
  },
  formBox: {
    marginTop: "8px",
    background: "#f9f4ee",
    borderRadius: "20px",
    padding: "20px",
    border: "1px solid rgba(91,46,18,0.08)",
  },
  formTitle: {
    fontSize: "24px",
    color: "#2b1205",
    margin: "0 0 18px 0",
    fontWeight: 800,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #d7c7bb",
    fontSize: "16px",
    marginBottom: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #d7c7bb",
    fontSize: "16px",
    marginBottom: "14px",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },
  quantityRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },
  label: {
    fontWeight: 700,
    color: "#4a362c",
    fontSize: "16px",
  },
  select: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #d7c7bb",
    fontSize: "16px",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  confirmBtn: {
    background: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "13px 18px",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#5b2e12",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "13px 18px",
    fontSize: "16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  pendingNote: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#7a685d",
    lineHeight: 1.6,
  },
  unavailableBox: {
    background: "#fff2f2",
    border: "1px solid #f0b9b9",
    borderRadius: "18px",
    padding: "18px 20px",
  },
  unavailableTitle: {
    margin: "0 0 8px 0",
    color: "#a11d1d",
    fontSize: "24px",
    fontWeight: 800,
  },
  unavailableText: {
    margin: "0 0 8px 0",
    color: "#7b2b2b",
    fontSize: "16px",
    lineHeight: 1.6,
  },
  unavailableSubText: {
    margin: 0,
    color: "#8c4a4a",
    fontSize: "14px",
  },
  notFoundWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f1ed",
    fontFamily: "'Segoe UI', sans-serif",
  },
  notFoundTitle: {
    fontSize: "32px",
    color: "#2b1205",
    margin: 0,
  },
};