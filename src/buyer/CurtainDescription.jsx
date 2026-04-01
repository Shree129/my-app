import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  onSnapshot,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import curtains from "./curtainData";

export default function CurtainDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [selectedHeight, setSelectedHeight] = useState("7ft");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [approvedUnavailable, setApprovedUnavailable] = useState(false);
  const [statusLoading, setStatusLoading] = useState(true);

  const product = useMemo(() => {
    const routeProduct = location.state || null;
    if (routeProduct) return routeProduct;

    return (
      curtains.find((item) => String(item.product_id) === String(id)) || null
    );
  }, [id, location.state]);

  const rawProductId = useMemo(() => {
    return product?.product_id ? String(product.product_id) : "";
  }, [product]);

  const normalizedProductId = useMemo(() => {
    if (!product?.product_id) return "";
    const parsed = parseInt(String(product.product_id), 10);
    return Number.isNaN(parsed) ? String(product.product_id) : String(parsed);
  }, [product]);

  const statusDocIds = useMemo(() => {
    const ids = [];
    if (rawProductId) ids.push(rawProductId);
    if (normalizedProductId && normalizedProductId !== rawProductId) {
      ids.push(normalizedProductId);
    }
    return ids;
  }, [rawProductId, normalizedProductId]);

  useEffect(() => {
    if (!product?.product_id) {
      setStatusLoading(false);
      return;
    }

    let unsubscribers = [];
    let closed = false;

    const checkStatus = async () => {
      setStatusLoading(true);

      try {
        let foundUnavailable = false;

        for (const docId of statusDocIds) {
          const snap = await getDoc(doc(db, "curtainProductStatus", docId));

          if (snap.exists()) {
            const data = snap.data();

            const isUnavailable =
              data?.available === false ||
              data?.approvalStatus === "approved" ||
              data?.approvalStatus === "unavailable";

            if (isUnavailable) {
              foundUnavailable = true;
            }
          }
        }

        if (!closed) {
          setApprovedUnavailable(foundUnavailable);
          setStatusLoading(false);
        }

        unsubscribers = statusDocIds.map((docId) =>
          onSnapshot(
            doc(db, "curtainProductStatus", docId),
            async () => {
              try {
                const snaps = await Promise.all(
                  statusDocIds.map((idVal) =>
                    getDoc(doc(db, "curtainProductStatus", idVal))
                  )
                );

                const finalUnavailable = snaps.some((s) => {
                  if (!s.exists()) return false;
                  const d = s.data();
                  return (
                    d?.available === false ||
                    d?.approvalStatus === "approved" ||
                    d?.approvalStatus === "unavailable"
                  );
                });

                if (!closed) {
                  setApprovedUnavailable(finalUnavailable);
                  setStatusLoading(false);
                }
              } catch (err) {
                console.error("Status recheck error:", err);
              }
            },
            (error) => {
              console.error("Status listener error:", error);
              setStatusLoading(false);
            }
          )
        );
      } catch (error) {
        console.error("Initial status check error:", error);
        if (!closed) {
          setApprovedUnavailable(false);
          setStatusLoading(false);
        }
      }
    };

    checkStatus();

    return () => {
      closed = true;
      unsubscribers.forEach((unsub) => {
        if (typeof unsub === "function") unsub();
      });
    };
  }, [product?.product_id, statusDocIds]);

  if (!product && !statusLoading) {
    return (
      <div style={styles.notFoundWrap}>
        <h2 style={styles.notFoundTitle}>Curtain not found</h2>
        <p style={styles.notFoundText}>
          The requested curtain product could not be loaded.
        </p>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={styles.loadingWrap}>
        <h2 style={styles.loadingText}>Loading...</h2>
      </div>
    );
  }

  const finalPrice =
    selectedHeight === "9ft"
      ? product.price_9ft || product.price || product.rate || "N/A"
      : product.price_7ft || product.price || product.rate || "N/A";

  const handleWhatsAppOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      alert("Please fill all details first.");
      return;
    }

    if (approvedUnavailable) {
      alert("This curtain is currently unavailable.");
      return;
    }

    const whatsappNumber = "917518907218";
    const newTab = window.open("", "_blank");

    if (!newTab) {
      alert("Popup blocked by browser. Please allow popups for this site.");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderId = `curtain_${normalizedProductId || rawProductId}_${Date.now()}`;

      const orderData = {
        orderId,
        productId: rawProductId,
        normalizedProductId,
        productType: "curtain",
        model_name: product.model_name || "",
        image: product.image || "",
        fabric_image: product.fabric_image || "",
        fabric_color: product.fabric_color || "",
        pattern: product.pattern || "",
        material: product.material || product.fabric_type || "",
        size: selectedHeight,
        quantity: Number(selectedQuantity),
        price:
          selectedHeight === "9ft"
            ? product.price_9ft || product.price || product.rate || ""
            : product.price_7ft || product.price || product.rate || "",
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        approvalStatus: "pending",
        available: true,
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "curtainOrders", orderId), orderData);
      await addDoc(collection(db, "allCurtainOrders"), orderData);

      const message = `Hello JP Furnishing House,

I want to enquire/order this curtain.

Product Details:
Model: ${product.model_name || ""}
Product ID: ${rawProductId}
Normalized Product ID: ${normalizedProductId}
Color: ${product.fabric_color || ""}
Pattern: ${product.pattern || ""}
Material: ${product.material || product.fabric_type || ""}
Selected Height: ${selectedHeight}
Quantity: ${selectedQuantity}
Price: ${finalPrice}

Customer Details:
Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

Please confirm availability.`;

      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(
        message
      )}`;

      newTab.location.href = whatsappUrl;

      alert("Your curtain request has been submitted. It is pending admin approval.");

      setShowForm(false);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setSelectedQuantity(1);
      setSelectedHeight("7ft");
    } catch (error) {
      console.error("Order save error:", error);

      if (newTab && !newTab.closed) {
        newTab.close();
      }

      alert("Failed to save order. Check Firestore setup and try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div style={styles.page}>
      <motion.div
        style={styles.container}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <button style={styles.backBtnTop} onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div style={styles.grid}>
          <motion.div
            style={styles.imageSection}
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={product.image}
              alt={product.model_name}
              style={styles.mainImage}
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80";
              }}
            />

            {product.fabric_image && (
              <div style={styles.fabricWrap}>
                <p style={styles.fabricHeading}>Fabric Image</p>
                <img
                  src={product.fabric_image}
                  alt="Fabric Preview"
                  style={styles.fabricImage}
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80";
                  }}
                />
              </div>
            )}
          </motion.div>

          <motion.div
            style={styles.detailsSection}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p style={styles.brand}>JP FURNISHING HOUSE</p>
            <h1 style={styles.title}>{product.model_name}</h1>

            <div style={styles.statusRow}>
              <span
                style={{
                  ...styles.statusBadge,
                  background: statusLoading
                    ? "#e5e7eb"
                    : approvedUnavailable
                    ? "#ffd6d6"
                    : "#dcfce7",
                  color: statusLoading
                    ? "#374151"
                    : approvedUnavailable
                    ? "#b91c1c"
                    : "#166534",
                }}
              >
                {statusLoading
                  ? "Checking status..."
                  : approvedUnavailable
                  ? "Unavailable"
                  : "Available"}
              </span>

              <span style={styles.pendingNote}>
                Product becomes unavailable only after admin approval
              </span>
            </div>

            <div style={styles.infoNote}>
              <p style={styles.noteHeading}>Images</p>
              <p style={styles.noteText}>AI generated</p>

              <p style={styles.noteHeading}>Delivery Pan</p>
              <p style={styles.noteText}>Lucknow</p>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.infoRow}>
                <span style={styles.label}>Product ID:</span>
                <span style={styles.value}>{rawProductId || "N/A"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Fabric Color:</span>
                <span style={styles.value}>{product.fabric_color || "N/A"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Pattern:</span>
                <span style={styles.value}>{product.pattern || "N/A"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Material:</span>
                <span style={styles.value}>
                  {product.material || product.fabric_type || "N/A"}
                </span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Style:</span>
                <span style={styles.value}>{product.style || "N/A"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Wash Type:</span>
                <span style={styles.value}>{product.wash_type || "N/A"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Suitable For:</span>
                <span style={styles.value}>{product.suitable_for || "N/A"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Delivery Time:</span>
                <span style={styles.value}>{product.delivery_time || "N/A"}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.label}>Stitching Included:</span>
                <span style={styles.value}>
                  {product.stitching_included || "N/A"}
                </span>
              </div>
            </div>

            <div style={styles.selectorWrap}>
              <div style={styles.selectorGroup}>
                <label style={styles.selectorLabel}>Select Height</label>
                <select
                  style={styles.select}
                  value={selectedHeight}
                  onChange={(e) => setSelectedHeight(e.target.value)}
                  disabled={approvedUnavailable || statusLoading}
                >
                  <option value="7ft">7ft</option>
                  <option value="9ft">9ft</option>
                </select>
              </div>

              <div style={styles.selectorGroup}>
                <label style={styles.selectorLabel}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  style={styles.input}
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(e.target.value)}
                  disabled={approvedUnavailable || statusLoading}
                />
              </div>
            </div>

            <p style={styles.description}>
              {product.description ||
                "Premium curtain crafted with elegant fabric, stylish finish, and premium stitching. Designed to enhance the beauty of your living space with graceful texture, durability, and easy maintenance."}
            </p>

            {!showForm ? (
              <button
                style={{
                  ...styles.buyBtn,
                  opacity: approvedUnavailable || statusLoading ? 0.7 : 1,
                  cursor:
                    approvedUnavailable || statusLoading ? "not-allowed" : "pointer",
                }}
                onClick={() => {
                  if (approvedUnavailable) {
                    alert("This curtain is currently unavailable.");
                    return;
                  }
                  if (statusLoading) {
                    alert("Please wait. Status is being checked.");
                    return;
                  }
                  setShowForm(true);
                }}
              >
                {statusLoading
                  ? "Checking status..."
                  : approvedUnavailable
                  ? "Unavailable"
                  : "Order on WhatsApp"}
              </button>
            ) : (
              <div style={styles.formCard}>
                <h3 style={styles.formTitle}>Enter Your Details</h3>

                <input
                  type="text"
                  placeholder="Your Name"
                  style={styles.input}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  style={styles.input}
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />

                <textarea
                  placeholder="Address"
                  style={styles.textarea}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />

                <div style={styles.formBtns}>
                  <button
                    style={styles.confirmBtn}
                    onClick={handleWhatsAppOrder}
                    disabled={placingOrder}
                  >
                    {placingOrder ? "Submitting..." : "Confirm & WhatsApp"}
                  </button>

                  <button
                    style={styles.cancelBtn}
                    onClick={() => setShowForm(false)}
                    disabled={placingOrder}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #f8f5f0 0%, #efe7dc 50%, #f5efe6 100%)",
    padding: "40px 20px",
    fontFamily: "'Poppins', sans-serif",
  },
  container: {
    maxWidth: "1300px",
    margin: "0 auto",
  },
  backBtnTop: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#3b2f2f",
    color: "#fff",
    marginBottom: "24px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "36px",
    alignItems: "start",
  },
  imageSection: {
    background: "#fff",
    padding: "22px",
    borderRadius: "24px",
    boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
  },
  mainImage: {
    width: "100%",
    height: "620px",
    objectFit: "cover",
    borderRadius: "20px",
  },
  fabricWrap: {
    marginTop: "18px",
    background: "#fffaf4",
    border: "1px solid #eadfce",
    borderRadius: "18px",
    padding: "14px",
  },
  fabricHeading: {
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "700",
    color: "#5c4430",
  },
  fabricImage: {
    width: "100%",
    height: "220px",
    objectFit: "cover",
    borderRadius: "14px",
  },
  detailsSection: {
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    padding: "30px",
    borderRadius: "24px",
    boxShadow: "0 14px 40px rgba(0,0,0,0.10)",
  },
  brand: {
    margin: 0,
    fontSize: "13px",
    letterSpacing: "2px",
    color: "#8b6f47",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  title: {
    marginTop: "10px",
    marginBottom: "12px",
    fontSize: "38px",
    color: "#2f1f14",
    fontWeight: "800",
  },
  statusRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
    marginBottom: "10px",
  },
  statusBadge: {
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: "700",
  },
  pendingNote: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
  },
  infoNote: {
    marginTop: "14px",
    marginBottom: "12px",
    lineHeight: "1.7",
  },
  noteHeading: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "700",
    color: "#5c4430",
  },
  noteText: {
    margin: "0 0 6px 0",
    fontSize: "15px",
    color: "#4a3b2e",
  },
  infoCard: {
    background: "#fffaf4",
    border: "1px solid #eadfce",
    borderRadius: "18px",
    padding: "18px",
    marginTop: "16px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 0",
    borderBottom: "1px dashed #e6d8c5",
  },
  label: {
    fontWeight: "700",
    color: "#5c4430",
  },
  value: {
    color: "#2f2f2f",
    textAlign: "right",
    maxWidth: "55%",
  },
  selectorWrap: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginTop: "22px",
  },
  selectorGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  selectorLabel: {
    fontWeight: "700",
    color: "#4b3527",
  },
  select: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d8c4ab",
    fontSize: "15px",
    outline: "none",
  },
  input: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d8c4ab",
    fontSize: "15px",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  textarea: {
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #d8c4ab",
    fontSize: "15px",
    outline: "none",
    minHeight: "110px",
    resize: "vertical",
    width: "100%",
    boxSizing: "border-box",
  },
  description: {
    marginTop: "22px",
    lineHeight: "1.9",
    fontSize: "16px",
    color: "#4a3b2e",
  },
  buyBtn: {
    marginTop: "24px",
    width: "100%",
    padding: "16px 20px",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #6b4226, #a56a3a)",
    color: "#fff",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 25px rgba(107,66,38,0.25)",
  },
  formCard: {
    marginTop: "24px",
    background: "#fffaf4",
    border: "1px solid #eadfce",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  formTitle: {
    margin: 0,
    fontSize: "22px",
    color: "#2f1f14",
    fontWeight: "800",
  },
  formBtns: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  confirmBtn: {
    flex: 1,
    minWidth: "180px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#25D366",
    color: "#fff",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },
  cancelBtn: {
    flex: 1,
    minWidth: "180px",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "#e5e7eb",
    color: "#111827",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
  },
  loadingWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f8f5f0",
  },
  loadingText: {
    fontSize: "32px",
    color: "#2f1f14",
    fontWeight: "800",
  },
  notFoundWrap: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    background: "#f8f5f0",
    padding: "20px",
  },
  notFoundTitle: {
    fontSize: "34px",
    color: "#2f1f14",
    margin: 0,
  },
  notFoundText: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
  },
  backBtn: {
    marginTop: "10px",
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#3b2f2f",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};