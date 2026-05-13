import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-heebo)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
        },
      },
    },
  },
  plugins: [],
};

export default config;
