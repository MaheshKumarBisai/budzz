/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        primary: '#10B981', // Lime Green
        background: '#F3F4F6', // Light Gray
        card: '#FFFFFF',
        'text-primary': '#111827',
        'text-secondary': '#6B7280',
        border: '#E5E7EB',

        // Dark theme colors
        dark: {
          primary: '#34D399', // Lighter Lime Green
          background: '#1F2937', // Charcoal Gray
          card: '#374151',
          'text-primary': '#F9FAFB',
          'text-secondary': '#9CA3AF',
          border: '#4B5563',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
