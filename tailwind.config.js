/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["views/**/*.ejs", "public/**/*.js"],
  theme: {
    extend: {
      colors: {
        dark: "#121212",
        darkPrimary: "#252525",
        darkBorder: "#303030"
      },
    },
  },
  plugins: [],

  darkMode: "class",
};
