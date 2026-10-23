/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0e382f',       // Deep pine green
          primary: '#155e4b',    // Forest emerald
          light: '#1f7a62',      // Soft emerald
          subtle: '#e6f4f0',     // Gentle mint highlight
          accent: '#b45309',     // Amber
        },
        waste: {
          organic: '#15803d',    // Green (Biodegradable)
          recyclable: '#2563eb', // Blue (Dry Recyclables)
          inorganic: '#475569',  // Slate (Non-Recyclable)
          ewaste: '#d97706',     // Amber/Orange (E-Waste)
          hazardous: '#dc2626',  // Red (Hazardous / Chemical)
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
