import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {}, // Deixamos vazio para usar o padrão (blue-600, slate-900, etc)
  },
  plugins: [],
};
export default config;