import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function AdminProtectedRoute({ children }) {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!mounted) return;

      if (!user) {
        setIsAdmin(false);
        setChecking(false);
        return;
      }

      try {
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!mounted) return;

        if (adminSnap.exists() && adminSnap.data()?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin auth check failed:", error);
        setIsAdmin(false);
      } finally {
        if (mounted) setChecking(false);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  if (checking) {
    return (
      <div style={styles.loaderWrap}>
        <div style={styles.loaderCard}>
          <h2 style={styles.loaderTitle}>Checking admin access...</h2>
          <p style={styles.loaderText}>Please wait.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/AdminLogin" replace />;
  }

  return children;
}

const styles = {
  loaderWrap: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f8f5f2",
    padding: "24px",
  },
  loaderCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
    minWidth: "320px",
  },
  loaderTitle: {
    margin: 0,
    fontSize: "24px",
    color: "#1f2937",
  },
  loaderText: {
    marginTop: "10px",
    color: "#6b7280",
    fontSize: "15px",
  },
};