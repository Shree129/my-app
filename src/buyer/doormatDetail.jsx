import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import doormatProducts from "./doormatProducts";

export default function DoormatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const product = useMemo(() => {
    return (
      location.state ||
      doormatProducts.find((item) => String(item.product_id) === String(id))
    );
  }, [id, location.state]);

  const [available, setAvailable] = useState(true);
  const [approvalStatus, setApprovalStatus] = useState("available");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    if (!product?.product_id) return;

    const unsub = onSnapshot(
      doc(db, "doormatProductStatus", String(product.product_id)),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          const isAvailable = data.available !== false;
          setAvailable(isAvailable);
          setApprovalStatus(isAvailable ? "available" : "unavailable");
        } else {
          setAvailable(true);
          setApprovalStatus("available");
        }
      }
    );

    return () => unsub();
  }, [product]);

  if (!product) {
    return (
      <div style={styles.notFoundWrap}>
        <h2>Doormat not found</h2>
        <button style={styles.backBtn} onClick={() => navigate("/doormat-section")}>
          Back
        </button>
      </div>
    );
  }

  const handleWhatsAppOrder = async () => {
    if (!name || !phone || !address) {
      alert("Please fill all details.");
      return;
    }

    if (!available) {
      alert("This doormat is currently unavailable.");
      return;
    }

    try {
      setPlacingOrder(true);

      const orderPayload = {
        productId: product.product_id,
        productName: product.model_name,
        productImage: product.image || "",
        price: product.price || 0,
        material: product.material || "",
        size: product.size || "",
        color: product.color || "",
        pattern: product.pattern || "",
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        quantity: Number(quantity),
        orderType: "doormat",
        whatsappRequested: true,
        adminApproval: "pending",
        productStatus: "available",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "doormatOrders"), orderPayload);
      await addDoc(collection(db, "allDoormatOrders"), orderPayload);

      const message = `
Hello JP Furnishing House,

I want to order this doormat.

Product ID: ${product.product_id}
Product Name: ${product.model_name}
Price: ₹${product.price}
Quantity: ${quantity}

Customer Name: ${name}
Phone: ${phone}
Address: ${address}
      `.trim();

      const whatsappUrl = `https://wa.me/917518907218?text=${encodeURIComponent(
        message
      )}`;

      window.open(whatsappUrl, "_blank");

      alert("Order request saved. Admin approval will control availability.");

      setName("");
      setPhone("");
      setAddress("");
      setQuantity(1);
      setShowForm(false);
    } catch (error) {
      console.error("Error placing doormat order:", error);
      alert("Failed to place order.");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={() => navigate("/doormat-section")}>
        ← Back
      </button>

      <div style={styles.container}>
        <div style={styles.left}>
          <img
            src={product.image}
            alt={product.model_name}
            style={styles.image}
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80";
            }}
          />
        </div>

        <div style={styles.right}>
          <h1 style={styles.title}>{product.model_name}</h1>
          <p style={styles.price}>₹ {product.price}</p>

          <p style={styles.desc}>
            {product.description || "Premium quality doormat with elegant finish."}
          </p>

          <div style={styles.metaBox}>
            <p><strong>Material:</strong> {product.material || "N/A"}</p>
            <p><strong>Size:</strong> {product.size || "N/A"}</p>
            <p><strong>Color:</strong> {product.color || "N/A"}</p>
            <p><strong>Pattern:</strong> {product.pattern || "N/A"}</p>
          </div>

          <div
            style={{
              ...styles.statusBadge,
              background: available ? "#e7f8ec" : "#fdeaea",
              color: available ? "#1d7a35" : "#b42318",
            }}
          >
            {approvalStatus === "unavailable"
              ? "Unavailable"
              : "Available"}
          </div>

          {available ? (
            <button style={styles.orderBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? "Close Form" : "Order on WhatsApp"}
            </button>
          ) : (
            <button style={styles.disabledBtn} disabled>
              Currently Unavailable
            </button>
          )}

          {showForm && available && (
            <div style={styles.formBox}>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                style={styles.input}
                type="text"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <textarea
                style={styles.textarea}
                placeholder="Enter address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <input
                style={styles.input}
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />

              <button
                style={styles.whatsappBtn}
                onClick={handleWhatsAppOrder}
                disabled={placingOrder}
              >
                {placingOrder ? "Processing..." : "Confirm via WhatsApp"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f7f1eb",
    padding: "40px",
    fontFamily: "Arial, sans-serif",
  },
  backBtn: {
    padding: "10px 18px",
    background: "#4b2511",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "24px",
    fontWeight: "700",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "40px",
    background: "#fff",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  left: {
    width: "100%",
  },
  right: {
    width: "100%",
  },
  image: {
    width: "100%",
    height: "520px",
    objectFit: "cover",
    borderRadius: "18px",
  },
  title: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#2c1608",
    marginBottom: "10px",
  },
  price: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#8b5e34",
    marginBottom: "16px",
  },
  desc: {
    fontSize: "18px",
    color: "#5e5248",
    lineHeight: 1.7,
    marginBottom: "20px",
  },
  metaBox: {
    background: "#faf7f4",
    padding: "18px",
    borderRadius: "14px",
    lineHeight: 1.8,
    marginBottom: "20px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "10px 18px",
    borderRadius: "999px",
    fontWeight: "800",
    marginBottom: "20px",
  },
  orderBtn: {
    display: "block",
    padding: "14px 24px",
    background: "#4b2511",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
    marginBottom: "20px",
  },
  disabledBtn: {
    display: "block",
    padding: "14px 24px",
    background: "#9f9f9f",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "not-allowed",
    marginBottom: "20px",
  },
  formBox: {
    background: "#fff7f0",
    padding: "20px",
    borderRadius: "16px",
    border: "1px solid #ead8c7",
  },
  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #d0b9a3",
    fontSize: "16px",
  },
  textarea: {
    width: "100%",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    border: "1px solid #d0b9a3",
    fontSize: "16px",
    minHeight: "100px",
    resize: "vertical",
  },
  whatsappBtn: {
    padding: "14px 24px",
    background: "#25D366",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },
  notFoundWrap: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f7f1eb",
  },
};