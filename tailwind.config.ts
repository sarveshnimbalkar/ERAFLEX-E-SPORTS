import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-bebas-neue)", "sans-serif"],
        indian: ["var(--font-rajdhani)", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#0a0a0a",
          surface: "#111111",
          muted: "#1a1a1a",
          accent: "#e11d48",
          purple: "#7c3aed",
          gold: "#f59e0b",
          success: "#10b981",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        "ping-ring": "ping-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "text-shimmer": "text-shimmer 3s ease infinite",
        "marquee": "marquee 20s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-12px) rotate(1deg)" },
          "66%": { transform: "translateY(-6px) rotate(-0.5deg)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(225,29,72,0.15), 0 0 20px rgba(225,29,72,0.15)" },
          "50%": { boxShadow: "0 0 25px rgba(225,29,72,0.35), 0 0 50px rgba(225,29,72,0.35)" },
        },
        "ping-ring": {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
        "text-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "marquee": {
          "from": { transform: "translateX(0)" },
          "to": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
