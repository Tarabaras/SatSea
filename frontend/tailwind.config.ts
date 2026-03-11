import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'os-bg': '#0b0b0b',
                'os-surface': '#111111',
                'os-card': '#1a1a1a',
                'os-card-hover': '#222222',
                'os-border': '#2a2a2a',
                'os-border-light': '#333333',
                'os-text': '#ffffff',
                'os-text-secondary': '#8a939b',
                'os-text-muted': '#545464',
                'os-blue': '#2081e2',
                'os-blue-hover': '#1868b7',
                'os-orange': '#F7931A',
                'os-green': '#34c759',
                'os-red': '#ff3b30',
            },
            fontFamily: {
                sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;
