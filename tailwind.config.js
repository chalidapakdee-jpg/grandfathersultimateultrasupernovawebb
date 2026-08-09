/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signature palette: Matcha green, Azuki Red, Pale Mustard Yellow
        matcha: {
          light: "#DCE8CB",
          DEFAULT: "#8FA876",
          dark: "#5F7A48",
        },
        azuki: {
          light: "#D98B8B",
          DEFAULT: "#A13D3D",
          dark: "#7A2C2C",
        },
        mustard: {
          light: "#F6EEC9",
          DEFAULT: "#E8D9A0",
          dark: "#C9B36F",
        },
        cream: "#FBF6EA",
        ink: "#2E2A22",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        leaf: "2rem 0.5rem 2rem 0.5rem",
        pill: "999px",
      },
      boxShadow: {
        soft: "0 6px 20px -6px rgba(46, 42, 34, 0.18)",
      },
    },
  },
  plugins: [],
};
