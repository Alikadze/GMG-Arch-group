/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Charcoal / graphite - the "steel & shadow" of the brand
        ink: {
          DEFAULT: '#16181d',
          950: '#0f1115',
          900: '#16181d',
          800: '#1f2329',
          700: '#2a2f38',
          600: '#3a404b',
          500: '#525966',
        },
        // Concrete - warm neutral light surfaces
        concrete: {
          DEFAULT: '#f5f4f1',
          50: '#faf9f7',
          100: '#f5f4f1',
          200: '#eceae4',
          300: '#ddd9d0',
          400: '#c4beb1',
          500: '#a29a89',
        },
        // Safety orange - the brand accent
        accent: {
          DEFAULT: '#f97316',
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
        },
      },
      fontFamily: {
        display: ['Oswald', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        display: '0.02em',
      },
      boxShadow: {
        card: '0 10px 40px -12px rgba(22, 24, 29, 0.18)',
        'card-hover': '0 24px 60px -12px rgba(22, 24, 29, 0.30)',
        accent: '0 12px 30px -8px rgba(249, 115, 22, 0.45)',
      },
      backgroundImage: {
        'grid-lines':
          'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
}
