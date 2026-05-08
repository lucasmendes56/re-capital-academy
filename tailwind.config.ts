import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0A0E1A",
        "bg-secondary": "#111827",
        "bg-card": "#1C2333",
        border: "#2A3348",
        "text-primary": "#F0F4FF",
        "text-secondary": "#8B95A9",
        "accent-gold": "#C9A84C",
        "accent-gold-light": "#E8C97A",
        "success-green": "#2ECC71",
        "error-red": "#E74C3C",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        DEFAULT: "2px",
        sm: "2px",
        md: "2px",
        lg: "2px",
        xl: "2px",
        "2xl": "2px",
      },
    },
  },
  plugins: [],
};
export default config;
