import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#020617", // Deep Slate
                foreground: "#f8fafc",
                cyber: {
                    black: "#000000",
                    dark: "#0b0f19",
                    gray: "#1e293b",
                    primary: "#6366f1", // Indigo
                    secondary: "#06b6d4", // Cyan
                    accent: "#d946ef", // Fuchsia
                    dim: "rgba(99, 102, 241, 0.1)",
                },
            },
            fontFamily: {
                mono: ["var(--font-jetbrains-mono)", "monospace"],
                sans: ["var(--font-inter)", "sans-serif"],
            },
            backgroundImage: {
                'cyber-grid': "radial-gradient(circle, rgba(99, 102, 241, 0.1) 1px, transparent 1px)",
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'cyber-gradient': 'linear-gradient(to right, #6366f1, #06b6d4)',
                'aurora': 'linear-gradient(to top right, #020617, #1e1b4b, #312e81)',
            },
            animation: {
                "aurora": "aurora 10s ease infinite",
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "blob": "blob 7s infinite",
                "drift": "drift 20s linear infinite",
            },
            keyframes: {
                aurora: {
                    "0%, 100%": { backgroundPosition: "0% 50%" },
                    "50%": { backgroundPosition: "100% 50%" },
                },
                blob: {
                    "0%": { transform: "translate(0px, 0px) scale(1)" },
                    "33%": { transform: "translate(30px, -50px) scale(1.1)" },
                    "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
                    "100%": { transform: "translate(0px, 0px) scale(1)" },
                },
                drift: {
                    "0%": { transform: "translate(0, 0)" },
                    "100%": { transform: "translate(-50%, -50%)" },
                },
            },
        },
    },
    plugins: [],
};
export default config;
