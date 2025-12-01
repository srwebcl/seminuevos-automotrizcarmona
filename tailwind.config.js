/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
    // Aseguramos que Filament y sus componentes también sean escaneados si personalizamos vistas
    './app/Filament/**/*.php',
    './resources/views/filament/**/*.blade.php',
    './vendor/filament/**/*.blade.php',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        carmona: {
          black: '#000000',
          dark: '#111111',
          gray: '#f3f4f6',
        },
        premium: {
          gold: '#D4AF37',
          light: '#F3E5AB',
          dark: '#996515',
        }
      },
      animation: {
        'pulse-gold': 'pulse-gold 2s infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)' },
          '70%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0)' },
        }
      }
    },
  },
  plugins: [],
}
