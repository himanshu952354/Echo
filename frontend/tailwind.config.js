export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-purple': 'rgb(118, 33, 222)',
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        'bounce-slow': 'bounce-slow 1.5s ease-in-out infinite',
        'shake-slow': 'shake-slow 2s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 1.5s ease-in-out infinite',
        'wiggle-slow': 'wiggle-slow 2s ease-in-out infinite',
        'spin': 'spin 2s linear infinite',
      },
      keyframes: {
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'shake-slow': {
          '0%, 100%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(-8deg)' },
          '75%': { transform: 'rotate(8deg)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        'wiggle-slow': {
          '0%, 100%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(-5deg) translateX(-2px)' },
          '75%': { transform: 'rotate(5deg) translateX(2px)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}