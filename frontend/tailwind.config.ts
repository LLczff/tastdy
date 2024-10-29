import type { Config } from "tailwindcss";

const config: Config = {
  important: true,
  future: {
    // this will prevent mobile device from hover effects
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "576px",
      },
      colors: {
        logo: "#006740",
        primary: "#008f58",
        secondary: "#00a365",
      },
      fontFamily: {
        dance: ["var(--font-dance)", "cursive"],
        "bodoni-moda": ["var(--font-bodoni-moda)", "serif"],
      },
      aspectRatio: {
        "4/3": "4 / 3",
      },
    },
  },
  plugins: [],
};
export default config;
