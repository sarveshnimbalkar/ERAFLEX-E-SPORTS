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
          dark: "#050510", // Deep Space Purple-Black
          surface: "#0f0c29", // Cyber Void
          accent: "#ff0055", // Hot Pink/Red
          gold: "#ffaa00",
          success: "#39ff14", // Toxic Acid Green
          cyan: "#00f0ff", // Outrun Cyan
          purple: "#7000ff", // Electric Purple
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
