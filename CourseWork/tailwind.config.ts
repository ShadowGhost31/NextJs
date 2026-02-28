import type { Config } from "tailwindcss";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "brand-blue": "#26A0D8",
        "brand-orange": "#F59420",
        "brand-yellow": "#F9CD3E",
        "brand-green": "#99C14F",
        "brand-deep": "#0B5C74",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(148,163,184,0.25), 0 18px 40px rgba(0,0,0,0.45)",
      },
    },
  },
  plugins: [lineClamp],
};
export default config;
