/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Keeping class-based dark mode for potential future flexibility
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--accent-color)',
        },
        background: {
          DEFAULT: 'var(--primary-background)',
          card: 'var(--card-background)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
