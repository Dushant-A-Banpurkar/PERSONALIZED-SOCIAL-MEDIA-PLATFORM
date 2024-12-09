/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'edu-hand': ['"Edu AU VIC WA NT Hand"', 'cursive'],
      },
    },
  },
  plugins: [],
};
