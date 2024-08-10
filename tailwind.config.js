/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Exo", "sans-serif"],
      },
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
