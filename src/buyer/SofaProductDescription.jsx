import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { sofaProducts } from "../data/sofaProducts";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const getSofaDescription = (product) => {
  if (!product) return "";

  return `The ${product.model_name} sofa in ${
    product.fabric_color || "premium"
  } finish offers a perfect blend of comfort, durability, and modern elegance.

Crafted with premium upholstery-inspired fabric and a refined finish, this sofa is designed for both everyday use and luxurious interiors.

✔ Made to Order: ${product.made_to_order || "Yes"}
✔ Premium Fabric Finish
✔ Durable & Long-lasting Build
✔ Elegant Look for Living Room Interiors
✔ Ideal for Modern Homes

Upgrade your space with elegance and functionality.`;
};

export default function SofaDescription() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const routeProduct = location.state || null;

  const product = useMemo(() => {
    const pid = routeProduct?.product_id || id;

    const fullProduct = sofaProducts.find(
      (p) => String(p.product_id) === String(pid)
    );

    if (fullProduct && routeProduct) {
      return { ...routeProduct, ...fullProduct };
    }

    return fullProduct || routeProduct || null;
  }, [id, routeProduct]);

  const [selectedImage, setSelectedImage] = useState("");
  const [available, setAvailable] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(true);

  const [showPopup, setShowPopup] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [address, setAddress] = useState("");
  const [query, setQuery] = useState("");

  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const whatsappNumber = "917518907218";

  useEffect(() => {
    if (product?.main_image || product?.image) {
      setSelectedImage(product.main_image || product.image);
    }
  }, [product]);

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
          `Sofa_${product.product_id}`
        );
        const availabilitySnap = await getDoc(availabilityRef);

        if (availabilitySnap.exists()) {
          const data = availabilitySnap.data();
          setAvailable(data.isAvailable ?? true);
        } else {
          setAvailable(true);
        }
      } catch (error) {
        console.error("Error fetching sofa availability:", error);
        setAvailable(true);
      } finally {
        setLoadingAvailability(false);
      }
    };

    fetchAvailability();
  }, [product]);

  const handleOpenPopup = () => {
    if (!available) {
      setMessage("This sofa is currently unavailable.");
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
        product_id: String(product.product_id),
        productId: String(product.product_id),
        productName: product.model_name || `Sofa ${product.product_id}`,
        name: product.model_name || `Sofa ${product.product_id}`,
        image: product.main_image || product.image || "",
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        address: address.trim(),
        query: query.trim(),
        fabricColor: product.fabric_color || "",
        fabricType: product.fabric_type || "",
        material: product.material || "",
        size: product.size || "",
        style: product.style || "",
        made_to_order: product.made_to_order || "Yes",
        price: Number(product.price || product.rate || product.MRP || 0),
        rate: product.price || product.rate || product.MRP || 0,
        category: "Sofa",
        description: getSofaDescription(product),
        status: "pending",
        available: true,
        requestedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "sofaOrders", orderId), payload, { merge: true });

      const whatsappMessage = `
Hello JP Furnishing House,

I want to order this sofa .

Product ID: ${product.product_id}
Product Name: ${product.model_name || "Sofa"}
Price: ₹${product.price || product.rate || product.MRP || 0}
Color: ${product.fabric_color || "N/A"}
Style: ${product.style || "Standard"}

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
      console.error("Error submitting sofa request:", error);
      setMessage("Failed to submit request.");
    } finally {
      setSending(false);
    }
  };

  if (!product) {
    return (
      <div style={styles.notFoundPage}>
        <h2 style={styles.notFoundTitle}>Sofa not found</h2>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const displayPrice = product.price || product.rate || product.MRP || 0;

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
                src={selectedImage}
                alt={product.model_name}
                style={styles.image}
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80";
                }}
              />
            </div>
          </div>

          <div style={styles.rightSection}>
            <p style={styles.brandTag}>JP Furnishing House</p>
            <h1 style={styles.title}>
              {product.model_name || `Sofa ${product.product_id}`}
            </h1>

            <p style={styles.productId}>
              Product ID: <strong>{product.product_id}</strong>
            </p>

            

{/* ✅ ADD THIS EXACTLY HERE */}
<div style={styles.infoNote}>
  <p style={styles.noteHeading}>Images</p>
  <p style={styles.noteText}>AI generated</p>

  <p style={styles.noteHeading}>Delivery Pan</p>
  <p style={styles.noteText}>Lucknow</p>
</div>

<div style={styles.statusRow}></div>

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
                <p><strong>Material:</strong> {product.material || "-"}</p>
                <p><strong>Style:</strong> {product.style || "-"}</p>
                <p><strong>Fabric Color:</strong> {product.fabric_color || "-"}</p>
                <p><strong>Fabric Type:</strong> {product.fabric_type || "-"}</p>
                <p><strong>Made to Order:</strong> {product.made_to_order || "Yes"}</p>
                <p><strong>Suitable For:</strong> {product.suitable_for || "-"}</p>
              </div>

              <p style={styles.longText}>{getSofaDescription(product)}</p>
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
            <h2 style={styles.popupTitle}>Sofa Order Details</h2>

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
    whiteSpace: "pre-line",
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