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
        "navy-deep": "#0B1E3A",
        "navy-base": "#16294D",
        "red-signal": "#D81F3C",
        ivory: "#F6F3EC",
        slate: "#5B6472",
        "gold-hairline": "#C9A15A",
        "border-hairline": "rgba(11, 30, 58, 0.08)",
        "bg-primary": "var(--color-bg-primary)",
        "bg-inverse": "var(--color-bg-inverse)",
        "text-primary": "var(--color-text-primary)",
        "text-inverse": "var(--color-text-inverse)",
        "text-muted": "var(--color-text-muted)",
        accent: "var(--color-accent)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2rem, 1.4rem + 3vw, 2.75rem)", { lineHeight: "1.15" }],
        "display-lg": ["clamp(1.5rem, 1.1rem + 2vw, 2rem)", { lineHeight: "1.2" }],
        "display-md": ["clamp(1.25rem, 1rem + 1vw, 1.625rem)", { lineHeight: "1.25" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        "body-md": ["16px", { lineHeight: "1.6" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        caption: ["12px", { lineHeight: "1.4" }],
      },
      spacing: {
        "space-1": "8px",
        "space-2": "16px",
        "space-3": "24px",
        "space-4": "32px",
        "space-6": "48px",
        "space-8": "64px",
        "space-12": "96px",
      },
      borderRadius: {
        "radius-sm": "2px",
        "radius-md": "6px",
        "radius-lg": "12px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(11, 30, 58, 0.08)",
        "card-hover": "0 8px 20px rgba(11, 30, 58, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
