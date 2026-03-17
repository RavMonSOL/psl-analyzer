import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brainlet-white': '#FFFFFF',
        'brainlet-black': '#000000',
        'brainlet-blue': '#0000FF',
        'brainlet-red': '#FF0000',
        'terminal-green': '#00FF00',
        'terminal-black': '#0A0A0A',
      },
      fontFamily: {
        'brainlet': ['"Luckiest Guy"', 'cursive', 'sans-serif'],
        'comic': ['"Comic Neue"', 'cursive', 'sans-serif'],
        'handwritten': ['"Gochi Hand"', 'cursive'],
        'bangers': ['"Bangers"', 'cursive'],
        'mono': ['"Fira Code"', 'monospace'],
        'courier': ['"Courier New"', 'monospace'],
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
export default config;
