import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import bedsheetProducts from "./Bedsheet";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export default function BedsheetDescription() {
  const { id, productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const routeProductId = id || productId;

  const product = useMemo(() => {
    return (
      location.state ||
      bedsheetProducts.find(
        (item) => String(item.product_id) === String(routeProductId)
      )
    );
  }, [location.state, routeProductId]);

  const whatsappNumber = "917518907218";

  const [available, setAvailable] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState("");

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!product) {
        setLoadingAvailability(false);
        return;
      }

      try {
        const availabilityRef = doc(
          db,
          "productAvailability",
          `Bedsheet_${product.product_id}`
        );
        const availabilitySnap = await getDoc(availabilityRef);

        if (availabilitySnap.exists()) {
          const data = availabilitySnap.data();
          setAvailable(data.isAvailable ?? true);
        } else {
          setAvailable(true);
        }
      } catch (error) {
        console.error("Error fetching bedsheet availability:", error);
        setAvailable(true);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [product]);

  const handleOpenPopup = () => {
    if (!available) {
      setMessage("This bedsheet is currently unavailable.");
      return;
    }
    setMessage("");
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    if (sending) return;
    setShowPopup(false);
  };

  const handleSendRequest = async () => {
    if (!buyerName.trim() || !buyerEmail.trim() || !address.trim()) {
      setMessage("Please fill name, email, and address.");
      return;
    }

    if (!product) {
      setMessage("Product not found.");
      return;
    }

    if (sending) return;

    try {
      setSending(true);
      setMessage("");

      const orderId = `${product.product_id}_${Date.now()}`;

      const payload = {
        orderId,
        product_id: String(product.product_id),
        productId: String(product.product_id),
        productName: product.model_name || `Bedsheet ${product.product_id}`,
        name: product.model_name || `Bedsheet ${product.product_id}`,
        image: product.image || "",
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        address: address.trim(),
        query: query.trim(),
        fabricColor: product.fabric_color || product.color || "",
        fabricType: product.fabric_type || product.type || "",
        material: product.material || "",
        size: product.size || "",
        pattern: product.pattern || "",
        rate: product.rate || product.price || product.MRP || 0,
        price: Number(product.rate || product.price || product.MRP || 0),
        category: "Bedsheet",
        status: "pending",
        available: true,
        requestedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "bedsheetOrders", orderId), payload, { merge: true });
      await addDoc(collection(db, "allBedsheetOrders"), payload);

      const whatsappMessage = `
Hello JP Furnishing House,

I want to order this bedsheet.

Product ID: ${product.product_id}
Product Name: ${product.model_name || "Bedsheet"}
Price: ₹${product.rate || product.price || product.MRP || 0}

Buyer Name: ${buyerName}
Buyer Email: ${buyerEmail}
Address: ${address}
Query: ${query || "N/A"}

Please confirm availability.
      `.trim();

      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      window.open(whatsappUrl, "_blank");

      setMessage(
        "Your request has been submitted. It is now waiting for admin approval."
      );
      setShowPopup(false);
      setBuyerName("");
      setBuyerEmail("");
      setAddress("");
      setQuery("");
    } catch (error) {
      console.error("Error submitting bedsheet request:", error);
      setMessage("Failed to submit request.");
    } finally {
      setSending(false);
    }
  };

  if (!product) {
    return (
      <div style={styles.notFoundPage}>
        <h2 style={styles.notFoundTitle}>Bedsheet not found</h2>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const displayPrice = product.rate || product.price || product.MRP || 0;

  return (
    <section style={styles.page}>
      <div style={styles.wrapper}>
        <button style={styles.backBtnTop} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div style={styles.card}>
          <div style={styles.leftSection}>
            <div style={styles.imagePanel}>
              <img
                src={product.image}
                alt={product.model_name}
                style={styles.image}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
          </div>

          <div style={styles.rightSection}>
            <p style={styles.brandTag}>JP Furnishing House</p>

            <h1 style={styles.title}>
              {product.model_name || `Bedsheet ${product.product_id}`}
            </h1>

            <p style={styles.productId}>
              Product ID: <strong>{product.product_id}</strong>
            </p>

            <p style={styles.price}>₹ {displayPrice}</p>

            <div style={styles.infoNote}>
              <p style={styles.noteText}>Images are AI generated.</p>
              <p style={styles.noteText}> Delivery pan:Lucknow</p>
            </div>

            <div style={styles.statusRow}>
              <span style={styles.statusLabel}>Availability:</span>
              {loadingAvailability ? (
                <span style={styles.pendingBadge}>Checking...</span>
              ) : available ? (
                <span style={styles.availableBadge}>Available</span>
              ) : (
                <span style={styles.unavailableBadge}>Unavailable</span>
              )}
            </div>

            <div style={styles.descriptionBox}>
              <h3 style={styles.sectionTitle}>Product Details</h3>

              <div style={styles.specGrid}>
                <p>
                  <strong>Material:</strong> {product.material || "-"}
                </p>
                <p>
                  <strong>Size:</strong> {product.size || "-"}
                </p>
                <p>
                  <strong>Fabric Color:</strong>{" "}
                  {product.fabric_color || product.color || "-"}
                </p>
                <p>
                  <strong>Fabric Type:</strong>{" "}
                  {product.fabric_type || product.type || "-"}
                </p>
                <p>
                  <strong>Pattern:</strong> {product.pattern || "-"}
                </p>
                <p>
                  <strong>Included:</strong> 1 Bedsheet + 2 Pillow Covers
                </p>
              </div>

              <p style={styles.longText}>
                {product.description ||
                  "Premium quality bedsheet crafted for elegant interiors, daily comfort, and lasting durability."}
              </p>
            </div>

            <div style={styles.buttonRow}>
              <button
                style={{
                  ...styles.primaryBtn,
                  ...(available ? {} : styles.disabledBtn),
                }}
                onClick={handleOpenPopup}
                disabled={!available || sending}
              >
                {available ? "Order on WhatsApp" : "Currently Unavailable"}
              </button>

              <button style={styles.secondaryBtn} onClick={() => navigate(-1)}>
                Continue Shopping
              </button>
            </div>

            {message ? <p style={styles.message}>{message}</p> : null}
          </div>
        </div>
      </div>

      {showPopup && (
        <div style={styles.overlay}>
          <div style={styles.popup}>
            <h2 style={styles.popupTitle}>Bedsheet Order Details</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>Your Name</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                style={styles.input}
                placeholder="Enter your name"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Your Email</label>
              <input
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                style={styles.input}
                placeholder="Enter your email"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={styles.textarea}
                placeholder="Enter delivery address"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Any Query</label>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={styles.textarea}
                placeholder="Optional query"
              />
            </div>

            <div style={styles.popupButtons}>
              <button
                style={styles.popupCancelBtn}
                onClick={handleClosePopup}
                disabled={sending}
              >
                Cancel
              </button>

              <button
                style={styles.popupConfirmBtn}
                onClick={handleSendRequest}
                disabled={sending}
              >
                {sending ? "Submitting..." : "Submit & Open WhatsApp"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8f4ef 0%, #efe5db 100%)",
    padding: "34px 20px 60px",
  },

  wrapper: {
    maxWidth: "1280px",
    margin: "0 auto",
  },

  backBtnTop: {
    background: "#2f1e14",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "12px 22px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    marginBottom: "22px",
    boxShadow: "0 8px 18px rgba(47, 30, 20, 0.18)",
  },

  card: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "28px",
    background: "#fff",
    borderRadius: "30px",
    padding: "28px",
    boxShadow: "0 18px 45px rgba(46, 28, 18, 0.10)",
    border: "1px solid rgba(139, 94, 60, 0.10)",
  },

  leftSection: {
    minWidth: 0,
  },

  rightSection: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  imagePanel: {
    width: "100%",
    minHeight: "520px",
    background: "linear-gradient(180deg, #f7efe7 0%, #efe3d7 100%)",
    borderRadius: "24px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "100%",
    height: "100%",
    maxHeight: "470px",
    objectFit: "contain",
    borderRadius: "20px",
  },

  brandTag: {
    margin: "0 0 10px",
    color: "#a56a43",
    fontWeight: "800",
    letterSpacing: "1.5px",
    fontSize: "13px",
    textTransform: "uppercase",
  },

  title: {
    margin: "0 0 12px",
    fontSize: "42px",
    lineHeight: "1.15",
    color: "#2f1e14",
    fontWeight: "900",
  },

  productId: {
    margin: "0 0 14px",
    color: "#6b5b52",
    fontSize: "16px",
    fontWeight: "600",
  },

  price: {
    margin: "0 0 18px",
    fontSize: "32px",
    color: "#8b5e3c",
    fontWeight: "900",
  },

  infoNote: {
    margin: "0 0 18px",
    padding: "10px 14px",
    background: "#f5eee7",
    borderRadius: "12px",
    border: "1px solid rgba(139, 94, 60, 0.15)",
  },

  noteText: {
    margin: "4px 0",
    fontSize: "13px",
    color: "#7a5c48",
    fontWeight: "600",
  },

  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "22px",
  },

  statusLabel: {
    color: "#2f1e14",
    fontWeight: "800",
    fontSize: "16px",
  },

  availableBadge: {
    background: "#dcfce7",
    color: "#166534",
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "14px",
  },

  unavailableBadge: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "14px",
  },

  pendingBadge: {
    background: "#fef3c7",
    color: "#92400e",
    padding: "9px 14px",
    borderRadius: "999px",
    fontWeight: "800",
    fontSize: "14px",
  },

  descriptionBox: {
    background: "#faf6f1",
    borderRadius: "22px",
    padding: "22px",
    marginBottom: "22px",
    border: "1px solid rgba(139, 94, 60, 0.08)",
  },

  sectionTitle: {
    margin: "0 0 14px",
    fontSize: "22px",
    color: "#2f1e14",
    fontWeight: "900",
  },

  specGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px 20px",
    color: "#5e5047",
    fontSize: "15px",
    marginBottom: "14px",
    lineHeight: "1.7",
  },

  longText: {
    margin: 0,
    color: "#6b5b52",
    fontSize: "15px",
    lineHeight: "1.8",
  },

  buttonRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "#2f1e14",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "15px 26px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    boxShadow: "0 8px 18px rgba(47, 30, 20, 0.20)",
  },

  secondaryBtn: {
    background: "#fff",
    color: "#2f1e14",
    border: "1px solid #d6c4b6",
    borderRadius: "14px",
    padding: "15px 26px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  disabledBtn: {
    background: "#9ca3af",
    cursor: "not-allowed",
    boxShadow: "none",
  },

  message: {
    marginTop: "16px",
    color: "#2f1e14",
    fontSize: "15px",
    fontWeight: "700",
    lineHeight: "1.7",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "20px",
  },

  popup: {
    width: "100%",
    maxWidth: "560px",
    background: "#fff",
    borderRadius: "26px",
    padding: "28px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.20)",
  },

  popupTitle: {
    margin: "0 0 18px",
    color: "#2f1e14",
    fontSize: "28px",
    fontWeight: "900",
  },

  formGroup: {
    marginBottom: "16px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "700",
    color: "#3b2a21",
    fontSize: "15px",
  },

  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d8c8ba",
    outline: "none",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "14px 16px",
    borderRadius: "14px",
    border: "1px solid #d8c8ba",
    outline: "none",
    fontSize: "15px",
    resize: "vertical",
    boxSizing: "border-box",
  },

  popupButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "12px",
    flexWrap: "wrap",
  },

  popupCancelBtn: {
    background: "#e5e7eb",
    color: "#111827",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    fontWeight: "700",
    cursor: "pointer",
  },

  popupConfirmBtn: {
    background: "#2f1e14",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    fontWeight: "800",
    cursor: "pointer",
  },

  notFoundPage: {
    minHeight: "100vh",
    background: "#f8f4ef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: "16px",
  },

  notFoundTitle: {
    color: "#2f1e14",
    fontSize: "30px",
    margin: 0,
  },

  backBtn: {
    background: "#2f1e14",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "12px 20px",
    fontWeight: "700",
    cursor: "pointer",
  },
};