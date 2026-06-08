import React from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import "./index.css";

// PWA Installation & Service Worker Register
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js")
      .then((registration) => {
        console.log("✓ Ariana PWA Service Worker registered successfully with scope:", registration.scope);
      })
      .catch((error) => {
        console.error("✕ Service Worker registration failed:", error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
