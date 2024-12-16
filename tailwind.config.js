/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'sama-light': '#7CDEE6',
        'sama-dark': '#1A105F',
      },
      fontFamily: {
        'noto': ['Noto Sans Arabic', 'sans-serif'],
      }
    },
  },
  plugins: [],
};