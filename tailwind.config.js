/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f5f3ff",
          100: "#ebe6ff",
          200: "#d0c1ff",
          300: "#b59bff",
          400: "#8052ff",
          500: "#4b09ff",
          600: "#4408e6",
          700: "#2d0599",
          800: "#220473",
          900: "#18034d",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(to bottom, #532f91, #391f68)",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwindcss-primeui")],
};
