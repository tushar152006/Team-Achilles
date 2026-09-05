/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "Segoe UI Variable",
          "Segoe UI",
          "-apple-system",
          "BlinkMacSystemFont",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: ["Cascadia Code", "Fira Code", "Consolas", "monospace"],
      },
      colors: {
        // Modern Figma-Grade Light Palette
        canvas: "#F8FAFC",      // Luminous Slate 50 canvas
        base: "#FFFFFF",        // Pure white card surfaces
        surfaceSubtle: "#F1F5F9", // Slate 100 for secondary pills/inputs
        hover: "#F8FAFC",
        active: "#E2E8F0",
        elevated: "#FFFFFF",
        subtle: "#E2E8F0",      // Slate 200 crisp border
        borderDefault: "#CBD5E1", // Slate 300
        borderStrong: "#94A3B8", // Slate 400

        primary: "#0F172A",     // Slate 900 for sharp headings
        secondary: "#334155",   // Slate 700 for body copy
        tertiary: "#64748B",    // Slate 500 for metadata & captions
        disabled: "#94A3B8",    // Slate 400

        accent: {
          DEFAULT: "#2563EB",   // Electric Royal Blue (Modern Figma)
          hover: "#1D4ED8",
          subtle: "#EFF6FF",    // Blue 50
        },
        semantic: {
          success: "#059669",   // Modern Emerald
          warning: "#D97706",   // Rich Amber
          danger: "#E11D48",    // Vivid Rose / Crimson (Alert)
          info: "#0284C7",       // Sky / Cyan
        },
      },
      boxShadow: {
        "figma-card": "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 10px 25px -5px rgba(15, 23, 42, 0.05)",
        "figma-hover": "0 10px 30px -5px rgba(15, 23, 42, 0.08), 0 4px 6px -2px rgba(15, 23, 42, 0.03)",
        "figma-elev": "0 20px 35px -10px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
        "elev-1": "0 1px 3px rgba(15, 23, 42, 0.05), 0 1px 2px rgba(15, 23, 42, 0.03)",
        "elev-2": "0 6px 16px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)",
        "elev-3": "0 20px 35px -10px rgba(15, 23, 42, 0.12)",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "18px",
        "2xl": "22px",
      },
    },
  },
  plugins: [],
};
