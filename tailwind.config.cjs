/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
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
