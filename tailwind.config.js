/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/context/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ---- Brand palette (see README for the rationale) ----
        matcha: {
          50: "#F2F6EE",
          100: "#E2EBD9",
          200: "#C6D8B6",
          300: "#A6C28E",
          400: "#89AC6D",
          500: "#6F9552",
          600: "#577741",
          700: "#445D34",
          800: "#38492C",
          900: "#2C3924",
        },
        azuki: {
          50: "#FBEEEC",
          100: "#F3D2CC",
          200: "#E3A79B",
          300: "#CE7A6A",
          400: "#B65746",
          500: "#9C3D2E",
          600: "#832F22",
          700: "#6B261C",
          800: "#521D15",
          900: "#3C150F",
        },
        mustard: {
          50: "#FDF8E9",
          100: "#FBF0CB",
          200: "#F5DE97",
          300: "#EFCB63",
          400: "#E8BA3D",
          500: "#D6A526",
          600: "#B0851C",
          700: "#886717",
          800: "#634A11",
          900: "#402F0B",
        },
        cream: "#FBF6E9",
        ink: "#3A2F22",
      },
      fontFamily: {
        display: ["var(--font-kanit)", "sans-serif"],
        body: ["var(--font-sarabun)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 6px 20px -6px rgba(58, 47, 34, 0.25)",
      },
    },
  },
  plugins: [],
};
