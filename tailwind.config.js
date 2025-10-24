export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        sans: ['Noto Sans', 'sans-serif']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
};
