import type { Config } from "tailwindcss";

const config: Config = {
  // Garante que o Tailwind olhe para TODOS os arquivos
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Definindo nossas cores corporativas
      colors: {
        corporate: {
          blue: '#2563eb',       // Azul Royal Principal
          'blue-dark': '#1e40af', // Azul mais escuro para hover
          slate: '#0f172a',      // Cor do Sidebar (quase preto azulado)
        }
      },
      fontFamily: {
        // Garante uma fonte limpa padrão do sistema
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', "Segoe UI", 'Roboto', "Helvetica Neue", 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
export default config;