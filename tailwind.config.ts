import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        forum: {
          ink: "#06142e",
          navy: "#0a2350",
          deep: "#0d2f6b",
          blue: "#1f56b3",
          sky: "#4f8fe6",
          mist: "#e8f0fb",
          sunset: "#f39a35",
          ember: "#e2702a",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "-apple-system", "'Segoe UI'", "Roboto", "sans-serif"],
      },
      boxShadow: {
        card: "0 18px 40px rgba(6, 20, 46, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
