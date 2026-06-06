import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        muted: "#667085",
        line: "#d9e2ec",
        brand: "#0f766e",
        accent: "#2563eb",
        panel: "#f8fafc"
      }
    }
  },
  plugins: []
};

export default config;
