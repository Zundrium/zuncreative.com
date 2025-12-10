/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            transitionProperty: {
                "opacity-transform": "opacity, transform",
                "opacity-visibility": "opacity, visibility",
            },
            fontFamily: {
                sans: ['Inter Variable', 'sans-serif'],
                serif: ['Playfair Display Variable', 'serif'],
            },
            colors: {
                // Add any custom colors if needed
            },
            borderRadius: {
                '4xl': '2rem',
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
    ],
    darkMode: 'class',
}
