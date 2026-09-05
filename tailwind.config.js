/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Segoe UI", "Inter", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        canvas: "#090d16",
        msnNavy: "#0f172a",
        msnCard: "#131c31",
        msnCardHover: "#18233c",
        msnBorder: "rgba(255, 255, 255, 0.09)",
        msnBlue: "#0078d4",
        msnLightBlue: "#38bdf8",
        graphite: "#94A3B8",
        slateMuted: "#64748B",
        crimson: "#EF4444",
      },
      boxShadow: {
        msn: "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 2px 6px -1px rgba(0, 0, 0, 0.3)",
        heat: "0 0 28px rgba(239, 68, 68, 0.3)",
      },
    },
  },
  plugins: [],
};

