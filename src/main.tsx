import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import AppRouter from "./router/AppRouter";
import "./index.css";
import { setupFirestore } from "./scripts/setupFirestore";

// Hacer disponible la función de setup globalmente para desarrollo
(window as any).setupFirestore = setupFirestore;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
