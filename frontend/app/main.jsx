import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { registerServiceWorker } from "./registerServiceWorker";

// Register PWA Service Worker for caching and offline support
registerServiceWorker();

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <App />
  // </StrictMode>
);

