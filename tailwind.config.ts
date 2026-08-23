import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CivicVoice brand palette
        primary: "#855300",
        "on-primary": "#ffffff",
        "primary-container": "#f59e0b",
        "on-primary-container": "#613b00",
        "primary-fixed": "#ffddb8",
        "primary-fixed-dim": "#ffb95f",
        "on-primary-fixed": "#2a1700",
        "on-primary-fixed-variant": "#653e00",
        "inverse-primary": "#ffb95f",

        secondary: "#545f73",
        "on-secondary": "#ffffff",
        "secondary-container": "#d5e0f8",
        "on-secondary-container": "#586377",
        "secondary-fixed": "#d8e3fb",
        "secondary-fixed-dim": "#bcc7de",
        "on-secondary-fixed": "#111c2d",
        "on-secondary-fixed-variant": "#3c475a",

        tertiary: "#505f76",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#a2b2cb",
        "on-tertiary-container": "#35455a",
        "tertiary-fixed": "#d3e4fe",
        "tertiary-fixed-dim": "#b7c8e1",
        "on-tertiary-fixed": "#0b1c30",
        "on-tertiary-fixed-variant": "#38485d",

        background: "#f7f9fb",
        "on-background": "#191c1e",

        surface: "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-bright": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-variant": "#e0e3e5",
        "surface-tint": "#855300",
        "on-surface": "#191c1e",
        "on-surface-variant": "#534434",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f3",

        outline: "#867461",
        "outline-variant": "#d8c3ad",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Status colors
        "status-reported-bg": "#e0e3e5",
        "status-reported-text": "#191c1e",
        "status-progress-bg": "#d5e0f8",
        "status-progress-text": "#545f73",
        "status-resolved-bg": "#dcfce7",
        "status-resolved-text": "#166534",
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        full: "9999px",
      },
      spacing: {
        "margin-mobile": "16px",
        "margin-desktop": "48px",
        gutter: "24px",
        "stack-sm": "8px",
        "stack-md": "16px",
        "stack-lg": "32px",
        "container-max": "1280px",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        "headline-lg": [
          "32px",
          { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg-mobile": [
          "24px",
          { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "headline-sm": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "label-md": [
          "14px",
          { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "600" },
        ],
        "label-sm": ["12px", { lineHeight: "16px", fontWeight: "500" }],
      },
      boxShadow: {
        subtle: "0px 4px 12px rgba(30, 41, 59, 0.05)",
        hover: "0px 8px 24px rgba(30, 41, 59, 0.08)",
        "card-lift":
          "0px 2px 4px rgba(0,0,0,0.05), 0px 8px 24px rgba(30, 41, 59, 0.08)",
      },
      keyframes: {
        float: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(30px, -50px) scale(1.1)" },
          "100%": { transform: "translate(-20px, 20px) scale(0.9)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 10s infinite ease-in-out alternate",
        "float-slow": "float 15s infinite ease-in-out alternate",
        "float-delayed": "float 10s -5s infinite ease-in-out alternate",
        "fade-in": "fade-in 0.4s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
