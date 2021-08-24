module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    fontFamily: {
      sans: ['ui-rounded', 'Helvetica', 'sans-serif'],
    },
    extend: {
      colors: {
        gray: {
          100: '#f8f8f8',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
