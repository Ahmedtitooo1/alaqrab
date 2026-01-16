/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./App.tsx",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Cairo', 'sans-serif'],
            },
            colors: {
                // Overriding Indigo to be Royal Blue as requested
                indigo: {
                    50: '#f0f4ff',
                    100: '#e0eaff',
                    200: '#c7d9fe',
                    300: '#a3bffe',
                    400: '#7a9efc',
                    500: '#527af6',
                    600: '#4169E1', // Royal Blue (Standard)
                    700: '#3451b2',
                    800: '#2b428f',
                    900: '#263872',
                    950: '#1a2446',
                },
                slate: {
                    850: '#151e2e',
                    950: '#020617', // Deep dark for contrast
                }
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'view': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'bounce-slow': 'bounce 3s infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            boxShadow: {
                '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
                'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }
        },
    },
    plugins: [],
}
