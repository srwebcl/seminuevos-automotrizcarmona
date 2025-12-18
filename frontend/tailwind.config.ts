import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                carmona: {
                    black: '#000000',
                    dark: '#111111',
                    gray: '#f3f4f6',
                },
                premium: {
                    gold: '#D4AF37',
                    light: '#F3E5AB',
                    dark: '#996515',
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                outfit: ['var(--font-outfit)', 'sans-serif'],
            },
            animation: {
                'pulse-gold': 'pulse-gold 2s infinite',
                'pulse-green': 'pulse-green 2s infinite',
            },
            keyframes: {
                'pulse-gold': {
                    '0%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0.7)' },
                    '70%': { boxShadow: '0 0 0 10px rgba(212, 175, 55, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0)' },
                },
                'pulse-green': {
                    '0%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0.7)' },
                    '70%': { boxShadow: '0 0 0 15px rgba(37, 211, 102, 0)' },
                    '100%': { boxShadow: '0 0 0 0 rgba(37, 211, 102, 0)' },
                }
            }
        },
    },
    plugins: [],
};
export default config;
