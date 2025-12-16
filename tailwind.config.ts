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
        // Primary backgrounds
        background: "#191919",
        "near-black": "#1F1F1F",
        // Accent colors
        "dark-teal": "#014379",
        teal: "#2383E2",
        "light-teal": "#5db5fe",
        "icy-blue": "#c2e3fe",
        // System colors
        success: "#27C93F",
        warning: "#FFBD2E",
        error: "#FF5F56",
        // Text colors
        "text-secondary": "#A0A0A0",
        // Legacy aliases (for backward compatibility during migration)
        "prussian-blue": "#1F1F1F",
        "yale-blue": "#014379",
        "dodger-blue": "#2383E2",
        "cool-sky": "#5db5fe",
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
      fontSize: {
        'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'heading-1': ['1.75rem', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'heading-2': ['1.125rem', { lineHeight: '1.2' }],
        'heading-3': ['1rem', { lineHeight: '1.2' }],
        'heading-4': ['0.875rem', { lineHeight: '1.6' }],
        'body-base': ['0.875rem', { lineHeight: '1.6' }],
        'body-small': ['0.75rem', { lineHeight: '1.6' }],
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
        'input': '8px',
      },
      spacing: {
        '4.5': '18px',
        '15': '60px',
        '18': '72px',
      },
    },
  },
  plugins: [],
};

export default config;
