/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6'
        },
        soft: {
          gray: '#f3f4f6'
        }
      },
      boxShadow: {
        soft: '0 10px 25px rgba(0,0,0,0.06)'
      },
      borderRadius: {
        xl: '1rem'
      }
    }
  },
  plugins: []
}
