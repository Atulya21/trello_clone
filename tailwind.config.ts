import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        trello: {
          blue: "#0052cc",
          "blue-dark": "#0747a6",
          "blue-light": "#4c9aff",
          "bg-blue": "#1d6fa4",
        },
      },
      boxShadow: {
        card: "0 1px 0 rgba(9,30,66,.25)",
        "card-hover": "0 8px 16px -4px rgba(9,30,66,.25), 0 0 0 1px rgba(9,30,66,.08)",
        list: "0 1px 2px rgba(9,30,66,.25)",
        modal: "0 8px 40px rgba(9,30,66,.35)",
      },
    },
  },
  plugins: [],
};

export default config;
