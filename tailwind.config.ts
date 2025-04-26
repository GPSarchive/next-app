import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Include for standalone /app dir support
  ],
  theme: {
    extend: {
      colors: {
        backgroundSand: "#D6D2C4",
      },
      backgroundColor: {
        'white-10': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        fadeInLine: {
          '0%': { width: '0%', opacity: '0' },
          '100%': { width: '100%', opacity: '1' },
        },
      },
      animation: {
        fadeInLine: 'fadeInLine 1.6s ease-in-out forwards',
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

export default config;
