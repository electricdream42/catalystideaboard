/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'montserrat': ['Montserrat', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        // Add custom colors here if needed
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-out forwards',
        'pulse-custom': 'pulseCustom 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseCustom: {
          '0%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 0.4, transform: 'scale(1.05)' },
          '100%': { opacity: 0.3, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
