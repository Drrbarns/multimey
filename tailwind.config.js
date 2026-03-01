/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./{app,components,libs,pages,hooks}/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#D4AF37', // metallic gold
          blue: '#003366', // deep navy blue
          light: '#F8FAFC', // very light blue/gray for backgrounds
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        handwriting: ['Pacifico', 'cursive'],
      },
    },
  },
  plugins: [],
}

