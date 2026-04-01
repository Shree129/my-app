import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { UserActivityProvider } from "./context/UserActivityContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserActivityProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </UserActivityProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Service worker:
// - register only in production
// - unregister automatically in development to avoid stale cached builds
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      if (import.meta.env.PROD) {
        const reg = await navigator.serviceWorker.register("/sw.js");
        console.log("Successfully registered service worker:", reg.scope);
      } else {
        const regs = await navigator.serviceWorker.getRegistrations();
        for (const reg of regs) {
          await reg.unregister();
        }
        console.log("Development mode: old service workers unregistered");
      }
    } catch (err) {
      console.error("Service worker setup failed:", err);
    }
  });
}