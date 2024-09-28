/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
        screens: {
          xl: [{ min: "1150px", max: "2648px" }],
          lg: [{ min: "260px", max: "1149px" }],
        },
        fontFamily: {
          dmsans: ["DM Sans", "sans-serif"],
          poppins: ["Poppins", "sans-serif"],
          productsansr: ["productsans-regular"],
          productsansb: ["productsans-bold"],
        },
        extend: {
          keyframes: {
            marquee: {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(calc(-100% - 4rem))' },
            },
          },
          animation: {
            marquee: 'marquee 8s linear infinite',
          },
        },
      },
}
