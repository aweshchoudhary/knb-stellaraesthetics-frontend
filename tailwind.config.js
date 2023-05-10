/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,html}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        paper: "var(--paper)",
        bg: "var(--background)",
        textColor: "var(--text-color)",
        borderColor: "var(--border-color)",
      },
    },
  },
  plugins: [],
};
