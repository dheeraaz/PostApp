/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        "_inter": ['Inter', 'sans-serif'],
        "_poppins": ["Poppins", "sans-serif"],            
        "_roboto" : ["Roboto", "sans-serif"]
      },
      colors: {
        '_primary': '#111727',
        '_accent': '#4e42eb'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

