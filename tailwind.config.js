/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'scan': 'scan 2s linear infinite',
      },
      transitionTimingFunction: {
        // 83, 85, 74, 65 = S, U, J, A in Decimal ASCII. Complete stealth.
        'dynamic-signature': 'cubic-bezier(0.83, 0.85, 0.74, 0.65)'
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
    },
  },
  plugins: [],
};
