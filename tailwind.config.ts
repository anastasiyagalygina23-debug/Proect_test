import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      colors: {
        void: "#040404",
        paper: "#f0e9df",
        accent: "#ff3d5a",
        champagne: "#b8956c",
        whisper: "#7a736a",
        line: "rgba(240, 233, 223, 0.1)",
        ink: "#040404",
        cream: "#f0e9df",
        gold: "#b8956c",
        muted: "#7a736a",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        marquee: "marquee 28s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
