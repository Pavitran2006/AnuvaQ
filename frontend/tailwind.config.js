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
        background: '#090d16',
        surface: {
          50: '#161d2e',
          100: '#1c263b',
          200: '#26344d',
          300: '#344666',
          400: '#475b82',
        },
        quantum: {
          cyan: '#00f2ff',
          violet: '#8a2be2',
          blue: '#3b82f6',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(0,242,255,0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 16px rgba(138,43,226,0.7))' },
        }
      }
    },
  },
  plugins: [],
}
