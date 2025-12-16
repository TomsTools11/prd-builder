import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#191919",
        "prussian-blue": "#021A2E",
        "yale-blue": "#014379",
        "dodger-blue": "#0d91fd",
        "cool-sky": "#5db5fe",
        "icy-blue": "#c2e3fe",
      },
    },
  },
  plugins: [],
};

export default config;
