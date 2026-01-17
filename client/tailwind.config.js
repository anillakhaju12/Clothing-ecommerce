/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '20/80': '20% 80%',
        'fixed': '40px 260px',
      },
      colors: {
        primary: '#0f3e8a',
        secondary: '#1e56a0',
        accent: '#163172',
      }
    },
  },
  plugins: [],
}
