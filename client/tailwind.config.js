/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./pages/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
    theme: {
        container: { center: true },
        screens: {
            sm: "480px",
            md: "768px",
            lg: "976px",
            xl: "1440px",
        },
        fontFamily: {
            sans: ["Montserrat"],
            serif: ["Arial"],
            mono: ["ui-monospace"],
        },
        extend: {},
    },
    plugins: [],
};
