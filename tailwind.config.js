// filepath: /home/francisco/Workspace/gamer-fix/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        extend: {}
    },
    plugins: [require('daisyui')],
    daisyui: {
        themes: [
            {
                'gamer-light': {
                    primary: '#2563EB',
                    secondary: '#1E40AF',
                    accent: '#06B6D4',
                    neutral: '#1F2937',
                    'base-100': '#ffffff',
                    'base-200': '#F3F4F6',
                    'base-300': '#E5E7EB',
                    info: '#3ABFF8',
                    success: '#36D399',
                    warning: '#FBBD23',
                    error: '#F87272'
                },
                'gamer-dark': {
                    primary: '#3b82f6', // Un azul más brillante para modo oscuro
                    secondary: '#60a5fa',
                    accent: '#22d3ee',
                    neutral: '#d1d5db', // Texto más claro
                    'base-100': '#1f2937', // Fondo principal oscuro
                    'base-200': '#111827', // Fondo secundario más oscuro
                    'base-300': '#0f172a',
                    info: '#3ABFF8',
                    success: '#36D399',
                    warning: '#FBBD23',
                    error: '#F87272'
                }
            }
        ],
        darkTheme: 'gamer-dark' // Tema oscuro por defecto
    }
};