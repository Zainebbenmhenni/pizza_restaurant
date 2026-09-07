import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        char: "#1C1712",       // fond quasi-noir, chaleureux (four à bois)
        crust: "#2A2117",
        semola: "#F3E6C8",     // jaune semoule / farine
        sauce: "#C1440E",      // rouge tomate cuite, pas le terracotta générique
        basil: "#4C6B3B",      // vert basilic
        mozza: "#FBF7EC"
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"]
      },
      letterSpacing: {
        tightest2: "-0.04em"
      }
    }
  },
  plugins: []
};

export default config;
