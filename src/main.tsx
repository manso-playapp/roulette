import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { setupFirestore } from "./scripts/setupFirestore";

// Hacer disponible la función de setup globalmente para desarrollo
(window as any).setupFirestore = setupFirestore;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
