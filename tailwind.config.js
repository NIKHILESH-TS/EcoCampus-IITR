/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hallmark: {
          dark: '#0e382f',       // Deep pine green
          primary: '#155e4b',    // Rich forest emerald
          light: '#237a63',      // Soft emerald
          accent: '#c05621',     // Warm terracotta / amber
          gold: '#d97706',       // Golden amber
          cream: '#faf8f5',      // Hallmark warm ivory canvas
          card: '#ffffff',       // Pure card surface
          muted: '#f0ece4',      // Soft warm stone
          subtle: '#64748b',     // Balanced slate
          border: '#e7dfd5',     // Gentle warm border
        },
        waste: {
          organic: '#15803d',    // Green
          recyclable: '#2563eb', // Blue
          inorganic: '#475569',  // Grey/Black
          ewaste: '#d97706',     // Amber/Orange
          hazardous: '#dc2626',  // Red
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(14, 56, 47, 0.06), 0 2px 6px -1px rgba(14, 56, 47, 0.04)',
        'lifted': '0 10px 30px -4px rgba(14, 56, 47, 0.12), 0 4px 10px -2px rgba(14, 56, 47, 0.06)',
        'glow': '0 0 25px rgba(21, 94, 75, 0.25)',
      }
    },
  },
  plugins: [],
}
