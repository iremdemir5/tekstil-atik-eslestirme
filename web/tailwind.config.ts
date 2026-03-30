import type { Config } from "tailwindcss";

const config: Config = {
  // Tailwind'in class'ları kaçırmaması için kapsamı geniş tutuyoruz.
  // Yeni eklenen dashboard/upload bileşenleri ve route'lar bu glob ile yakalanır.
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        "chart-1": "hsl(var(--chart-1))",
        "chart-2": "hsl(var(--chart-2))",
        "chart-3": "hsl(var(--chart-3))",
        "chart-4": "hsl(var(--chart-4))",
        "chart-5": "hsl(var(--chart-5))",
      },
    },
  },
  plugins: [],
};
export default config;
