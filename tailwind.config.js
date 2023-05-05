/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'red': '#F02E65',
        'green': '#00E5B9',
        'darkblue': '#0E2439'
      },
    },
  },
  plugins: [],
}
