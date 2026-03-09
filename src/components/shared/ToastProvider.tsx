"use client";

import { Toaster } from "react-hot-toast";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#0f0c29",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          fontSize: "14px",
          fontFamily: "var(--font-indian, sans-serif)",
          letterSpacing: "0.05em",
        },
        success: {
          iconTheme: { primary: "#39ff14", secondary: "#0f0c29" },
        },
        error: {
          iconTheme: { primary: "#ff0055", secondary: "#0f0c29" },
        },
      }}
    />
  );
};
