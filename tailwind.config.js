/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Exo", "sans-serif"],
      },
      colors: {
        brand: {
          // Soft ink for text/borders - no longer used as large panel fills.
          black: {
            DEFAULT: "#1e293b",
            900: "#1e293b",
            800: "#334155",
            700: "#475569",
          },
          // Light, warm yellow accent - used sparingly (buttons, highlights),
          // never as a large solid fill.
          yellow: {
            DEFAULT: "#ffc94d",
            50: "#fffdf5",
            100: "#fff6dd",
            200: "#ffecb3",
            300: "#ffdf85",
            400: "#ffd35c",
            500: "#ffc94d",
            600: "#f0b22e",
            700: "#c98a12",
          },
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        cardHover:
          "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
      },
      // Legacy tokens, still used by pages that haven't migrated to the brand.* palette yet
      backgroundColor: {
        primaryYellow: "#fff312c5",
        primaryBlue: "#2a4060",
      },
      textColor: {
        primaryYellow: "#fff312c5",
        primaryBlue: "#2a4060",
      },
      borderColor: {
        primaryYellow: "#fff312c5",
        primaryBlue: "#2a4060",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        'input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button':
          {
            WebkitAppearance: "none",
            margin: 0,
          },
        'input[type="number"]': {
          MozAppearance: "textfield",
        },
      });
    },
  ],
};
