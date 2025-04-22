/** @type {import('@tailwindcss').config} */
module.exports = {
    content: ["./**/*.{html,js,jsx,ts,tsx}"],
    theme: {
      extend: {
        backgroundImage:{
            "home": "url('/assets/bg.png')"
        }
      },
    },
    plugins: [],
  };