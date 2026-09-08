/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cockpit: {
          bg: '#0B0F17',
          surface: '#121824',
          card: '#161F30',
          cardHover: '#1D283E',
          border: 'rgba(255, 255, 255, 0.08)',
          subtle: '#94A3B8'
        },
        ignition: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'rev': 'revEngine 0.6s ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.03)' },
        },
        revEngine: {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.05) rotate(-2deg)' },
          '50%': { transform: 'scale(1.08) rotate(2deg)' },
          '75%': { transform: 'scale(1.03) rotate(-1deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}
