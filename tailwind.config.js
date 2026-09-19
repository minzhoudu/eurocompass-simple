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
          black: {
            DEFAULT: "#141414",
            900: "#0b0b0c",
            800: "#141414",
            700: "#232326",
          },
          yellow: {
            DEFAULT: "#f5c400",
            50: "#fffbea",
            100: "#fff3c4",
            200: "#fce588",
            300: "#fad65f",
            400: "#f7c948",
            500: "#f5c400",
            600: "#d1a300",
            700: "#a67f00",
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
