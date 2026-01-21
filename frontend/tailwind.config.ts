// import type { Config } from 'tailwindcss'

// const config: Config = {
//   content: [
//     './app/**/*.{ts,tsx}',
//     './src/**/*.{ts,tsx}',
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// export default config

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        fadeSlide: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeSlide: "fadeSlide 0.4s ease-out",
      },
    },
  },
  plugins: [],
};

