/** @type {import('tailwindcss').Config} */
export default {
  //Specify the files that we want to apply TailWind styles
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      padding: {
        md: "10rem",
      }
    },
  },
  plugins: [],
}

