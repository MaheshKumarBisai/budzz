/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors with new palette
        primary: '#355070', // Dark Blue
        secondary: '#b56576', // Pink
        accent: '#e56b6f', // Coral
        background: '#FFFFFF',
        card: '#F9FAFB',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',

        // Dark theme colors with new palette
        dark: {
          primary: '#eaac8b',    // Light Orange
          secondary: '#b56576',  // Pink
          accent: '#e56b6f',     // Coral
          background: '#355070', // Dark Blue
          card: '#6d597a',       // Purple
          'text-primary': '#F9FAFB',
          'text-secondary': '#9CA3AF',
          border: '#b56576',     // Pink
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
}
