/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8f9',
          100: '#d3eef1',
          200: '#a6dce3',
          300: '#6cc3cb',
          400: '#48a8c0',
          500: '#2f8aa3',
          600: '#246d84',
          700: '#1b4a5e',
          800: '#153a4a',
          900: '#0e2a36',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 1px 3px rgba(16,24,40,.06)',
      },
    },
  },
  plugins: [],
}
