// Function form (not the "<alpha-value>" string) so fill-* and stroke-* utilities
// resolve too; those don't substitute the placeholder.
const themeColor =
  (name) =>
  ({ opacityValue }) =>
    opacityValue === undefined
      ? `rgb(var(--color-${name}))`
      : `rgb(var(--color-${name}) / ${opacityValue})`;

// Semantic palette, one set of RGB channels per theme. Components use the
// semantic names (bg-surface, text-ink, border-line, ...) so switching theme
// only swaps these variables. The `dark` class lives on the public layout root.
const lightTheme = {
  "--color-surface": "249 250 251",
  "--color-raised": "255 255 255",
  "--color-sunken": "229 231 235",
  "--color-line": "229 231 235",
  "--color-line-strong": "209 213 219",
  "--color-ink": "30 41 59",
  "--color-ink-muted": "55 65 81",
  "--color-ink-subtle": "156 163 175",
  "--color-on-ink": "255 255 255",
  "--color-accent-ink": "181 121 14",
  "--color-danger": "220 38 38",
  "color-scheme": "light",
};

const darkTheme = {
  "--color-surface": "15 23 42",
  "--color-raised": "30 41 59",
  "--color-sunken": "51 65 85",
  "--color-line": "51 65 85",
  "--color-line-strong": "71 85 105",
  "--color-ink": "241 245 249",
  "--color-ink-muted": "203 213 225",
  "--color-ink-subtle": "148 163 184",
  "--color-on-ink": "15 23 42",
  "--color-accent-ink": "251 196 112",
  "--color-danger": "248 113 113",
  "color-scheme": "dark",
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Exo", "sans-serif"],
      },
      colors: {
        surface: themeColor("surface"),
        raised: themeColor("raised"),
        sunken: themeColor("sunken"),
        line: {
          DEFAULT: themeColor("line"),
          strong: themeColor("line-strong"),
        },
        ink: {
          DEFAULT: themeColor("ink"),
          muted: themeColor("ink-muted"),
          subtle: themeColor("ink-subtle"),
        },
        "on-ink": themeColor("on-ink"),
        "accent-ink": themeColor("accent-ink"),
        danger: themeColor("danger"),
        // Third-party brand colors, fixed in both themes.
        social: {
          whatsapp: "#019c4e",
          viber: "#9585ff",
        },
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
    function ({ addBase, addComponents }) {
      addBase({
        ":root": lightTheme,
        ".dark": darkTheme,
      });
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
