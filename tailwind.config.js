/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/public/*.{ejs,html,js}",
    "./src/public/*/*.{ejs,html,js}",
    "./src/public/*/*/*.{ejs,html,js}",
    "./src/public/*/*/*/*.{ejs,html,js}",
    "./src/public/*/*/*/*.{ejs,html,js}",
    "./src/public/*/*/*/*/*.{ejs,html,js}",
    "./src/public/*/*/*/*/*/*.{ejs,html,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        main: "#1a1a1a",
        dark: {
          background: "#141414",
        },
      },
    },
  },
  plugins: [],
};
