/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#021a0a',
        'sidebar-hover': '#052e16',
        'sidebar-active': '#0a3d1a',
        'sidebar-border': '#0d4a22',
        brand: {
          DEFAULT: '#16a34a',
          50: '#f0fdf4',
          100: '#dcfce7',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
        },
        hot: { DEFAULT: '#ef4444', bg: '#fef2f2', border: '#fecaca', text: '#b91c1c' },
        warm: { DEFAULT: '#f59e0b', bg: '#fffbeb', border: '#fde68a', text: '#b45309' },
        cold: { DEFAULT: '#6366f1', bg: '#eef2ff', border: '#c7d2fe', text: '#4338ca' },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
      },
    },
  },
  plugins: [],
}

