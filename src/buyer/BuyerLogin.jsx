import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db, provider, signInWithPopup } from "../firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export default function BuyerLogin() {
  const navigate = useNavigate();

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const getFriendlyError = (code) => {
    switch (code) {
      case "auth/popup-closed-by-user":
        return "Google sign-in popup was closed before completion.";
      case "auth/popup-blocked":
        return "Popup was blocked by the browser. Please allow popups and try again.";
      case "auth/unauthorized-domain":
        return "This domain is not authorized in Firebase Authentication.";
      case "auth/network-request-failed":
        return "Network error. Check your internet connection.";
      default:
        return "Something went wrong during Google sign-in. Please try again.";
    }
  };

  const handleGoogleLogin = async () => {
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const buyerRef = doc(db, "buyers", user.uid);
      const buyerSnap = await getDoc(buyerRef);

      const buyerData = {
        uid: user.uid,
        name: user.displayName || "Google User",
        email: user.email || "",
        photoURL: user.photoURL || "",
      };

      localStorage.setItem("buyerUser", JSON.stringify(buyerData));
      localStorage.setItem("buyerToken", "loggedin");

      if (!buyerSnap.exists()) {
        await setDoc(buyerRef, {
          uid: user.uid,
          name: user.displayName || "Google User",
          email: user.email || "",
          photoURL: user.photoURL || "",
          provider: "google",
          createdAt: serverTimestamp(),
        });
      }

      setMsg("Google sign-in successful!");
      setTimeout(() => navigate("/buyer/dashboard"), 700);
    } catch (error) {
      console.error("Google Auth Error:", error);
      setErr(`${getFriendlyError(error.code)} (${error.code || "unknown-error"})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .buyer-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          overflow: hidden;
          position: relative;
          background:
            linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.68)),
            url("https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          font-family: "Poppins", sans-serif;
        }

        .buyer-login-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(244,194,122,0.18), transparent 28%),
            radial-gradient(circle at 80% 30%, rgba(217,145,82,0.14), transparent 26%),
            radial-gradient(circle at 50% 80%, rgba(255,255,255,0.08), transparent 24%);
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 470px;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 30px;
          padding: 34px 30px 28px;
          box-shadow: 0 24px 70px rgba(0,0,0,0.35);
          color: #fff;
        }

        .login-badge {
          display: inline-block;
          padding: 9px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.16);
          font-size: 12px;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          margin-bottom: 18px;
          font-weight: 700;
          color: #f7e7cf;
          border: 1px solid rgba(255,255,255,0.14);
        }

        .login-title {
          margin: 0;
          font-size: 52px;
          line-height: 1.02;
          font-weight: 800;
          letter-spacing: -1px;
        }

        .login-subtitle {
          margin: 14px 0 24px;
          color: rgba(255,255,255,0.88);
          font-size: 17px;
          line-height: 1.75;
          max-width: 92%;
        }

        .feature-card {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 22px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.16);
          margin-bottom: 18px;
        }

        .feature-card::before {
          content: "";
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: rgba(244,194,122,0.16);
          top: -50px;
          left: -35px;
          filter: blur(18px);
        }

        .feature-card::after {
          content: "";
          position: absolute;
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          right: -45px;
          bottom: -60px;
          filter: blur(22px);
        }

        .feature-icon {
          position: relative;
          z-index: 1;
          width: 56px;
          height: 56px;
          min-width: 56px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.16);
        }

        .feature-text-wrap {
          position: relative;
          z-index: 1;
        }

        .feature-title {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          color: #fff;
        }

        .feature-subtext {
          margin: 5px 0 0;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255,255,255,0.82);
        }

        .err-box {
          background: rgba(179, 33, 33, 0.28);
          border: 1px solid rgba(255,255,255,0.10);
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 14px;
        }

        .msg-box {
          background: rgba(28, 164, 98, 0.26);
          border: 1px solid rgba(255,255,255,0.10);
          padding: 12px 14px;
          border-radius: 14px;
          font-size: 13px;
          line-height: 1.6;
          margin-bottom: 14px;
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
          background: linear-gradient(135deg, #ffffff, #f7f8fb);
          color: #1a1a1a;
          font-weight: 800;
          font-size: 16px;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
          box-shadow: 0 14px 32px rgba(0,0,0,0.22);
        }

        .google-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 36px rgba(0,0,0,0.25);
        }

        .google-btn:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .google-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .mini-strip {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 10px;
        }

        .mini-box {
          padding: 11px 10px;
          border-radius: 14px;
          background: rgba(255,255,255,0.14);
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .bottom-text {
          margin-top: 18px;
          text-align: center;
          font-size: 13px;
          color: rgba(255,255,255,0.74);
          line-height: 1.7;
        }

        @media (max-width: 640px) {
          .buyer-login-page {
            padding: 16px;
          }

          .login-card {
            padding: 26px 20px 22px;
            border-radius: 24px;
          }

          .login-title {
            font-size: 38px;
          }

          .login-subtitle {
            font-size: 15px;
            max-width: 100%;
          }

          .mini-strip {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="buyer-login-page">
        <div className="login-card">
          <div className="login-badge">JP Furnishing</div>

          <h2 className="login-title">Continue with Google</h2>

          <p className="login-subtitle">
            Sign in securely to explore elegant curtains, premium bedsheets,
            sofa covers, and furnishing collections.
          </p>

          <div className="feature-card">
            <div className="feature-icon">
              <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.1-5.2C29.2 35.6 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.1 7.1l6.1 5.2C38.9 37 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>
            </div>

            <div className="feature-text-wrap">
              <p className="feature-title">Fast, simple and secure sign-in</p>
              <p className="feature-subtext">
                Use your Google account for one-click access to your buyer dashboard.
              </p>
            </div>
          </div>

          {err && <div className="err-box">{err}</div>}
          {msg && <div className="msg-box">{msg}</div>}

          <button
            className="google-btn"
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <span className="google-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12S17.4 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3 0 5.8 1.1 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 44c5.1 0 9.8-2 13.3-5.2l-6.1-5.2C29.2 35.6 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.5 16.2 44 24 44z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.1 7.1l6.1 5.2C38.9 37 44 31.1 44 24c0-1.3-.1-2.4-.4-3.5z"
                />
              </svg>
            </span>
            {loading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="mini-strip">
            <div className="mini-box">Curtains</div>
            <div className="mini-box">Bedsheets</div>
            <div className="mini-box">Sofa Covers</div>
          </div>

          <p className="bottom-text">
            Google-only buyer login is now enabled for a faster and smoother experience.
          </p>
        </div>
      </div>
    </>
  );
}