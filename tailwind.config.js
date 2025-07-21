/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "chat-bg": "linear-gradient(135deg, #0f172a, #1e293b)",
      },
      screens: {
        smx: { max: "925px" },
      },
    },
  },
  plugins: [],
};
