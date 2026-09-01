/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#355E3B',
        dark: '#111111',
        cream: '#F8F5F0',
      }
    },
  },
  plugins: [],
}