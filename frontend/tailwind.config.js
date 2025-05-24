/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7F55E0',
        secondary: '#ABAEF2',
        accent: '#CED0F8',
        background: '#e7d9f9',
    },
    },
    fontFamily: {
      sans: ['Satoshi', 'sans-serif'],
    },
    
  plugins: [],
}
}