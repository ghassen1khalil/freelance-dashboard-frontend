/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  //darkMode: "selector",
  theme: {
    extend: {
      darkMode: ['selector', '[data-mode="dark-theme"]'],  // dark-theme class
    },
  },
  plugins: [require('tailwindcss-primeui')]
};


