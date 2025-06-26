
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)', // #D9534F (Red-Orange)
        secondary: 'var(--color-secondary)', // #5CB85C (Green)
        accent: 'var(--color-accent)', // #F0AD4E (Orange)
        background: 'var(--color-background)', // #F8F9FA (Light Gray)
        textPrimary: 'var(--color-text-primary)', // #333333 (Dark Gray)
        textSecondary: 'var(--color-text-secondary)', // #6C757D (Medium Gray)
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'], // Example: Using Inter font
      },
      boxShadow: {
        'top': '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -2px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
