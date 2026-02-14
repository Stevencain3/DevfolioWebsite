/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        olive: "#4A523D",
        "olive-dark": "#2D3326",
        beige: "#B8A79A",
        cream: "#E8E9D7",
      },
      borderRadius: {
        "hero-card": "40px",
      },
      boxShadow: {
        "btn-3d": "8px 8px 0 rgba(0,0,0,0.5)",
      },
      fontFamily: {
        heading: ['"Bebas Neue"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
