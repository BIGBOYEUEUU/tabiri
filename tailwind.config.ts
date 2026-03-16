import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        teal:    { DEFAULT: "#0F766E", light: "#EDFAF6", mid: "#14B8A6", dark: "#0A5C55" },
        navy:    { DEFAULT: "#0B2545", dim: "#0F2A4A", light: "#EDF2FA" },
        gold:    { DEFAULT: "#D97706", light: "#FFFBEB", dark: "#B45309" },
        surface: "#F8FAFC",
        card:    "#FFFFFF",
        border:  "#E2E8F0",
        muted:   "#94A3B8",
        ink:     "#0F172A",
        ink2:    "#475569",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        sans:    ["DM Sans", "sans-serif"],
        mono:    ["DM Mono", "monospace"],
      },
      borderRadius: {
        card: "16px",
        btn:  "10px",
        pill: "999px",
      },
      boxShadow: {
        card:   "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)",
        float:  "0 8px 32px rgba(0,0,0,0.12)",
      },
      keyframes: {
        "fade-up":    { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "pulse-live": { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.4" } },
      },
      animation: {
        "fade-up":    "fade-up 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "pulse-live": "pulse-live 1.8s ease infinite",
      },
    },
  },
  plugins: [],
};
export default config;
