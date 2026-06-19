/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#09090B',
        surface: '#0F1117',
        navy: '#1A1A2E',
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E2C47A',
          dim: '#8A6F2E',
        },
        muted: '#6B7280',
        border: '#1E1E2A',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C9A84C 0%, #E2C47A 50%, #C9A84C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #09090B 0%, #0F1117 100%)',
        'card-gradient': 'linear-gradient(135deg, #0F1117 0%, #1A1A2E 100%)',
      },
    },
  },
  plugins: [],
}
