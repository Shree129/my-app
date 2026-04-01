import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, provider } from "../firebase";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  
  const [message, setMessage] = useState("");

  const handleAdminLogin = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const adminRef = doc(db, "admins", user.uid);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists() || adminSnap.data()?.role !== "admin") {
        await signOut(auth);
        setError("Access denied. This Google account is not authorized as admin.");
        return;
      }

      await setDoc(
        adminRef,
        {
          uid: user.uid,
          email: user.email || "",
          name: user.displayName || "Admin",
          photoURL: user.photoURL || "",
          role: "admin",
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );

      setMessage("Admin login successful.");
      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err);
      setError(
        err?.code === "auth/popup-closed-by-user"
          ? "Google popup was closed before login completed."
          : err?.code === "auth/popup-blocked"
          ? "Popup blocked by browser. Please allow popups."
          : err?.code === "auth/unauthorized-domain"
          ? "This domain is not authorized in Firebase."
          : err?.message || "Admin login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background:
            linear-gradient(rgba(0,0,0,0.60), rgba(0,0,0,0.72)),
            url("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          font-family: Arial, sans-serif;
        }

        .admin-login-card {
          width: 100%;
          max-width: 480px;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: 28px;
          padding: 34px 30px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.35);
          color: white;
        }

        .admin-badge {
          display: inline-block;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 16px;
          color: #f4d7a1;
        }

        .admin-title {
          margin: 0;
          font-size: 48px;
          line-height: 1.05;
          font-weight: 800;
        }

        .admin-subtitle {
          margin: 14px 0 22px;
          color: rgba(255,255,255,0.88);
          font-size: 16px;
          line-height: 1.7;
        }

        .feature-box {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 18px;
          padding: 18px;
          margin-bottom: 18px;
        }

        .feature-title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 700;
        }

        .feature-text {
          margin: 0;
          color: rgba(255,255,255,0.84);
          line-height: 1.6;
          font-size: 14px;
        }

        .error-box {
          background: rgba(185, 28, 28, 0.28);
          border: 1px solid rgba(255,255,255,0.10);
          color: white;
          padding: 12px 14px;
          border-radius: 14px;
          margin-bottom: 14px;
          font-size: 14px;
          line-height: 1.6;
        }

        .success-box {
          background: rgba(22, 163, 74, 0.22);
          border: 1px solid rgba(255,255,255,0.10);
          color: white;
          padding: 12px 14px;
          border-radius: 14px;
          margin-bottom: 14px;
          font-size: 14px;
        }

        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px 18px;
          border: none;
          border-radius: 18px;
          background: linear-gradient(135deg, #ffffff, #f8fafc);
          color: #111827;
          font-size: 16px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 14px 32px rgba(0,0,0,0.22);
        }

        .google-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
        }

        .google-icon {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      <div className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-badge">JP Furnishing Admin</div>

          <h1 className="admin-title">Admin Access</h1>

          <p className="admin-subtitle">
            Sign in with your authorized Google account to manage approvals and
            product availability securely.
          </p>

          <div className="feature-box">
            <h3 className="feature-title">Restricted admin login</h3>
            <p className="feature-text">
              Only accounts listed in your Firestore admin collection can enter
              the admin approval panel.
            </p>
          </div>

          {error ? <div className="error-box">{error}</div> : null}
          {message ? <div className="success-box">{message}</div> : null}

          <button
            className="google-btn"
            onClick={handleAdminLogin}
            disabled={loading}
            type="button"
          >
            <span className="google-icon">G</span>
            {loading ? "Checking admin access..." : "Continue with Google"}
          </button>
        </div>
      </div>
    </>
  );
}