import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "rgb(var(--bg) / <alpha-value>)",
          surface: "rgb(var(--surface) / <alpha-value>)",
          border: "rgb(var(--border) / <alpha-value>)",
          text: "rgb(var(--text) / <alpha-value>)",
          muted: "rgb(var(--muted) / <alpha-value>)",
          accent: "rgb(var(--accent) / <alpha-value>)",
          accentSoft: "rgb(var(--accentSoft) / <alpha-value>)",
          accentRing: "rgb(var(--accentRing) / <alpha-value>)"
        }
      },
      boxShadow: {
        soft: "0 12px 30px rgba(15, 23, 42, 0.08)",
        card: "0 10px 24px rgba(15, 23, 42, 0.10)"
      }
    },
  },
  plugins: [],
} satisfies Config;
