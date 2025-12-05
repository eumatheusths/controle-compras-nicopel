import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          blue: '#2563eb',       // Azul Royal
          slate: '#0f172a',      // Fundo do Menu
        }
      },
    },
  },
  plugins: [],
};
export default config;