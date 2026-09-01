/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        audora: {
          bg: "#0a0a0f",
          surface: "#111118",
          surfaceHigh: "#1a1a24",
          border: "#ffffff14",
          accent: "#7c3aed",
          accentLight: "#8b5cf6",
          accentDark: "#6d28d9",
          green: "#10b981",
          greenDark: "#059669",
          pink: "#ec4899",
          blue: "#3b82f6",
          text: "#e2e8f0",
          muted: "#94a3b8",
          dim: "#475569",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Outfit", "Inter", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient":
          "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 40%, #0a1628 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(16,185,129,0.05) 100%)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "bounce-subtle": "bounce-subtle 1s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 10px rgba(124,58,237,0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(124,58,237,0.7)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        glow: "0 0 20px rgba(124,58,237,0.4)",
        "glow-green": "0 0 20px rgba(16,185,129,0.4)",
        card: "0 4px 24px rgba(0,0,0,0.5)",
      },
    },
  },
  plugins: [],
};
