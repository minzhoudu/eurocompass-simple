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
          // Amber gold accent - used sparingly (buttons, highlights),
          // never as a large solid fill. The single accent color for the
          // whole app: public site and admin both pull from this token.
          yellow: {
            DEFAULT: "#f5a623",
            50: "#fff8ec",
            100: "#feedd1",
            200: "#fddba3",
            300: "#fbc470",
            400: "#f8ae49",
            500: "#f5a623",
            600: "#d98f12",
            700: "#b5790e",
          },
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 1px 3px 0 rgba(0, 0, 0, 0.08)",
        cardHover:
          "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)",
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
