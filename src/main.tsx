import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Self-healing mechanism: Automatically unregister any stale service workers and purge caches to prevent black screens
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister().then((success) => {
        if (success) console.log("✓ Stale service worker successfully unregistered to prevent blank screens.");
      });
    }
  });
}

if (typeof window !== "undefined" && "caches" in window) {
  window.caches.keys().then((names) => {
    for (const name of names) {
      window.caches.delete(name).then(() => {
        console.log(`✓ Purged cache index: ${name}`);
      });
    }
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
